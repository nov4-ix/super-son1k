# 💳 Guía de Configuración de Stripe - Son1kVers3

## 🔑 Paso 1: Obtener Claves de API

### En tu Dashboard de Stripe (https://dashboard.stripe.com):

1. **Ve a Developers → API keys**
2. **Copia las siguientes claves:**
   - **Publishable key** (pk_test_... o pk_live_...)
   - **Secret key** (sk_test_... o sk_live_...)

3. **Ve a Developers → Webhooks**
   - **Crea un nuevo webhook** con URL: `https://tu-dominio.vercel.app/api/stripe/webhook`
   - **Selecciona estos eventos:**
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - **Copia el Webhook Secret** (whsec_...)

## 🔧 Paso 2: Configurar Variables de Entorno

### Frontend (.env.local):
```bash
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_tu_clave_publica_aqui
REACT_APP_API_URL=http://localhost:8000
```

### Backend (.env):
```bash
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
```

## 🛍️ Paso 3: Crear Productos en Stripe

### Ejecutar script de configuración:
```bash
cd backend
python3 stripe_integration.py
```

### O crear manualmente en Stripe Dashboard:

#### **Producto 1: Son1kVers3 Pro**
- **Precio mensual:** $24.99 USD (lookup_key: `price_pro_monthly`)
- **Precio anual:** $249.99 USD (lookup_key: `price_pro_yearly`)

#### **Producto 2: Son1kVers3 Premium**
- **Precio mensual:** $49.99 USD (lookup_key: `price_premium_monthly`)
- **Precio anual:** $499.99 USD (lookup_key: `price_premium_yearly`)

#### **Producto 3: Son1kVers3 Enterprise**
- **Precio mensual:** $199.99 USD (lookup_key: `price_enterprise_monthly`)
- **Precio anual:** $1,999.99 USD (lookup_key: `price_enterprise_yearly`)

#### **Producto 4: Starter Package**
- **Pago único:** $99.99 USD (lookup_key: `price_starter_package`)

## 🎯 Paso 4: Configurar Webhook

### URL del Webhook:
```
https://son1kvers3-58u1pm2w7-son1kvers3s-projects.vercel.app/api/stripe/webhook
```

### Eventos a escuchar:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

## 🔐 Paso 5: Configurar Variables en Vercel

### En Vercel Dashboard:
1. **Ve a tu proyecto → Settings → Environment Variables**
2. **Añade:**
   ```
   REACT_APP_STRIPE_PUBLIC_KEY = pk_test_tu_clave_aqui
   STRIPE_SECRET_KEY = sk_test_tu_clave_secreta_aqui
   STRIPE_WEBHOOK_SECRET = whsec_tu_webhook_secret_aqui
   ```

## 🧪 Paso 6: Probar con Tarjetas de Test

### Tarjetas de prueba de Stripe:
- **Éxito:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requiere autenticación:** `4000 0025 0000 3155`

### Datos de prueba:
- **Fecha:** Cualquier fecha futura
- **CVC:** Cualquier 3 dígitos
- **ZIP:** Cualquier código postal

## 🚀 Paso 7: Activar Modo Live

### Cuando esté listo para producción:
1. **Activar cuenta de Stripe** (verificación de identidad)
2. **Cambiar a claves Live** (pk_live_... y sk_live_...)
3. **Actualizar webhook** con URL de producción
4. **Probar con tarjeta real**

## 📊 Paso 8: Monitoreo

### Dashboard de Stripe te permitirá:
- 📈 **Ver ingresos** en tiempo real
- 👥 **Gestionar customers**
- 🔄 **Manejar suscripciones**
- 📧 **Enviar facturas**
- 🛡️ **Prevenir fraude**

## ⚠️ Notas Importantes

1. **Nunca expongas** las claves secretas en el frontend
2. **Usa HTTPS** siempre en producción
3. **Valida webhooks** con la firma de Stripe
4. **Maneja errores** de pago graciosamente
5. **Cumple con PCI DSS** (Stripe se encarga automáticamente)

## 🎵 Integración con Son1kVers3

### Los pagos actualizarán automáticamente:
- ✅ **Tier del usuario** (Free → Pro → Premium → Enterprise)
- ✅ **Símbolos ALVAE** en nickname
- ✅ **Créditos disponibles**
- ✅ **Límites de uso**
- ✅ **Acceso a herramientas**

### Dashboard de Admin mostrará:
- 💰 **Ingresos mensuales**
- 📊 **Suscripciones activas**
- 👥 **Usuarios por tier**
- 📈 **Métricas de conversión**
