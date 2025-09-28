# 🌐 Configuración DNS para Son1kVers3 Enhanced v2.0

## 📋 Registros DNS Necesarios

### Frontend (Vercel)
```
enhanced.son1kvers3.com    CNAME    cname.vercel-dns.com
v2.son1kvers3.com          CNAME    cname.vercel-dns.com
```

### Backend (Railway/Heroku/Render)
```
api.son1kvers3.com         CNAME    [tu-backend-url]
backend.son1kvers3.com     CNAME    [tu-backend-url]
```

### Redirección
```
son1kvers3.com             A        [IP de Vercel]
www.son1kvers3.com         CNAME    cname.vercel-dns.com
```

## 🔧 Pasos de Configuración

1. **Accede a tu proveedor de DNS** (Cloudflare, GoDaddy, etc.)
2. **Añade los registros CNAME** para los subdominios
3. **Configura la redirección** del dominio principal
4. **Espera la propagación DNS** (5-60 minutos)
5. **Prueba la integración** en los nuevos dominios

## 🎯 URLs Finales

- **Frontend Enhanced**: https://enhanced.son1kvers3.com
- **Frontend V2**: https://v2.son1kvers3.com
- **Backend API**: https://api.son1kvers3.com
- **Sitio Original**: https://son1kvers3.com (mantener)
