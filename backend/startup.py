#!/usr/bin/env python3
"""
🚀 Son1kVers3 Enhanced - Startup Script
Inicialización y configuración del sistema
"""

import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def main():
    """Función principal de startup"""
    try:
        print("🚀 Iniciando Son1kVers3 Enhanced...")
        
        # Crear directorios necesarios
        create_directories()
        
        # Configurar variables de entorno por defecto
        setup_environment()
        
        print("✅ Startup completado exitosamente")
        
    except Exception as e:
        print(f"❌ Error en startup: {e}")
        logger.error(f"Startup error: {e}")

def create_directories():
    """Crear directorios necesarios"""
    directories = [
        "uploads",
        "output", 
        "logs",
        "models",
        "temp"
    ]
    
    for dir_name in directories:
        dir_path = Path(dir_name)
        dir_path.mkdir(exist_ok=True)
        print(f"📁 Directorio creado/verificado: {dir_path}")

def setup_environment():
    """Configurar variables de entorno por defecto"""
    env_defaults = {
        "JWT_SECRET_KEY": "son1kvers3-secret-key-change-in-production",
        "CORS_ORIGINS": "http://localhost:3000,http://127.0.0.1:3000",
        "DEBUG": "true",
        "HOST": "0.0.0.0",
        "PORT": "8000"
    }
    
    for key, default_value in env_defaults.items():
        if not os.getenv(key):
            os.environ[key] = default_value
            print(f"🔧 Variable de entorno configurada: {key}")

if __name__ == "__main__":
    main()