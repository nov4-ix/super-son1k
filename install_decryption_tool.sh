#!/bin/bash
# 🛡️ Instalador de Herramienta Externa de Desencriptación Son1kVers3

echo "🛡️ Instalando Herramienta Externa de Desencriptación Son1kVers3..."

# Crear directorio para la herramienta
mkdir -p ~/son1kvers3-admin-tools
cd ~/son1kvers3-admin-tools

# Copiar la herramienta de desencriptación
cp ../son1kvers3-fix/backend/external_decryption_tool.py ./decrypt_tool.py

# Hacer ejecutable
chmod +x decrypt_tool.py

# Crear script de configuración
cat > config.sh << 'EOF'
#!/bin/bash
# Configuración de variables de entorno para la herramienta de desencriptación

export MASTER_ENCRYPTION_KEY="son1kvers3_master_key_2024_ultra_secure"
export DOMAIN_ENCRYPTION_KEY="son1kvers3_domain_key_2024"
export ENCRYPTION_SALT="son1kvers3_salt_2024"
export ADMIN_TOKEN="son1kvers3_admin_2024"

echo "🔧 Variables de entorno configuradas para la herramienta de desencriptación"
EOF

chmod +x config.sh

# Crear script de uso
cat > usage_examples.sh << 'EOF'
#!/bin/bash
# Ejemplos de uso de la herramienta de desencriptación

echo "🔓 Ejemplos de uso de la herramienta de desencriptación:"
echo ""
echo "1. Desencriptar datos de usuario:"
echo "   ./decrypt_tool.py --mode user --input encrypted_users.json --output decrypted_users.json"
echo ""
echo "2. Desencriptar datos del dominio:"
echo "   ./decrypt_tool.py --mode domain --input encrypted_domain.json --domain-key"
echo ""
echo "3. Desencriptar logs de auditoría:"
echo "   ./decrypt_tool.py --mode audit --input encrypted_audit.json"
echo ""
echo "4. Desencriptar en lote:"
echo "   ./decrypt_tool.py --mode batch --input encrypted_batch.json --output decrypted_batch.json"
echo ""
echo "5. Verificar integridad:"
echo "   ./decrypt_tool.py --mode user --input encrypted_data.json --verify"
echo ""
echo "⚠️  IMPORTANTE: Esta herramienta solo debe usarse en sistemas seguros"
echo "🔐 Los datos desencriptados contienen información sensible"
EOF

chmod +x usage_examples.sh

# Crear README
cat > README.md << 'EOF'
# 🛡️ Herramienta Externa de Desencriptación Son1kVers3

Esta herramienta permite desencriptar datos sensibles del sistema Son1kVers3 de forma segura.

## ⚠️ ADVERTENCIAS DE SEGURIDAD

- **SOLO PARA ADMINISTRADORES AUTORIZADOS**
- **USAR SOLO EN SISTEMAS SEGUROS**
- **NO COMPARTIR LOS DATOS DESENCRIPTADOS**
- **ELIMINAR ARCHIVOS DESENCRIPTADOS DESPUÉS DE USO**

## 🚀 Instalación

1. Ejecutar el script de instalación:
   ```bash
   ./install_decryption_tool.sh
   ```

2. Configurar variables de entorno:
   ```bash
   source config.sh
   ```

## 📖 Uso

### Desencriptar datos de usuario
```bash
./decrypt_tool.py --mode user --input encrypted_users.json --output decrypted_users.json
```

### Desencriptar datos del dominio
```bash
./decrypt_tool.py --mode domain --input encrypted_domain.json --domain-key
```

### Desencriptar logs de auditoría
```bash
./decrypt_tool.py --mode audit --input encrypted_audit.json
```

### Desencriptar en lote
```bash
./decrypt_tool.py --mode batch --input encrypted_batch.json --output decrypted_batch.json
```

### Verificar integridad
```bash
./decrypt_tool.py --mode user --input encrypted_data.json --verify
```

## 🔐 Autenticación

La herramienta requiere un token de administrador que se solicita al ejecutar.

## 📁 Estructura de Archivos

- `decrypt_tool.py` - Herramienta principal de desencriptación
- `config.sh` - Configuración de variables de entorno
- `usage_examples.sh` - Ejemplos de uso
- `README.md` - Esta documentación

## 🛡️ Seguridad

- Todos los datos sensibles están encriptados con AES-256
- Las claves de encriptación se derivan usando PBKDF2
- Los datos desencriptados se almacenan temporalmente
- Se recomienda eliminar los archivos desencriptados después de usar

## 📞 Soporte

Para soporte técnico, contactar al equipo de administración de Son1kVers3.
EOF

echo "✅ Herramienta de desencriptación instalada exitosamente"
echo "📁 Ubicación: ~/son1kvers3-admin-tools"
echo ""
echo "🔧 Para configurar las variables de entorno:"
echo "   cd ~/son1kvers3-admin-tools"
echo "   source config.sh"
echo ""
echo "📖 Para ver ejemplos de uso:"
echo "   ./usage_examples.sh"
echo ""
echo "⚠️  IMPORTANTE: Esta herramienta contiene claves de encriptación sensibles"
echo "🔐 Mantener en un lugar seguro y no compartir con usuarios no autorizados"

