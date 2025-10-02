#!/bin/bash

# 🌐 Verificación DNS para Son1kVers3 Enhanced v2.0
echo "🌐 Verificando configuración DNS de Son1kVers3 Enhanced v2.0..."

# Función para verificar DNS
check_dns() {
    local domain=$1
    local description=$2
    
    echo "🔍 Verificando $description ($domain)..."
    
    # Verificar resolución DNS
    if nslookup $domain > /dev/null 2>&1; then
        echo "  ✅ DNS resuelve correctamente"
        
        # Verificar conectividad HTTP
        if curl -s -I https://$domain > /dev/null 2>&1; then
            echo "  ✅ HTTPS responde correctamente"
            
            # Verificar contenido
            if curl -s https://$domain | grep -q "Son1kVers3"; then
                echo "  ✅ Contenido correcto detectado"
            else
                echo "  ⚠️ Contenido no detectado (puede estar en construcción)"
            fi
        else
            echo "  ⚠️ HTTPS no responde (puede estar en construcción)"
        fi
    else
        echo "  ❌ DNS no resuelve"
    fi
    echo ""
}

# Verificar subdominios
check_dns "enhanced.son1kvers3.com" "Frontend Enhanced"
check_dns "v2.son1kvers3.com" "Frontend V2"
check_dns "api.son1kvers3.com" "Backend API"

# Verificar dominio principal
echo "🔍 Verificando dominio principal (son1kvers3.com)..."
if nslookup son1kvers3.com > /dev/null 2>&1; then
    echo "  ✅ Dominio principal resuelve correctamente"
    if curl -s -I https://son1kvers3.com > /dev/null 2>&1; then
        echo "  ✅ Sitio principal responde correctamente"
    else
        echo "  ⚠️ Sitio principal no responde"
    fi
else
    echo "  ❌ Dominio principal no resuelve"
fi

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN:"
echo "  - enhanced.son1kvers3.com: Frontend Enhanced"
echo "  - v2.son1kvers3.com: Frontend V2"
echo "  - api.son1kvers3.com: Backend API"
echo "  - son1kvers3.com: Sitio principal"
echo ""
echo "✅ Verificación completada"


