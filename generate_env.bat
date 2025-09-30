@echo off
REM 🎵 Son1kVers3 Enhanced - Generador de .env para Windows
REM Script para crear automáticamente el archivo .env

echo 🎵 Generando archivo .env para Son1kVers3 Enhanced...

REM Verificar si ya existe un .env
if exist .env (
    echo ⚠️  El archivo .env ya existe.
    set /p overwrite="¿Quieres sobrescribirlo? (y/N): "
    if /i not "%overwrite%"=="y" (
        echo ❌ Operación cancelada.
        pause
        exit /b 1
    )
)

REM Generar timestamp para JWT secret
set timestamp=%date:~-4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%

REM Crear el archivo .env
(
echo # 🎵 Son1kVers3 Enhanced - Configuración de Entorno
echo # Generado automáticamente el %date% %time%
echo.
echo # ===========================================
echo # CONFIGURACIÓN PRINCIPAL
echo # ===========================================
echo NODE_ENV=development
echo DEBUG=true
echo PORT=8000
echo HOST=0.0.0.0
echo.
echo # ===========================================
echo # FRONTEND CONFIGURATION
echo # ===========================================
echo REACT_APP_API_BASE_URL=http://localhost:8000
echo REACT_APP_OLLAMA_URL=http://localhost:11434
echo REACT_APP_VOICE_CLONING_URL=http://localhost:8002
echo REACT_APP_NOVA_POST_URL=http://localhost:8001
echo REACT_APP_ANALYTICS_URL=http://localhost:8003
echo REACT_APP_STEALTH_URL=http://localhost:8004
echo.
echo # ===========================================
echo # BACKEND CONFIGURATION
echo # ===========================================
echo # Base de datos
echo DATABASE_URL=sqlite:///./son1kvers3.db
echo DATABASE_PATH=./son1kvers3.db
echo.
echo # Redis ^(opcional para desarrollo^)
echo REDIS_URL=redis://localhost:6379
echo.
echo # ===========================================
echo # IA Y MODELOS
echo # ===========================================
echo # Ollama
echo OLLAMA_MODEL=qwen2.5:7b
echo OLLAMA_BASE_URL=http://localhost:11434
echo.
echo # Hugging Face ^(opcional - reemplaza con tu API key^)
echo HUGGINGFACE_API_KEY=your_huggingface_api_key_here
echo.
echo # Suno AI ^(opcional - reemplaza con tu API key^)
echo SUNO_API_KEY=your_suno_api_key_here
echo SUNO_API_BASE_URL=https://sunoapi.com/api
echo SUNO_GENERATE_PATH=/v1/generate
echo SUNO_REQUEST_TIMEOUT=60
echo SUNO_MAX_RETRIES=4
echo SUNO_MAX_CONCURRENCY=20
echo SUNO_SANITIZE_PROMPTS=true
echo.
echo # ===========================================
echo # VOICE CLONING
echo # ===========================================
echo # so-VITS-SVC
echo SOVITS_MODEL_PATH=./models/sovits
echo VOICE_CLONING_ENABLED=true
echo.
echo # Bark
echo BARK_MODEL_PATH=./models/bark
echo.
echo # ===========================================
echo # REDES SOCIALES ^(opcional^)
echo # ===========================================
echo # Instagram
echo INSTAGRAM_ACCESS_TOKEN=your_instagram_token_here
echo.
echo # TikTok
echo TIKTOK_ACCESS_TOKEN=your_tiktok_token_here
echo.
echo # YouTube
echo YOUTUBE_API_KEY=your_youtube_api_key_here
echo.
echo # Twitter/X
echo TWITTER_API_KEY=your_twitter_api_key_here
echo.
echo # ===========================================
echo # SEGURIDAD
echo # ===========================================
echo # JWT
echo JWT_SECRET_KEY=son1kvers3_enhanced_%timestamp%_secret_key_2024
echo JWT_ALGORITHM=HS256
echo JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
echo.
echo # CORS
echo CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001
echo.
echo # ===========================================
echo # DIRECTORIOS
echo # ===========================================
echo UPLOAD_DIR=./uploads/
echo OUTPUT_DIR=./output/
echo LOGS_DIR=./logs/
echo MODELS_DIR=./models/
echo.
echo # ===========================================
echo # SERVICIOS
echo # ===========================================
echo NOVA_POST_ENABLED=true
echo SOCIAL_MEDIA_ANALYSIS=true
echo GHOST_STUDIO_ENABLED=true
echo AUDIO_ANALYSIS_ENABLED=true
echo ANALYTICS_ENABLED=true
echo METRICS_COLLECTION=true
echo DAW_EDITOR_ENABLED=true
echo AUDIO_EXPORT_ENABLED=true
echo HEALTH_CHECK_ENABLED=true
echo METRICS_ENABLED=true
echo.
echo # ===========================================
echo # PROXY CONFIGURATION ^(opcional^)
echo # ===========================================
echo PROXY_LIST=
echo PROXY_ROTATION_ENABLED=false
echo.
echo # ===========================================
echo # DEVELOPMENT FLAGS
echo # ===========================================
echo ENABLE_DEBUG_LOGGING=true
echo ENABLE_PERFORMANCE_MONITORING=true
echo ENABLE_ERROR_REPORTING=true
) > .env

echo ✅ Archivo .env generado exitosamente!
echo.
echo 📍 Ubicación: %CD%\.env
echo.
echo 🔑 JWT Secret generado: son1kvers3_enhanced_%timestamp%_secret_key_2024
echo.
echo ⚠️  IMPORTANTE:
echo    - Revisa y configura las API keys que necesites
echo    - Las APIs opcionales funcionarán en modo fallback sin keys
echo    - El JWT secret se generó automáticamente
echo.
echo 🚀 Para comenzar:
echo    1. Revisa el archivo .env generado
echo    2. Configura las API keys que tengas
echo    3. Ejecuta: setup_development.sh ^(en Git Bash^) o instala dependencias manualmente
echo.
echo 🎵 ¡Son1kVers3 Enhanced listo para configurar!
echo.
pause
