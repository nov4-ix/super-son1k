#!/bin/bash

# 🌐 Configuración DNS Automática para Son1kVers3 Enhanced v2.0
echo "🌐 Configurando DNS automáticamente para Son1kVers3 Enhanced v2.0..."

# Crear archivo de configuración DNS para IONOS
echo "📋 Creando archivo de configuración DNS para IONOS..."
cat > dns_records_ionos.txt << 'EOF'
# Registros DNS para Son1kVers3 Enhanced v2.0
# Configurar en IONOS DNS Manager

# Frontend Enhanced (Vercel)
Tipo: CNAME
Nombre: enhanced
Valor: cname.vercel-dns.com
TTL: 300

# Frontend V2 (Vercel)
Tipo: CNAME
Nombre: v2
Valor: cname.vercel-dns.com
TTL: 300

# Backend API (Railway/Heroku/Render)
Tipo: CNAME
Nombre: api
Valor: [URL_DEL_BACKEND_DESPLEGADO]
TTL: 300

# Backend Alternativo
Tipo: CNAME
Nombre: backend
Valor: [URL_DEL_BACKEND_DESPLEGADO]
TTL: 300
EOF

# Crear archivo de configuración DNS para Cloudflare
echo "📋 Creando archivo de configuración DNS para Cloudflare..."
cat > dns_records_cloudflare.txt << 'EOF'
# Registros DNS para Son1kVers3 Enhanced v2.0
# Configurar en Cloudflare DNS

# Frontend Enhanced (Vercel)
Tipo: CNAME
Nombre: enhanced
Contenido: cname.vercel-dns.com
Proxy: Desactivado
TTL: Auto

# Frontend V2 (Vercel)
Tipo: CNAME
Nombre: v2
Contenido: cname.vercel-dns.com
Proxy: Desactivado
TTL: Auto

# Backend API (Railway/Heroku/Render)
Tipo: CNAME
Nombre: api
Contenido: [URL_DEL_BACKEND_DESPLEGADO]
Proxy: Desactivado
TTL: Auto

# Backend Alternativo
Tipo: CNAME
Nombre: backend
Contenido: [URL_DEL_BACKEND_DESPLEGADO]
Proxy: Desactivado
TTL: Auto
EOF

# Crear archivo de configuración DNS para GoDaddy
echo "📋 Creando archivo de configuración DNS para GoDaddy..."
cat > dns_records_godaddy.txt << 'EOF'
# Registros DNS para Son1kVers3 Enhanced v2.0
# Configurar en GoDaddy DNS Manager

# Frontend Enhanced (Vercel)
Tipo: CNAME
Nombre: enhanced
Valor: cname.vercel-dns.com
TTL: 1 hora

# Frontend V2 (Vercel)
Tipo: CNAME
Nombre: v2
Valor: cname.vercel-dns.com
TTL: 1 hora

# Backend API (Railway/Heroku/Render)
Tipo: CNAME
Nombre: api
Valor: [URL_DEL_BACKEND_DESPLEGADO]
TTL: 1 hora

# Backend Alternativo
Tipo: CNAME
Nombre: backend
Valor: [URL_DEL_BACKEND_DESPLEGADO]
TTL: 1 hora
EOF

# Crear script de verificación DNS
echo "📋 Creando script de verificación DNS..."
cat > check_dns_status.sh << 'EOF'
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
EOF

chmod +x check_dns_status.sh

echo "✅ Archivos de configuración DNS creados:"
echo "  📋 dns_records_ionos.txt - Configuración para IONOS"
echo "  📋 dns_records_cloudflare.txt - Configuración para Cloudflare"
echo "  📋 dns_records_godaddy.txt - Configuración para GoDaddy"
echo "  📊 check_dns_status.sh - Script de verificación"
echo ""
echo "🌐 INSTRUCCIONES DE CONFIGURACIÓN:"
echo ""
echo "1. 🎯 ACCEDER A TU PROVEEDOR DNS:"
echo "   - IONOS: https://www.ionos.com"
echo "   - Cloudflare: https://dash.cloudflare.com"
echo "   - GoDaddy: https://dns.godaddy.com"
echo ""
echo "2. 🔧 CONFIGURAR REGISTROS CNAME:"
echo "   - Usar los archivos de configuración creados"
echo "   - Añadir cada registro CNAME"
echo "   - Configurar TTL apropiado"
echo ""
echo "3. ⏱️ ESPERAR PROPAGACIÓN:"
echo "   - Tiempo: 5-60 minutos"
echo "   - Verificar con: ./check_dns_status.sh"
echo ""
echo "4. 🧪 PROBAR INTEGRACIÓN:"
echo "   - https://enhanced.son1kvers3.com"
echo "   - https://v2.son1kvers3.com"
echo "   - https://api.son1kvers3.com/health"
echo ""
echo "✅ ¡Configuración DNS lista para implementar!"


