# 🔧 Configuración de .env - Son1kVers3 Enhanced

## 📍 **UBICACIÓN DEL ARCHIVO .env**

El archivo `.env` debe estar en la **raíz del proyecto**, mismo nivel que:
- `package.json`
- `README.md`
- `setup_development.sh`

```
son1kvers3-fix/
├── .env                    ← AQUÍ debe estar
├── package.json
├── README.md
├── setup_development.sh
├── frontend/
├── backend/
└── ...
```

## 🚀 **GENERACIÓN AUTOMÁTICA**

### **Linux/Mac/Git Bash:**
```bash
./generate_env.sh
```

### **Windows:**
```cmd
generate_env.bat
```

## 📝 **GENERACIÓN MANUAL**

Si prefieres crear el archivo manualmente:

1. **Crea un archivo llamado `.env`** en la raíz del proyecto
2. **Copia el contenido** desde `env.example`
3. **Personaliza** las variables que necesites

```bash
# Copiar desde el ejemplo
cp env.example .env

# O crear desde cero
touch .env
```

## 🔑 **VARIABLES IMPORTANTES**

### **Críticas (requeridas):**
```bash
JWT_SECRET_KEY=tu_secret_key_muy_segura
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### **Opcionales (modo fallback sin ellas):**
```bash
HUGGINGFACE_API_KEY=tu_api_key
SUNO_API_KEY=tu_api_key
INSTAGRAM_ACCESS_TOKEN=tu_token
```

## ⚙️ **CONFIGURACIÓN PASO A PASO**

### **1. Generar el archivo**
```bash
# Ejecutar el script
./generate_env.sh
```

### **2. Verificar ubicación**
```bash
# Verificar que el archivo existe
ls -la .env

# Debe mostrar algo como:
# -rw-r--r-- 1 user user 2345 Dec 30 15:30 .env
```

### **3. Configurar API keys (opcional)**
Edita el archivo `.env` y reemplaza:
```bash
# Cambiar esto:
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Por esto:
HUGGINGFACE_API_KEY=hf_1234567890abcdef...
```

### **4. Verificar configuración**
```bash
# Ver las primeras líneas del archivo
head -10 .env

# Debe mostrar:
# # 🎵 Son1kVers3 Enhanced - Configuración de Entorno
# # Generado automáticamente el...
# NODE_ENV=development
# DEBUG=true
# ...
```

## 🛡️ **SEGURIDAD**

### **Nunca hagas esto:**
```bash
# ❌ NO subir .env al repositorio
git add .env

# ❌ NO compartir el archivo .env
# ❌ NO incluir .env en commits
```

### **Sí puedes hacer esto:**
```bash
# ✅ El archivo .env está en .gitignore
git status  # No debe mostrar .env

# ✅ Compartir env.example (sin keys reales)
git add env.example
```

## 🔍 **VERIFICACIÓN**

### **Verificar que funciona:**
```bash
# 1. El archivo existe
ls -la .env

# 2. Tiene el contenido correcto
grep "JWT_SECRET_KEY" .env

# 3. No está en git
git status | grep .env  # No debe mostrar nada
```

### **Probar la configuración:**
```bash
# Iniciar el backend
cd backend
python main.py

# Debe mostrar:
# ✅ Son1kVers3 Enhanced inicializado correctamente
# 🎵 Sistema listo para generar música
```

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Error: "No such file or directory"**
```bash
# Verificar que estás en la raíz del proyecto
pwd
# Debe mostrar: /ruta/a/son1kvers3-fix

# Crear el archivo manualmente
touch .env
```

### **Error: "Permission denied"**
```bash
# Dar permisos de ejecución al script
chmod +x generate_env.sh

# O ejecutar con bash
bash generate_env.sh
```

### **Error: "JWT_SECRET_KEY not found"**
```bash
# Verificar que el archivo tiene contenido
cat .env | grep JWT_SECRET_KEY

# Si está vacío, regenerar
rm .env
./generate_env.sh
```

## 📋 **CHECKLIST DE CONFIGURACIÓN**

- [ ] Archivo `.env` creado en la raíz del proyecto
- [ ] JWT_SECRET_KEY configurado (generado automáticamente)
- [ ] CORS_ORIGINS configurado para desarrollo
- [ ] API keys opcionales configuradas (si las tienes)
- [ ] Archivo `.env` NO está en git
- [ ] Backend inicia sin errores
- [ ] Variables de entorno se cargan correctamente

## 🎯 **RESULTADO ESPERADO**

Después de configurar correctamente el `.env`:

```bash
$ ./setup_development.sh
🚀 Configurando Son1kVers3 Enhanced para desarrollo...
📝 Creando archivo .env...
✅ Archivo .env ya existe
📁 Creando directorios...
✅ Directorios creados
🐍 Instalando dependencias de Python...
✅ Dependencias de Python instaladas
📦 Instalando dependencias de Node.js...
✅ Dependencias de Node.js instaladas
🎵 Son1kVers3 Enhanced configurado para desarrollo!
```

**¡Listo para generar música!** 🎵✨
