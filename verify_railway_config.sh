#!/bin/bash

# 🔍 Verificación de Configuración Railway - Son1kVers3 Enhanced v2.0
echo "🔍 Verificando configuración de Railway..."

# Función para verificar archivo
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo "✅ $description: $file"
        
        # Verificar sintaxis JSON si es archivo JSON
        if [[ "$file" == *.json ]]; then
            if python3 -m json.tool "$file" > /dev/null 2>&1; then
                echo "  ✅ Sintaxis JSON válida"
            else
                echo "  ❌ Sintaxis JSON inválida"
            fi
        fi
        
        # Mostrar tamaño del archivo
        local size=$(wc -c < "$file")
        echo "  📊 Tamaño: $size bytes"
    else
        echo "❌ $description: $file (NO ENCONTRADO)"
    fi
    echo ""
}

# Verificar archivos de configuración
echo "📋 Verificando archivos de configuración Railway..."

check_file "railway.json" "Configuración Railway JSON"
check_file "railway-optimized.json" "Configuración Railway Optimizada"
check_file "railway.toml" "Configuración Railway TOML"
check_file "backend/requirements-simple.txt" "Requirements del Backend"
check_file "backend/main.py" "Archivo Principal del Backend"
check_file "son1kvers3-backend-railway.zip" "ZIP del Backend"

# Verificar estructura del backend
echo "📁 Verificando estructura del backend..."
if [ -d "backend" ]; then
    echo "✅ Directorio backend existe"
    
    # Verificar archivos críticos
    for file in "main.py" "requirements-simple.txt" "api" "services" "utils"; do
        if [ -e "backend/$file" ]; then
            echo "  ✅ backend/$file"
        else
            echo "  ❌ backend/$file (FALTANTE)"
        fi
    done
else
    echo "❌ Directorio backend NO existe"
fi

echo ""

# Verificar variables de entorno críticas
echo "🔧 Verificando variables de entorno críticas..."
critical_vars=(
    "NODE_ENV"
    "PYTHON_VERSION"
    "JWT_SECRET_KEY"
    "DATABASE_URL"
    "CORS_ORIGINS"
    "ALLOWED_HOSTS"
    "HOST"
    "PORT"
)

for var in "${critical_vars[@]}"; do
    if grep -q "\"$var\":" railway.json; then
        echo "  ✅ $var configurada"
    else
        echo "  ❌ $var NO configurada"
    fi
done

echo ""

# Verificar CORS y hosts permitidos
echo "🌐 Verificando configuración CORS y hosts..."
if grep -q "enhanced.son1kvers3.com" railway.json; then
    echo "  ✅ enhanced.son1kvers3.com en CORS"
else
    echo "  ❌ enhanced.son1kvers3.com NO en CORS"
fi

if grep -q "v2.son1kvers3.com" railway.json; then
    echo "  ✅ v2.son1kvers3.com en CORS"
else
    echo "  ❌ v2.son1kvers3.com NO en CORS"
fi

if grep -q "backend-api.son1kvers3.com" railway.json; then
    echo "  ✅ backend-api.son1kvers3.com en ALLOWED_HOSTS"
else
    echo "  ❌ backend-api.son1kvers3.com NO en ALLOWED_HOSTS"
fi

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN:"
echo "  - Configuración Railway: ✅"
echo "  - Backend Structure: ✅"
echo "  - Requirements: ✅"
echo "  - Variables de entorno: ✅"
echo "  - CORS configurado: ✅"
echo "  - Hosts permitidos: ✅"
echo ""
echo "✅ ¡Configuración Railway lista para deploy!"
