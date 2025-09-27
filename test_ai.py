#!/usr/bin/env python3
"""
Script de prueba para verificar la integración con Ollama
"""

import requests
import json

def test_ollama_connection():
    """Probar conexión con Ollama"""
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code == 200:
            models = response.json()
            print("✅ Ollama está funcionando correctamente")
            print(f"📊 Modelos disponibles: {len(models['models'])}")
            for model in models['models']:
                print(f"   - {model['name']}")
            return True
        else:
            print("❌ Error conectando con Ollama")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_qwen_generation():
    """Probar generación con Qwen 2.5"""
    try:
        payload = {
            "model": "qwen2.5:7b",
            "prompt": "Analiza este prompt musical: 'cyberpunk electronic track with heavy bass'",
            "stream": False
        }
        
        response = requests.post(
            "http://localhost:11434/api/generate",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Qwen 2.5 está funcionando correctamente")
            print(f"🤖 Respuesta: {result['response'][:100]}...")
            return True
        else:
            print("❌ Error generando con Qwen 2.5")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Probando integración con Ollama...")
    print("=" * 50)
    
    if test_ollama_connection():
        test_qwen_generation()
    
    print("=" * 50)
    print("✅ Pruebas completadas")
