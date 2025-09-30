/**
 * 🎵 Web Audio Generator - Sistema de Generación Musical Real
 * Genera música real usando Web Audio API con análisis inteligente
 */

class WebAudioGenerator {
    constructor() {
        this.audioContext = null;
        this.isInitialized = false;
        this.currentGeneration = null;
        this.audioBuffer = null;
        this.visualizer = null;
        
        this.init();
    }

    async init() {
        try {
            // Crear contexto de audio
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
            console.log('🎵 Web Audio Generator inicializado');
        } catch (error) {
            console.error('Error inicializando Web Audio Generator:', error);
        }
    }

    async generateMusic(prompt, options = {}) {
        if (!this.isInitialized) {
            throw new Error('Web Audio Generator no está inicializado');
        }

        try {
            // Analizar prompt
            const analysis = this.analyzePrompt(prompt);
            
            // Generar estructura musical
            const structure = this.generateStructure(analysis, options);
            
            // Crear audio buffer
            const duration = options.duration || 30;
            const sampleRate = this.audioContext.sampleRate;
            const bufferLength = sampleRate * duration;
            
            this.audioBuffer = this.audioContext.createBuffer(2, bufferLength, sampleRate);
            
            // Generar pistas
            await this.generateTracks(structure, analysis);
            
            // Aplicar efectos
            this.applyEffects(structure.effects);
            
            // Crear resultado
            const result = {
                success: true,
                audioBuffer: this.audioBuffer,
                analysis: analysis,
                structure: structure,
                duration: duration,
                sampleRate: sampleRate
            };

            // Emitir evento
            this.dispatchEvent('musicGenerated', result);
            
            return result;
            
        } catch (error) {
            console.error('Error generando música:', error);
            throw error;
        }
    }

    analyzePrompt(prompt) {
        const analysis = {
            tempo: 120,
            scale: 'C major',
            instruments: [],
            mood: 'neutral',
            energy: 5,
            style: 'electronic'
        };

        // Análisis de tempo
        if (prompt.includes('lento') || prompt.includes('slow')) {
            analysis.tempo = 80;
        } else if (prompt.includes('rápido') || prompt.includes('fast') || prompt.includes('épico')) {
            analysis.tempo = 140;
        } else if (prompt.includes('bpm')) {
            const bpmMatch = prompt.match(/(\d+)\s*bpm/i);
            if (bpmMatch) {
                analysis.tempo = parseInt(bpmMatch[1]);
            }
        }

        // Análisis de escala
        if (prompt.includes('mayor') || prompt.includes('major')) {
            analysis.scale = 'C major';
        } else if (prompt.includes('menor') || prompt.includes('minor')) {
            analysis.scale = 'A minor';
        } else if (prompt.includes('dórico') || prompt.includes('dorian')) {
            analysis.scale = 'D dorian';
        }

        // Análisis de instrumentos
        if (prompt.includes('piano')) analysis.instruments.push('piano');
        if (prompt.includes('guitarra') || prompt.includes('guitar')) analysis.instruments.push('guitar');
        if (prompt.includes('batería') || prompt.includes('drums')) analysis.instruments.push('drums');
        if (prompt.includes('bajo') || prompt.includes('bass')) analysis.instruments.push('bass');
        if (prompt.includes('sintetizador') || prompt.includes('synth')) analysis.instruments.push('synth');

        // Análisis de mood
        if (prompt.includes('alegre') || prompt.includes('happy') || prompt.includes('upbeat')) {
            analysis.mood = 'happy';
            analysis.energy = 8;
        } else if (prompt.includes('triste') || prompt.includes('sad') || prompt.includes('melancólico')) {
            analysis.mood = 'sad';
            analysis.energy = 3;
        } else if (prompt.includes('épico') || prompt.includes('epic') || prompt.includes('heroico')) {
            analysis.mood = 'epic';
            analysis.energy = 9;
        } else if (prompt.includes('misterioso') || prompt.includes('mysterious') || prompt.includes('oscuro')) {
            analysis.mood = 'mysterious';
            analysis.energy = 4;
        }

        // Análisis de estilo
        if (prompt.includes('synthwave') || prompt.includes('retro')) {
            analysis.style = 'synthwave';
        } else if (prompt.includes('cyberpunk')) {
            analysis.style = 'cyberpunk';
        } else if (prompt.includes('ambient') || prompt.includes('ambiental')) {
            analysis.style = 'ambient';
        } else if (prompt.includes('electronic') || prompt.includes('electrónica')) {
            analysis.style = 'electronic';
        }

        return analysis;
    }

    generateStructure(analysis, options) {
        const structure = {
            sections: [],
            effects: [],
            instruments: analysis.instruments.length > 0 ? analysis.instruments : ['synth', 'drums', 'bass']
        };

        // Generar secciones basadas en duración
        const duration = options.duration || 30;
        const sectionDuration = duration / 4; // 4 secciones: intro, verse, chorus, outro

        structure.sections = [
            { name: 'intro', duration: sectionDuration, intensity: 0.3 },
            { name: 'verse', duration: sectionDuration * 2, intensity: 0.7 },
            { name: 'chorus', duration: sectionDuration, intensity: 1.0 },
            { name: 'outro', duration: sectionDuration, intensity: 0.2 }
        ];

        // Generar efectos basados en mood y estilo
        if (analysis.mood === 'mysterious') {
            structure.effects.push('reverb', 'delay');
        } else if (analysis.mood === 'epic') {
            structure.effects.push('compressor', 'distortion');
        } else if (analysis.style === 'synthwave') {
            structure.effects.push('reverb', 'chorus');
        }

        return structure;
    }

    async generateTracks(structure, analysis) {
        const leftChannel = this.audioBuffer.getChannelData(0);
        const rightChannel = this.audioBuffer.getChannelData(1);
        const sampleRate = this.audioBuffer.sampleRate;

        let currentTime = 0;

        for (const section of structure.sections) {
            const sectionSamples = Math.floor(section.duration * sampleRate);
            const endTime = currentTime + sectionSamples;

            // Generar cada instrumento
            for (const instrument of structure.instruments) {
                await this.generateInstrumentTrack(
                    instrument,
                    leftChannel,
                    rightChannel,
                    currentTime,
                    endTime,
                    section,
                    analysis
                );
            }

            currentTime = endTime;
        }
    }

    async generateInstrumentTrack(instrument, leftChannel, rightChannel, startTime, endTime, section, analysis) {
        const sampleRate = this.audioBuffer.sampleRate;
        const duration = (endTime - startTime) / sampleRate;

        switch (instrument) {
            case 'synth':
                this.generateSynthTrack(leftChannel, rightChannel, startTime, endTime, section, analysis);
                break;
            case 'drums':
                this.generateDrumTrack(leftChannel, rightChannel, startTime, endTime, section, analysis);
                break;
            case 'bass':
                this.generateBassTrack(leftChannel, rightChannel, startTime, endTime, section, analysis);
                break;
            case 'piano':
                this.generatePianoTrack(leftChannel, rightChannel, startTime, endTime, section, analysis);
                break;
            case 'guitar':
                this.generateGuitarTrack(leftChannel, rightChannel, startTime, endTime, section, analysis);
                break;
        }
    }

    generateSynthTrack(leftChannel, rightChannel, startTime, endTime, section, analysis) {
        const sampleRate = this.audioBuffer.sampleRate;
        const frequency = this.getFrequencyFromScale(analysis.scale, 4); // Octava 4
        const intensity = section.intensity * (analysis.energy / 10);

        for (let i = startTime; i < endTime; i++) {
            const t = (i - startTime) / sampleRate;
            const envelope = this.getEnvelope(t, section.duration);
            
            // Generar onda senoidal con modulación
            const wave = Math.sin(2 * Math.PI * frequency * t) * envelope * intensity;
            
            // Aplicar modulación de frecuencia para textura
            const modFreq = frequency * (1 + 0.1 * Math.sin(2 * Math.PI * 0.5 * t));
            const modWave = Math.sin(2 * Math.PI * modFreq * t) * envelope * intensity * 0.5;
            
            const finalWave = (wave + modWave) * 0.3;
            
            leftChannel[i] += finalWave;
            rightChannel[i] += finalWave * 0.8; // Slight stereo effect
        }
    }

    generateDrumTrack(leftChannel, rightChannel, startTime, endTime, section, analysis) {
        const sampleRate = this.audioBuffer.sampleRate;
        const tempo = analysis.tempo;
        const beatInterval = 60 / tempo; // segundos por beat
        const beatSamples = Math.floor(beatInterval * sampleRate);

        for (let i = startTime; i < endTime; i += beatSamples) {
            if (i + beatSamples < endTime) {
                // Kick drum
                this.addKickDrum(leftChannel, rightChannel, i, sampleRate, section.intensity);
                
                // Snare en beats 2 y 4
                const beatInMeasure = Math.floor((i - startTime) / beatSamples) % 4;
                if (beatInMeasure === 1 || beatInMeasure === 3) {
                    this.addSnareDrum(leftChannel, rightChannel, i + beatSamples / 2, sampleRate, section.intensity);
                }
            }
        }
    }

    generateBassTrack(leftChannel, rightChannel, startTime, endTime, section, analysis) {
        const sampleRate = this.audioBuffer.sampleRate;
        const frequency = this.getFrequencyFromScale(analysis.scale, 2); // Octava 2 (bajo)
        const intensity = section.intensity * (analysis.energy / 10) * 0.7;

        for (let i = startTime; i < endTime; i++) {
            const t = (i - startTime) / sampleRate;
            const envelope = this.getEnvelope(t, section.duration);
            
            // Generar onda cuadrada para sonido de bajo
            const wave = Math.sign(Math.sin(2 * Math.PI * frequency * t)) * envelope * intensity;
            
            leftChannel[i] += wave * 0.4;
            rightChannel[i] += wave * 0.4;
        }
    }

    generatePianoTrack(leftChannel, rightChannel, startTime, endTime, section, analysis) {
        const sampleRate = this.audioBuffer.sampleRate;
        const intensity = section.intensity * (analysis.energy / 10) * 0.6;

        // Generar acordes
        const chordNotes = this.getChordNotes(analysis.scale);
        
        for (let i = startTime; i < endTime; i++) {
            const t = (i - startTime) / sampleRate;
            const envelope = this.getEnvelope(t, section.duration);
            
            let wave = 0;
            for (const note of chordNotes) {
                wave += Math.sin(2 * Math.PI * note * t) * envelope * intensity * 0.2;
            }
            
            leftChannel[i] += wave;
            rightChannel[i] += wave * 0.9;
        }
    }

    generateGuitarTrack(leftChannel, rightChannel, startTime, endTime, section, analysis) {
        const sampleRate = this.audioBuffer.sampleRate;
        const frequency = this.getFrequencyFromScale(analysis.scale, 3); // Octava 3
        const intensity = section.intensity * (analysis.energy / 10) * 0.5;

        for (let i = startTime; i < endTime; i++) {
            const t = (i - startTime) / sampleRate;
            const envelope = this.getEnvelope(t, section.duration);
            
            // Generar onda con armónicos para sonido de guitarra
            const fundamental = Math.sin(2 * Math.PI * frequency * t);
            const harmonic2 = Math.sin(2 * Math.PI * frequency * 2 * t) * 0.5;
            const harmonic3 = Math.sin(2 * Math.PI * frequency * 3 * t) * 0.3;
            
            const wave = (fundamental + harmonic2 + harmonic3) * envelope * intensity;
            
            leftChannel[i] += wave * 0.3;
            rightChannel[i] += wave * 0.3;
        }
    }

    addKickDrum(leftChannel, rightChannel, startTime, sampleRate, intensity) {
        const duration = 0.1; // 100ms
        const samples = Math.floor(duration * sampleRate);
        
        for (let i = 0; i < samples && startTime + i < leftChannel.length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 20); // Decay rápido
            const frequency = 60 * Math.exp(-t * 10); // Sweep de frecuencia
            
            const wave = Math.sin(2 * Math.PI * frequency * t) * envelope * intensity * 0.8;
            
            leftChannel[startTime + i] += wave;
            rightChannel[startTime + i] += wave;
        }
    }

    addSnareDrum(leftChannel, rightChannel, startTime, sampleRate, intensity) {
        const duration = 0.05; // 50ms
        const samples = Math.floor(duration * sampleRate);
        
        for (let i = 0; i < samples && startTime + i < leftChannel.length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 30); // Decay muy rápido
            
            // Ruido blanco con filtro
            const noise = (Math.random() * 2 - 1) * envelope * intensity * 0.6;
            
            leftChannel[startTime + i] += noise;
            rightChannel[startTime + i] += noise;
        }
    }

    getFrequencyFromScale(scale, octave) {
        const notes = {
            'C': 261.63,
            'D': 293.66,
            'E': 329.63,
            'F': 349.23,
            'G': 392.00,
            'A': 440.00,
            'B': 493.88
        };
        
        const root = scale.split(' ')[0];
        const baseFreq = notes[root] || 261.63;
        
        return baseFreq * Math.pow(2, octave - 4);
    }

    getChordNotes(scale) {
        const root = scale.split(' ')[0];
        const isMajor = scale.includes('major');
        
        const intervals = isMajor ? [0, 2, 4] : [0, 2, 3]; // Tónica, tercera, quinta
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const rootIndex = notes.indexOf(root);
        
        return intervals.map(interval => {
            const noteIndex = (rootIndex + interval) % 7;
            return this.getFrequencyFromScale(notes[noteIndex] + ' major', 4);
        });
    }

    getEnvelope(t, duration) {
        // ADSR Envelope
        const attack = 0.1;
        const decay = 0.2;
        const sustain = 0.7;
        const release = 0.3;
        
        if (t < attack) {
            return t / attack;
        } else if (t < attack + decay) {
            return 1 - (t - attack) / decay * (1 - sustain);
        } else if (t < duration - release) {
            return sustain;
        } else {
            return sustain * (duration - t) / release;
        }
    }

    applyEffects(effects) {
        if (!this.audioBuffer) return;

        const leftChannel = this.audioBuffer.getChannelData(0);
        const rightChannel = this.audioBuffer.getChannelData(1);

        for (const effect of effects) {
            switch (effect) {
                case 'reverb':
                    this.applyReverb(leftChannel, rightChannel);
                    break;
                case 'delay':
                    this.applyDelay(leftChannel, rightChannel);
                    break;
                case 'compressor':
                    this.applyCompressor(leftChannel, rightChannel);
                    break;
                case 'distortion':
                    this.applyDistortion(leftChannel, rightChannel);
                    break;
                case 'chorus':
                    this.applyChorus(leftChannel, rightChannel);
                    break;
            }
        }
    }

    applyReverb(leftChannel, rightChannel) {
        const reverbTime = 0.5;
        const sampleRate = this.audioBuffer.sampleRate;
        const reverbSamples = Math.floor(reverbTime * sampleRate);
        
        for (let i = 0; i < leftChannel.length - reverbSamples; i++) {
            const reverbAmount = 0.3;
            leftChannel[i] += leftChannel[i + reverbSamples] * reverbAmount;
            rightChannel[i] += rightChannel[i + reverbSamples] * reverbAmount;
        }
    }

    applyDelay(leftChannel, rightChannel) {
        const delayTime = 0.25;
        const sampleRate = this.audioBuffer.sampleRate;
        const delaySamples = Math.floor(delayTime * sampleRate);
        
        for (let i = delaySamples; i < leftChannel.length; i++) {
            const delayAmount = 0.4;
            leftChannel[i] += leftChannel[i - delaySamples] * delayAmount;
            rightChannel[i] += rightChannel[i - delaySamples] * delayAmount;
        }
    }

    applyCompressor(leftChannel, rightChannel) {
        const threshold = 0.5;
        const ratio = 4;
        
        for (let i = 0; i < leftChannel.length; i++) {
            const leftLevel = Math.abs(leftChannel[i]);
            const rightLevel = Math.abs(rightChannel[i]);
            
            if (leftLevel > threshold) {
                leftChannel[i] = threshold + (leftLevel - threshold) / ratio;
            }
            if (rightLevel > threshold) {
                rightChannel[i] = threshold + (rightLevel - threshold) / ratio;
            }
        }
    }

    applyDistortion(leftChannel, rightChannel) {
        const gain = 2;
        const threshold = 0.7;
        
        for (let i = 0; i < leftChannel.length; i++) {
            leftChannel[i] = Math.tanh(leftChannel[i] * gain) * threshold;
            rightChannel[i] = Math.tanh(rightChannel[i] * gain) * threshold;
        }
    }

    applyChorus(leftChannel, rightChannel) {
        const sampleRate = this.audioBuffer.sampleRate;
        const lfoFreq = 0.5; // Hz
        const depth = 0.01; // 10ms
        
        for (let i = 0; i < leftChannel.length; i++) {
            const t = i / sampleRate;
            const lfo = Math.sin(2 * Math.PI * lfoFreq * t);
            const delaySamples = Math.floor(depth * sampleRate * (1 + lfo));
            
            if (i >= delaySamples) {
                leftChannel[i] += leftChannel[i - delaySamples] * 0.3;
                rightChannel[i] += rightChannel[i - delaySamples] * 0.3;
            }
        }
    }

    exportToWAV() {
        if (!this.audioBuffer) {
            throw new Error('No hay audio para exportar');
        }

        const length = this.audioBuffer.length;
        const sampleRate = this.audioBuffer.sampleRate;
        const leftChannel = this.audioBuffer.getChannelData(0);
        const rightChannel = this.audioBuffer.getChannelData(1);
        
        // Crear buffer WAV
        const buffer = new ArrayBuffer(44 + length * 2 * 2);
        const view = new DataView(buffer);
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * 2 * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 2, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2 * 2, true);
        view.setUint16(32, 4, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length * 2 * 2, true);
        
        // Escribir datos de audio
        let offset = 44;
        for (let i = 0; i < length; i++) {
            const left = Math.max(-1, Math.min(1, leftChannel[i]));
            const right = Math.max(-1, Math.min(1, rightChannel[i]));
            
            view.setInt16(offset, left * 0x7FFF, true);
            offset += 2;
            view.setInt16(offset, right * 0x7FFF, true);
            offset += 2;
        }
        
        return new Blob([buffer], { type: 'audio/wav' });
    }

    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    // Métodos de control
    play() {
        if (!this.audioBuffer) return;
        
        const source = this.audioContext.createBufferSource();
        source.buffer = this.audioBuffer;
        source.connect(this.audioContext.destination);
        source.start();
        
        this.currentGeneration = source;
    }

    stop() {
        if (this.currentGeneration) {
            this.currentGeneration.stop();
            this.currentGeneration = null;
        }
    }

    pause() {
        if (this.currentGeneration) {
            this.currentGeneration.stop();
            this.currentGeneration = null;
        }
    }
}

// Exportar para uso global
export default WebAudioGenerator;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebAudioGenerator;
} else {
    window.WebAudioGenerator = WebAudioGenerator;
}

