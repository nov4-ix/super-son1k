#!/bin/bash

# 📧 Verificación del Servicio de Correo - Son1kVers3 Enhanced v2.0
echo "📧 Verificando que el servicio de correo esté funcionando correctamente..."

# Función para verificar registros de correo
check_email_dns() {
    local record_type=$1
    local hostname=$2
    local expected_value=$3
    local description=$4
    
    echo "🔍 Verificando $description ($record_type $hostname)..."
    
    # Verificar resolución DNS
    if nslookup -type=$record_type $hostname > /dev/null 2>&1; then
        echo "  ✅ $record_type $hostname resuelve correctamente"
        
        # Verificar valor específico si se proporciona
        if [ ! -z "$expected_value" ]; then
            if nslookup -type=$record_type $hostname | grep -q "$expected_value"; then
                echo "  ✅ Valor correcto detectado: $expected_value"
            else
                echo "  ⚠️ Valor no coincide con el esperado"
            fi
        fi
    else
        echo "  ❌ $record_type $hostname NO resuelve - CORREO EN PELIGRO"
    fi
    echo ""
}

# Verificar registros de correo críticos
echo "📊 Verificando registros de correo críticos..."

# Verificar registros MX (Mail Exchange)
check_email_dns "MX" "api.son1kvers3.com" "mx01.ionos.mx" "Mail Exchange 1"
check_email_dns "MX" "api.son1kvers3.com" "mx00.ionos.mx" "Mail Exchange 2"

# Verificar registros A (IPv4)
check_email_dns "A" "api.son1kvers3.com" "74.208.236.124" "IPv4 Address"

# Verificar registros AAAA (IPv6)
check_email_dns "AAAA" "api.son1kvers3.com" "2607:f1c0:100f:f000:0:0:0:200" "IPv6 Address"

# Verificar registros TXT (SPF)
check_email_dns "TXT" "api.son1kvers3.com" "v=spf1 include:_spf-us.ionos.com" "SPF Record"

# Verificar registros CNAME (DKIM)
check_email_dns "CNAME" "s42582890._domainkey.api.son1kvers3.com" "s42582890.dkim.ionos.com" "DKIM 1"
check_email_dns "CNAME" "s2-ionos._domainkey.api.son1kvers3.com" "s2.dkim.ionos.com" "DKIM 2"
check_email_dns "CNAME" "s1-ionos._domainkey.api.son1kvers3.com" "s1.dkim.ionos.com" "DKIM 3"

# Verificar autodiscover
check_email_dns "CNAME" "autodiscover.api.son1kvers3.com" "adsredir.ionos.info" "Autodiscover"

echo "📊 RESUMEN DE VERIFICACIÓN DE CORREO:"
echo "  - MX Records: Mail Exchange (crítico)"
echo "  - A/AAAA Records: Direcciones IP (crítico)"
echo "  - TXT Records: SPF (crítico)"
echo "  - CNAME Records: DKIM (crítico)"
echo "  - Autodiscover: Configuración automática (importante)"
echo ""
echo "⚠️  IMPORTANTE: NO configurar api.son1kvers3.com como CNAME"
echo "   Esto desactivaría TODOS los registros de correo"
echo ""
echo "✅ Verificación de correo completada"
