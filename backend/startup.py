#!/usr/bin/env python3
"""
🎵 Son1kVers3 Enhanced - Startup Script
Script de inicialización para asegurar que todos los servicios estén listos
"""

import os
import sys
import logging
from pathlib import Path

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_directories():
    """Crear directorios necesarios"""
    directories = [
        "uploads",
        "output", 
        "logs",
        "models/sovits",
        "models/bark"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        logger.info(f"✅ Directorio creado/verificado: {directory}")

def check_environment():
    """Verificar variables de entorno críticas"""
    critical_vars = [
        "JWT_SECRET_KEY",
        "CORS_ORIGINS"
    ]
    
    missing_vars = []
    for var in critical_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        logger.warning(f"⚠️ Variables de entorno faltantes: {missing_vars}")
        # Establecer valores por defecto
        if "JWT_SECRET_KEY" not in os.environ:
            os.environ["JWT_SECRET_KEY"] = "son1kvers3_enhanced_default_secret_key_2024"
            logger.info("🔑 JWT_SECRET_KEY establecido con valor por defecto")
        
        if "CORS_ORIGINS" not in os.environ:
            os.environ["CORS_ORIGINS"] = "http://localhost:3000,http://127.0.0.1:3000"
            logger.info("🌐 CORS_ORIGINS establecido con valor por defecto")
    else:
        logger.info("✅ Todas las variables de entorno críticas están configuradas")

def check_dependencies():
    """Verificar dependencias críticas"""
    try:
        import fastapi
        import uvicorn
        import sqlite3
        logger.info("✅ Dependencias básicas disponibles")
    except ImportError as e:
        logger.error(f"❌ Dependencia faltante: {e}")
        sys.exit(1)

def initialize_databases():
    """Inicializar bases de datos"""
    try:
        from community_endpoints import init_community_db
        init_community_db()
        logger.info("✅ Base de datos de comunidad inicializada")
    except Exception as e:
        logger.warning(f"⚠️ Error inicializando base de datos: {e}")

def main():
    """Función principal de inicialización"""
    logger.info("🚀 Inicializando Son1kVers3 Enhanced...")
    
    # Crear directorios
    create_directories()
    
    # Verificar entorno
    check_environment()
    
    # Verificar dependencias
    check_dependencies()
    
    # Inicializar bases de datos
    initialize_databases()
    
    logger.info("✅ Son1kVers3 Enhanced inicializado correctamente")
    logger.info("🎵 Sistema listo para generar música")

if __name__ == "__main__":
    main()
