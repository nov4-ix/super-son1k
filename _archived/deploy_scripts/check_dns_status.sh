#!/bin/bash

# 🌐 Verificación de estado DNS
echo "🌐 Verificando estado DNS de Son1kVers3 Enhanced v2.0..."

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

echo "✅ Verificación completada"
