# 🚨 GUÍA DE PRESERVACIÓN DE CORREO - Son1kVers3 Enhanced v2.0

## ⚠️ **SITUACIÓN CRÍTICA:**
El registro `api.son1kvers3.com` está en conflicto con el servicio de correo de IONOS.

## 🛑 **ACCIÓN INMEDIATA REQUERIDA:**

### **❌ NO HACER:**
- **NO** configurar `api.son1kvers3.com` como CNAME
- **NO** modificar registros existentes de correo
- **NO** desactivar el servicio de correo

### **✅ HACER:**
- **SÍ** usar subdominios alternativos para el backend
- **SÍ** preservar todos los registros de correo existentes
- **SÍ** verificar que el correo sigue funcionando

## 📧 **REGISTROS DE CORREO CRÍTICOS (PRESERVAR):**

```
Tipo: MX
Nombre: api
Valor: mx01.ionos.mx
TTL: 300

Tipo: MX
Nombre: api
Valor: mx00.ionos.mx
TTL: 300

Tipo: A
Nombre: api
Valor: 74.208.236.124
TTL: 300

Tipo: AAAA
Nombre: api
Valor: 2607:f1c0:100f:f000:0:0:0:200
TTL: 300

Tipo: TXT
Nombre: api
Valor: "v=spf1 include:_spf-us.ionos.com ~all"
TTL: 300

Tipo: CNAME
Nombre: s42582890._domainkey.api
Valor: s42582890.dkim.ionos.com
TTL: 300

Tipo: CNAME
Nombre: s2-ionos._domainkey.api
Valor: s2.dkim.ionos.com
TTL: 300

Tipo: CNAME
Nombre: s1-ionos._domainkey.api
Valor: s1.dkim.ionos.com
TTL: 300

Tipo: CNAME
Nombre: autodiscover.api
Valor: adsredir.ionos.info
TTL: 300
```

## 🌐 **SUBDOMINIOS SEGUROS PARA BACKEND:**

### **Opciones recomendadas:**
```
backend-api.son1kvers3.com  → Backend API
server.son1kvers3.com       → Backend Server
app.son1kvers3.com          → Backend App
api-v2.son1kvers3.com       → Backend API v2
son1k-api.son1kvers3.com    → Backend Son1k API
```

### **Configuración en IONOS:**
1. **Acceder a IONOS DNS Manager**
2. **Añadir registros CNAME:**
   - `backend-api` → `[URL_DEL_BACKEND]`
   - `server` → `[URL_DEL_BACKEND]`
   - `app` → `[URL_DEL_BACKEND]`
3. **NO modificar** registros existentes de correo

## 🔍 **VERIFICACIÓN DE CORREO:**

### **Comando de verificación:**
```bash
./verify_email_service.sh
```

### **Verificación manual:**
```bash
# Verificar MX records
nslookup -type=MX api.son1kvers3.com

# Verificar A record
nslookup -type=A api.son1kvers3.com

# Verificar TXT record (SPF)
nslookup -type=TXT api.son1kvers3.com
```

## 🎯 **CONFIGURACIÓN FINAL:**

### **Frontend:**
- **enhanced.son1kvers3.com** → Frontend Enhanced
- **v2.son1kvers3.com** → Frontend V2

### **Backend:**
- **backend-api.son1kvers3.com** → Backend API
- **server.son1kvers3.com** → Backend Server
- **app.son1kvers3.com** → Backend App

### **Correo (PRESERVADO):**
- **api.son1kvers3.com** → Servicio de correo IONOS

## ✅ **RESULTADO:**
- ✅ Servicio de correo funcionando
- ✅ Sistema Son1kVers3 Enhanced funcionando
- ✅ Sin conflictos DNS
- ✅ Configuración estable

---

**¡Correo preservado y sistema funcionando!** 📧🎵🚀✨
