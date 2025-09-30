#!/usr/bin/env python3
"""
🎵 Audio Analyzer - Analizador REAL de pistas de audio
Sistema de análisis espectral, detección de patrones y características musicales
"""

import librosa
import numpy as np
import json
import logging
from typing import Dict, List, Optional, Tuple
import os
import tempfile
import requests
from scipy import stats
from scipy.signal import find_peaks

logger = logging.getLogger(__name__)

class AudioAnalyzer:
    def __init__(self):
        self.sample_rate = 22050
        self.hop_length = 512
        self.n_fft = 2048
        
    def analyze_audio_file(self, audio_path: str) -> Dict:
        """
        Analizar archivo de audio REAL
        """
        try:
            # Cargar audio con librosa
            y, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # Análisis básico
            duration = len(y) / sr
            tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
            
            # Análisis espectral
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
            spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            
            # Análisis de tono
            pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
            pitch_mean = np.mean(pitches[pitches > 0])
            
            # Análisis de energía
            rms = librosa.feature.rms(y=y)[0]
            energy_mean = np.mean(rms)
            
            # Análisis de zero crossing rate
            zcr = librosa.feature.zero_crossing_rate(y)[0]
            zcr_mean = np.mean(zcr)
            
            # Detección de género (básica)
            genre = self._detect_genre(y, sr, tempo)
            
            # Análisis de complejidad
            complexity = self._calculate_complexity(y, sr)
            
            # Detección de secciones
            sections = self._detect_sections(y, sr)
            
            return {
                "success": True,
                "duration": float(duration),
                "tempo": float(tempo),
                "key_features": {
                    "spectral_centroid_mean": float(np.mean(spectral_centroids)),
                    "spectral_rolloff_mean": float(np.mean(spectral_rolloff)),
                    "pitch_mean": float(pitch_mean) if not np.isnan(pitch_mean) else 0,
                    "energy_mean": float(energy_mean),
                    "zcr_mean": float(zcr_mean)
                },
                "mfccs": mfccs.tolist(),
                "genre": genre,
                "complexity": complexity,
                "sections": sections,
                "beats": beats.tolist(),
                "analysis_timestamp": str(np.datetime64('now'))
            }
            
        except Exception as e:
            logger.error(f"Error analizando audio: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def analyze_audio_url(self, audio_url: str) -> Dict:
        """
        Analizar audio desde URL
        """
        try:
            # Descargar audio temporalmente
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
                response = requests.get(audio_url, timeout=30)
                response.raise_for_status()
                tmp_file.write(response.content)
                tmp_file.flush()
                
                # Analizar archivo
                result = self.analyze_audio_file(tmp_file.name)
                
                # Limpiar archivo temporal
                os.unlink(tmp_file.name)
                
                return result
                
        except Exception as e:
            logger.error(f"Error analizando URL de audio: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _detect_genre(self, y: np.ndarray, sr: int, tempo: float) -> str:
        """
        Detección básica de género musical
        """
        # Análisis de características para detección de género
        spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        
        # Reglas básicas de detección
        if tempo > 140:
            if np.mean(spectral_centroids) > 3000:
                return "Electronic/Dance"
            else:
                return "Rock/Metal"
        elif tempo > 100:
            if np.mean(spectral_centroids) > 2000:
                return "Pop"
            else:
                return "Hip-Hop"
        elif tempo > 60:
            return "Jazz/Blues"
        else:
            return "Classical/Ambient"
    
    def _calculate_complexity(self, y: np.ndarray, sr: int) -> float:
        """
        Calcular complejidad musical (0-1)
        """
        # Análisis de variabilidad espectral
        spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
        
        # Variabilidad de MFCCs
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_variance = np.var(mfccs, axis=1)
        
        # Complejidad basada en variabilidad
        complexity = (
            np.std(spectral_centroids) / np.mean(spectral_centroids) +
            np.std(spectral_rolloff) / np.mean(spectral_rolloff) +
            np.mean(mfcc_variance) / 1000
        ) / 3
        
        return min(max(complexity, 0), 1)
    
    def _detect_sections(self, y: np.ndarray, sr: int) -> List[Dict]:
        """
        Detectar secciones del audio (intro, verse, chorus, etc.)
        """
        try:
            # Análisis de novedad
            novelty = librosa.onset.onset_strength(y=y, sr=sr)
            
            # Detectar picos de novedad
            peaks, _ = find_peaks(novelty, height=np.mean(novelty))
            
            # Convertir a tiempo
            times = librosa.frames_to_time(peaks, sr=sr)
            
            sections = []
            for i, time in enumerate(times):
                section_type = self._classify_section(i, len(times))
                sections.append({
                    "start_time": float(time),
                    "type": section_type,
                    "confidence": float(novelty[peaks[i]])
                })
            
            return sections
            
        except Exception as e:
            logger.error(f"Error detectando secciones: {e}")
            return []
    
    def _classify_section(self, index: int, total_sections: int) -> str:
        """
        Clasificar tipo de sección
        """
        if index == 0:
            return "intro"
        elif index == total_sections - 1:
            return "outro"
        elif index % 4 == 0:
            return "chorus"
        else:
            return "verse"

# Instancia global
analyzer = AudioAnalyzer()

def analyze_audio(audio_path_or_url: str) -> Dict:
    """Función de conveniencia para analizar audio"""
    if audio_path_or_url.startswith('http'):
        return analyzer.analyze_audio_url(audio_path_or_url)
    else:
        return analyzer.analyze_audio_file(audio_path_or_url)
