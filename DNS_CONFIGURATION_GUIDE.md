# 🌐 Guía de Configuración DNS para Son1kVers3 Enhanced v2.0

## 📊 **INFORMACIÓN DEL DOMINIO:**
- **Dominio**: son1kvers3.com
- **Registrar**: IONOS SE
- **Name Servers**: NS1019.UI-DNS.ORG, NS1068.UI-DNS.BIZ, NS1070.UI-DNS.COM, NS1090.UI-DNS.DE
- **IP Actual**: 216.198.79.1

## 🎯 **OBJETIVO:**
Configurar subdominios para Son1kVers3 Enhanced v2.0 manteniendo el sitio actual intacto.

## 📋 **REGISTROS DNS NECESARIOS:**

### **1. Frontend Enhanced (Vercel)**
```
Tipo: CNAME
Nombre: enhanced
Valor: cname.vercel-dns.com
TTL: 300 (5 minutos)
```

### **2. Frontend V2 (Vercel)**
```
Tipo: CNAME
Nombre: v2
Valor: cname.vercel-dns.com
TTL: 300 (5 minutos)
```

### **3. Backend API (Railway/Heroku/Render)**
```
Tipo: CNAME
Nombre: api
Valor: [URL_DEL_BACKEND]
TTL: 300 (5 minutos)
```

### **4. Backend Alternativo**
```
Tipo: CNAME
Nombre: backend
Valor: [URL_DEL_BACKEND]
TTL: 300 (5 minutos)
```

## 🔧 **PASOS DE CONFIGURACIÓN:**

### **Paso 1: Acceder a IONOS**
1. Ve a https://www.ionos.com
2. Inicia sesión con tu cuenta
3. Ve a "Dominios" → "son1kvers3.com"
4. Selecciona "DNS" o "Zona DNS"

### **Paso 2: Añadir Registros CNAME**
1. **Clic en "Añadir registro"**
2. **Seleccionar "CNAME"**
3. **Configurar cada subdominio:**

#### **Para enhanced.son1kvers3.com:**
- **Tipo**: CNAME
- **Nombre**: enhanced
- **Valor**: cname.vercel-dns.com
- **TTL**: 300

#### **Para v2.son1kvers3.com:**
- **Tipo**: CNAME
- **Nombre**: v2
- **Valor**: cname.vercel-dns.com
- **TTL**: 300

#### **Para api.son1kvers3.com:**
- **Tipo**: CNAME
- **Nombre**: api
- **Valor**: [URL_DEL_BACKEND_DESPLEGADO]
- **TTL**: 300

### **Paso 3: Verificar Configuración**
1. **Guardar cambios**
2. **Esperar propagación** (5-60 minutos)
3. **Verificar con comandos:**

```bash
# Verificar enhanced.son1kvers3.com
nslookup enhanced.son1kvers3.com

# Verificar v2.son1kvers3.com
nslookup v2.son1kvers3.com

# Verificar api.son1kvers3.com
nslookup api.son1kvers3.com
```

## 🌐 **URLs FINALES:**

- **Frontend Enhanced**: https://enhanced.son1kvers3.com
- **Frontend V2**: https://v2.son1kvers3.com
- **Backend API**: https://api.son1kvers3.com
- **Sitio Original**: https://son1kvers3.com (sin cambios)

## ⚠️ **NOTAS IMPORTANTES:**

1. **No modificar** el registro A principal (son1kvers3.com)
2. **Mantener** www.son1kvers3.com intacto
3. **Esperar propagación** antes de probar
4. **Verificar** que el backend esté desplegado antes de configurar api.son1kvers3.com

## 🔍 **VERIFICACIÓN POST-CONFIGURACIÓN:**

### **Comando de verificación:**
```bash
# Verificar todos los subdominios
for domain in enhanced v2 api; do
  echo "Verificando $domain.son1kvers3.com:"
  nslookup $domain.son1kvers3.com
  echo "---"
done
```

### **Verificación web:**
- https://enhanced.son1kvers3.com → Debe mostrar Son1kVers3 Enhanced
- https://v2.son1kvers3.com → Debe mostrar Son1kVers3 Enhanced
- https://api.son1kvers3.com/health → Debe responder con status 200

## 🚨 **SOLUCIÓN DE PROBLEMAS:**

### **Si no funciona:**
1. **Verificar TTL**: Usar 300 segundos
2. **Esperar propagación**: Hasta 60 minutos
3. **Verificar sintaxis**: CNAME correcto
4. **Verificar backend**: Que esté desplegado

### **Comandos de diagnóstico:**
```bash
# Verificar DNS
dig enhanced.son1kvers3.com
dig v2.son1kvers3.com
dig api.son1kvers3.com

# Verificar conectividad
curl -I https://enhanced.son1kvers3.com
curl -I https://v2.son1kvers3.com
curl -I https://api.son1kvers3.com/health
```

## ✅ **RESULTADO ESPERADO:**

Después de la configuración DNS, tendrás:
- **Sitio original** funcionando en son1kvers3.com
- **Versión enhanced** en enhanced.son1kvers3.com
- **Versión v2** en v2.son1kvers3.com
- **API backend** en api.son1kvers3.com

¡Sistema completamente integrado y funcional! 🎵🚀✨


