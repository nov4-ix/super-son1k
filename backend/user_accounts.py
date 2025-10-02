#!/usr/bin/env python3
"""
👥 User Accounts System - Sistema de Cuentas Son1kVers3
Sistema de usuarios con encriptación y símbolos ALVAE
"""

import hashlib
import json
import os
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
import secrets

class UserAccountsSystem:
    def __init__(self):
        self.encryption_key = self.load_or_create_key()
        self.cipher_suite = Fernet(self.encryption_key)
        self.users_file = 'encrypted_users.dat'
        self.init_default_accounts()
    
    def load_or_create_key(self):
        """Cargar o crear clave de encriptación"""
        key_file = '.encryption_key'
        if os.path.exists(key_file):
            with open(key_file, 'rb') as f:
                return f.read()
        else:
            key = Fernet.generate_key()
            with open(key_file, 'wb') as f:
                f.write(key)
            return key
    
    def encrypt_data(self, data):
        """Encriptar datos sensibles"""
        json_data = json.dumps(data).encode()
        return self.cipher_suite.encrypt(json_data)
    
    def decrypt_data(self, encrypted_data):
        """Desencriptar datos"""
        decrypted_data = self.cipher_suite.decrypt(encrypted_data)
        return json.loads(decrypted_data.decode())
    
    def generate_alvae_nickname(self, base_name, tier):
        """Generar nickname con símbolos ALVAE según tier de suscripción"""
        alvae_symbols = {
            'free': '',           # Sin símbolo
            'pro': '◯',          # Círculo simple
            'premium': '⚡',      # Rayo
            'enterprise': '◯⚡'   # Círculo + Rayo
        }
        
        symbol = alvae_symbols.get(tier, '')
        
        if tier == 'enterprise':
            return f"{symbol}{base_name}{symbol}"  # Símbolos al inicio y final
        elif tier == 'premium':
            return f"{symbol}{base_name}"  # Símbolo al inicio
        elif tier == 'pro':
            return f"{base_name}{symbol}"  # Símbolo al final
        else:
            return base_name  # Sin símbolo para free
    
    def init_default_accounts(self):
        """Inicializar cuentas por defecto"""
        default_accounts = [
            # Cuenta de administrador principal
            {
                'id': 'admin_001',
                'email': 'nov4-ix@son1kvers3.com',
                'username': 'NOV4-IX',
                'display_name': self.generate_alvae_nickname('NOV4-IX', 'enterprise'),  # Admin usa enterprise symbols
                'role': 'admin',
                'tier': 'enterprise',
                'password_hash': self.hash_password('admin_secure_2024'),
                'created_at': datetime.now().isoformat(),
                'last_login': None,
                'subscription': {
                    'plan': 'enterprise',
                    'status': 'active',
                    'expires_at': (datetime.now() + timedelta(days=365)).isoformat(),
                    'monthly_fee': 0,  # Admin no paga
                    'features': ['unlimited_generation', 'all_tools', 'admin_panel', 'analytics', 'custom_training', 'priority_support']
                },
                'usage_stats': {
                    'tracks_generated': 0,
                    'voices_cloned': 0,
                    'ghost_studio_uses': 0,
                    'last_activity': None
                },
                'alvae_level': 100,
                'permissions': ['all']
            },
            
            # Cuenta enterprise (cliente)
            {
                'id': 'enterprise_001',
                'email': 'enterprise@son1kvers3.com',
                'username': 'CIPHER',
                'display_name': self.generate_alvae_nickname('CIPHER', 'enterprise'),
                'role': 'user',
                'tier': 'enterprise',
                'password_hash': self.hash_password('enterprise_2024'),
                'created_at': datetime.now().isoformat(),
                'last_login': None,
                'subscription': {
                    'plan': 'enterprise',
                    'status': 'active',
                    'expires_at': (datetime.now() + timedelta(days=365)).isoformat(),
                    'monthly_fee': 99.99,
                    'features': ['unlimited_generation', 'all_tools', 'priority_support', 'custom_training', 'white_label']
                },
                'usage_stats': {
                    'tracks_generated': 0,
                    'voices_cloned': 0,
                    'ghost_studio_uses': 0,
                    'last_activity': None
                },
                'alvae_level': 85,
                'permissions': ['create', 'clone', 'analyze', 'export', 'train']
            },
            
            # Cuenta premium (ejemplo)
            {
                'id': 'premium_001',
                'email': 'premium@son1kvers3.com',
                'username': 'BELLA',
                'display_name': self.generate_alvae_nickname('BELLA', 'premium'),
                'role': 'user',
                'tier': 'premium',
                'password_hash': self.hash_password('premium_2024'),
                'created_at': datetime.now().isoformat(),
                'last_login': None,
                'subscription': {
                    'plan': 'premium',
                    'status': 'active',
                    'expires_at': (datetime.now() + timedelta(days=30)).isoformat(),
                    'monthly_fee': 29.99,
                    'features': ['extended_generation', 'voice_cloning', 'ghost_studio', 'community', 'nexus_mode']
                },
                'usage_stats': {
                    'tracks_generated': 0,
                    'voices_cloned': 0,
                    'ghost_studio_uses': 0,
                    'last_activity': None
                },
                'alvae_level': 70,
                'permissions': ['create', 'clone', 'community', 'nexus']
            }
        ]
        
        # Generar 10 cuentas tester (distribuidas en diferentes tiers)
        tester_configs = [
            # 3 cuentas Pro
            {'name': 'PIXEL', 'tier': 'pro', 'email': 'pixel@son1kvers3.com'},
            {'name': 'ECHO', 'tier': 'pro', 'email': 'echo@son1kvers3.com'},
            {'name': 'FLUX', 'tier': 'pro', 'email': 'flux@son1kvers3.com'},
            
            # 4 cuentas Premium  
            {'name': 'NOVA', 'tier': 'premium', 'email': 'nova@son1kvers3.com'},
            {'name': 'GHOST', 'tier': 'premium', 'email': 'ghost@son1kvers3.com'},
            {'name': 'NOCTIS', 'tier': 'premium', 'email': 'noctis@son1kvers3.com'},
            {'name': 'SHADOW', 'tier': 'premium', 'email': 'shadow@son1kvers3.com'},
            
            # 3 cuentas Free (para testing)
            {'name': 'LIGHT', 'tier': 'free', 'email': 'light@son1kvers3.com'},
            {'name': 'SPARK', 'tier': 'free', 'email': 'spark@son1kvers3.com'},
            {'name': 'VOID', 'tier': 'free', 'email': 'void@son1kvers3.com'}
        ]
        
        # Definir características por tier
        tier_configs = {
            'free': {
                'monthly_fee': 0,
                'expires_days': 365,  # No expira
                'features': ['basic_generation', 'limited_tracks'],
                'limits': {'tracks_per_month': 3, 'track_duration': 30},
                'permissions': ['create_basic']
            },
            'pro': {
                'monthly_fee': 19.99,
                'expires_days': 30,
                'features': ['extended_generation', 'voice_cloning', 'ghost_studio_basic', 'community'],
                'limits': {'tracks_per_month': 50, 'track_duration': 120, 'voice_clones': 10},
                'permissions': ['create', 'clone', 'community']
            },
            'premium': {
                'monthly_fee': 49.99,
                'expires_days': 30,
                'features': ['unlimited_generation', 'voice_cloning_advanced', 'ghost_studio_pro', 'nexus_mode', 'community', 'analytics'],
                'limits': {'tracks_per_month': 200, 'track_duration': 300, 'voice_clones': 50},
                'permissions': ['create', 'clone', 'community', 'nexus', 'analytics']
            },
            'enterprise': {
                'monthly_fee': 99.99,
                'expires_days': 365,
                'features': ['unlimited_generation', 'all_tools', 'priority_support', 'custom_training', 'white_label', 'api_access'],
                'limits': {'tracks_per_month': -1, 'track_duration': -1, 'voice_clones': -1},  # Ilimitado
                'permissions': ['create', 'clone', 'analyze', 'export', 'train', 'api', 'white_label']
            }
        }
        
        for i, config in enumerate(tester_configs):
            tier_config = tier_configs[config['tier']]
            
            tester_account = {
                'id': f'tester_{i+1:03d}',
                'email': config['email'],
                'username': config['name'],
                'display_name': self.generate_alvae_nickname(config['name'], config['tier']),
                'role': 'tester',
                'tier': config['tier'],
                'password_hash': self.hash_password(f'tester_{i+1}_2024'),
                'created_at': datetime.now().isoformat(),
                'last_login': None,
                'subscription': {
                    'plan': config['tier'],
                    'status': 'active',
                    'expires_at': (datetime.now() + timedelta(days=tier_config['expires_days'])).isoformat(),
                    'monthly_fee': tier_config['monthly_fee'],
                    'features': tier_config['features'],
                    'limits': tier_config['limits']
                },
                'usage_stats': {
                    'tracks_generated': 0,
                    'voices_cloned': 0,
                    'ghost_studio_uses': 0,
                    'last_activity': None
                },
                'alvae_level': 30 + (i * 7),  # Niveles progresivos
                'permissions': tier_config['permissions']
            }
            default_accounts.append(tester_account)
        
        # Encriptar y guardar cuentas
        self.save_encrypted_accounts(default_accounts)
        return default_accounts
    
    def hash_password(self, password):
        """Hash seguro de contraseña"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return f"{salt}:{password_hash.hex()}"
    
    def verify_password(self, password, password_hash):
        """Verificar contraseña"""
        try:
            salt, hash_hex = password_hash.split(':')
            password_check = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
            return password_check.hex() == hash_hex
        except:
            return False
    
    def save_encrypted_accounts(self, accounts):
        """Guardar cuentas encriptadas"""
        encrypted_data = self.encrypt_data(accounts)
        with open(self.users_file, 'wb') as f:
            f.write(encrypted_data)
    
    def load_encrypted_accounts(self):
        """Cargar cuentas encriptadas"""
        try:
            with open(self.users_file, 'rb') as f:
                encrypted_data = f.read()
            return self.decrypt_data(encrypted_data)
        except FileNotFoundError:
            return self.init_default_accounts()
    
    def authenticate_user(self, email, password):
        """Autenticar usuario"""
        accounts = self.load_encrypted_accounts()
        
        for account in accounts:
            if account['email'] == email:
                if self.verify_password(password, account['password_hash']):
                    # Actualizar último login
                    account['last_login'] = datetime.now().isoformat()
                    self.save_encrypted_accounts(accounts)
                    
                    # Retornar datos del usuario (sin contraseña)
                    user_data = {k: v for k, v in account.items() if k != 'password_hash'}
                    return {
                        'success': True,
                        'user': user_data,
                        'token': self.generate_session_token(account['id'])
                    }
                else:
                    return {'success': False, 'error': 'Contraseña incorrecta'}
        
        return {'success': False, 'error': 'Usuario no encontrado'}
    
    def generate_session_token(self, user_id):
        """Generar token de sesión"""
        token_data = {
            'user_id': user_id,
            'created_at': datetime.now().isoformat(),
            'expires_at': (datetime.now() + timedelta(days=7)).isoformat()
        }
        return self.cipher_suite.encrypt(json.dumps(token_data).encode()).decode()
    
    def verify_session_token(self, token):
        """Verificar token de sesión"""
        try:
            decrypted_token = self.cipher_suite.decrypt(token.encode())
            token_data = json.loads(decrypted_token.decode())
            
            expires_at = datetime.fromisoformat(token_data['expires_at'])
            if datetime.now() > expires_at:
                return {'valid': False, 'error': 'Token expirado'}
            
            return {'valid': True, 'user_id': token_data['user_id']}
        except:
            return {'valid': False, 'error': 'Token inválido'}
    
    def get_user_by_id(self, user_id):
        """Obtener usuario por ID"""
        accounts = self.load_encrypted_accounts()
        for account in accounts:
            if account['id'] == user_id:
                return {k: v for k, v in account.items() if k != 'password_hash'}
        return None
    
    def update_user_usage(self, user_id, action_type):
        """Actualizar estadísticas de uso"""
        accounts = self.load_encrypted_accounts()
        
        for account in accounts:
            if account['id'] == user_id:
                account['usage_stats']['last_activity'] = datetime.now().isoformat()
                
                if action_type == 'track_generated':
                    account['usage_stats']['tracks_generated'] += 1
                elif action_type == 'voice_cloned':
                    account['usage_stats']['voices_cloned'] += 1
                elif action_type == 'ghost_studio_used':
                    account['usage_stats']['ghost_studio_uses'] += 1
                
                self.save_encrypted_accounts(accounts)
                break
    
    def get_all_users_stats(self):
        """Obtener estadísticas de todos los usuarios (solo admin)"""
        accounts = self.load_encrypted_accounts()
        
        stats = {
            'total_users': len(accounts),
            'active_subscriptions': 0,
            'monthly_revenue': 0,
            'usage_summary': {
                'total_tracks': 0,
                'total_voices': 0,
                'total_ghost_uses': 0
            },
            'users_by_tier': {'free': 0, 'pro': 0, 'enterprise': 0},
            'recent_activity': []
        }
        
        for account in accounts:
            # Contar suscripciones activas
            if account['subscription']['status'] == 'active':
                stats['active_subscriptions'] += 1
                stats['monthly_revenue'] += account['subscription']['monthly_fee']
            
            # Contar por tier
            stats['users_by_tier'][account['tier']] += 1
            
            # Sumar uso total
            stats['usage_summary']['total_tracks'] += account['usage_stats']['tracks_generated']
            stats['usage_summary']['total_voices'] += account['usage_stats']['voices_cloned']
            stats['usage_summary']['total_ghost_uses'] += account['usage_stats']['ghost_studio_uses']
            
            # Actividad reciente
            if account['usage_stats']['last_activity']:
                stats['recent_activity'].append({
                    'user': account['display_name'],
                    'last_activity': account['usage_stats']['last_activity']
                })
        
        # Ordenar por actividad reciente
        stats['recent_activity'].sort(key=lambda x: x['last_activity'], reverse=True)
        stats['recent_activity'] = stats['recent_activity'][:10]  # Top 10
        
        return stats

# Inicializar sistema
user_system = UserAccountsSystem()

# Funciones de utilidad para endpoints
def get_user_system():
    return user_system

def create_default_accounts():
    """Crear cuentas por defecto"""
    return user_system.init_default_accounts()

if __name__ == "__main__":
    # Test del sistema
    print("🔐 Inicializando sistema de cuentas Son1kVers3...")
    
    accounts = create_default_accounts()
    print(f"✅ {len(accounts)} cuentas creadas:")
    
    for account in accounts:
        print(f"  {account['role'].upper()}: {account['display_name']} ({account['email']})")
    
    print("\n🔑 Credenciales de prueba:")
    print("Admin: nov4-ix@son1kvers3.com / admin_secure_2024")
    print("Enterprise: enterprise@son1kvers3.com / enterprise_2024")
    print("Testers: tester1@son1kvers3.com / tester_1_2024 (hasta tester10)")
    
    # Test de autenticación
    print("\n🧪 Test de autenticación:")
    auth_result = user_system.authenticate_user('nov4-ix@son1kvers3.com', 'admin_secure_2024')
    if auth_result['success']:
        print(f"✅ Login exitoso: {auth_result['user']['display_name']}")
    else:
        print(f"❌ Error: {auth_result['error']}")
