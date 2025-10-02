#!/usr/bin/env python3
"""
🛡️ Admin Dashboard External - Dashboard Encriptado de Administración
Sistema seguro para gestión de cuentas, ingresos y datos sensibles
"""

from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import uvicorn
import os
from datetime import datetime, timedelta
import json
from user_accounts import get_user_system

app = FastAPI(
    title="Son1kVers3 Admin Dashboard",
    description="Dashboard encriptado para administración de Son1kVers3",
    version="1.0.0",
    docs_url="/admin/docs",  # Ocultar docs en ruta no obvia
    redoc_url=None  # Deshabilitar redoc por seguridad
)

# Configurar CORS solo para admin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://admin.son1kvers3.com", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

security = HTTPBearer()
user_system = get_user_system()

def verify_admin_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verificar que el token pertenece a un admin"""
    token_result = user_system.verify_session_token(credentials.credentials)
    
    if not token_result['valid']:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    user = user_system.get_user_by_id(token_result['user_id'])
    if not user or user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Acceso denegado - Solo administradores")
    
    return user

@app.get("/")
async def admin_dashboard_home():
    """Dashboard principal (HTML)"""
    return HTMLResponse(content="""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🛡️ Son1kVers3 Admin Dashboard</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                color: #ffffff;
                font-family: 'Courier New', monospace;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .admin-header {
                text-align: center;
                margin-bottom: 40px;
                padding: 30px;
                background: rgba(0, 255, 231, 0.1);
                border: 2px solid rgba(0, 255, 231, 0.3);
                border-radius: 20px;
                backdrop-filter: blur(15px);
            }
            .admin-header h1 {
                font-size: 2.5rem;
                color: #00FFE7;
                text-shadow: 0 0 20px rgba(0, 255, 231, 0.5);
                margin-bottom: 10px;
            }
            .admin-header p {
                color: #cccccc;
                font-size: 1.1rem;
            }
            .login-form {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(0, 255, 231, 0.2);
                border-radius: 15px;
                padding: 40px;
                min-width: 400px;
                backdrop-filter: blur(10px);
            }
            .form-group {
                margin-bottom: 25px;
            }
            .form-group label {
                display: block;
                color: #00FFE7;
                margin-bottom: 8px;
                font-weight: 600;
            }
            .form-group input {
                width: 100%;
                padding: 12px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                background: rgba(0, 0, 0, 0.3);
                color: #ffffff;
                font-family: inherit;
            }
            .form-group input:focus {
                outline: none;
                border-color: #00FFE7;
                box-shadow: 0 0 10px rgba(0, 255, 231, 0.3);
            }
            .login-btn {
                width: 100%;
                padding: 15px;
                background: linear-gradient(45deg, #00FFE7, #0984e3);
                color: #000000;
                border: none;
                border-radius: 8px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .login-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 255, 231, 0.4);
            }
            .security-notice {
                margin-top: 30px;
                padding: 20px;
                background: rgba(255, 107, 107, 0.1);
                border: 1px solid rgba(255, 107, 107, 0.3);
                border-radius: 10px;
                text-align: center;
            }
            .security-notice h3 {
                color: #ff6b6b;
                margin-bottom: 10px;
            }
            .security-notice p {
                color: #cccccc;
                font-size: 0.9rem;
            }
        </style>
    </head>
    <body>
        <div class="admin-header">
            <h1>🛡️ ADMIN DASHBOARD</h1>
            <p>Sistema Encriptado de Administración Son1kVers3</p>
        </div>
        
        <div class="login-form">
            <form id="adminLogin">
                <div class="form-group">
                    <label>Email de Administrador:</label>
                    <input type="email" id="email" placeholder="nov4-ix@son1kvers3.com" required>
                </div>
                <div class="form-group">
                    <label>Contraseña:</label>
                    <input type="password" id="password" placeholder="••••••••••••" required>
                </div>
                <button type="submit" class="login-btn">🔐 Acceder al Dashboard</button>
            </form>
        </div>
        
        <div class="security-notice">
            <h3>⚠️ ACCESO RESTRINGIDO</h3>
            <p>Este dashboard contiene información encriptada y sensible.</p>
            <p>Solo administradores autorizados pueden acceder.</p>
            <p>Todos los accesos son monitoreados y registrados.</p>
        </div>
        
        <script>
            document.getElementById('adminLogin').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                try {
                    const response = await fetch('/admin/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        localStorage.setItem('admin_token', result.token);
                        window.location.href = '/admin/dashboard';
                    } else {
                        alert('Error: ' + result.error);
                    }
                } catch (error) {
                    alert('Error de conexión: ' + error.message);
                }
            });
        </script>
    </body>
    </html>
    """)

@app.post("/admin/login")
async def admin_login(credentials: dict):
    """Login de administrador"""
    email = credentials.get('email')
    password = credentials.get('password')
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email y contraseña requeridos")
    
    auth_result = user_system.authenticate_user(email, password)
    
    if not auth_result['success']:
        raise HTTPException(status_code=401, detail=auth_result['error'])
    
    if auth_result['user']['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Acceso denegado - Solo administradores")
    
    return auth_result

@app.get("/admin/dashboard")
async def admin_dashboard(admin_user = Depends(verify_admin_token)):
    """Dashboard principal de administración"""
    stats = user_system.get_all_users_stats()
    
    return HTMLResponse(content=f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🛡️ Admin Dashboard - Son1kVers3</title>
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                color: #ffffff;
                font-family: 'Inter', sans-serif;
                min-height: 100vh;
                padding: 20px;
            }}
            .dashboard-header {{
                text-align: center;
                margin-bottom: 40px;
                padding: 20px;
                background: rgba(0, 255, 231, 0.1);
                border: 2px solid rgba(0, 255, 231, 0.3);
                border-radius: 15px;
            }}
            .dashboard-header h1 {{
                color: #00FFE7;
                font-size: 2rem;
                margin-bottom: 10px;
            }}
            .stats-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 40px;
            }}
            .stat-card {{
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(0, 255, 231, 0.2);
                border-radius: 10px;
                padding: 20px;
                text-align: center;
            }}
            .stat-value {{
                font-size: 2rem;
                font-weight: 700;
                color: #00FFE7;
                margin-bottom: 5px;
            }}
            .stat-label {{
                color: #cccccc;
                font-size: 0.9rem;
            }}
            .users-table {{
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(0, 255, 231, 0.2);
                border-radius: 10px;
                padding: 20px;
                overflow-x: auto;
            }}
            .logout-btn {{
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 107, 107, 0.9);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
            }}
        </style>
    </head>
    <body>
        <button class="logout-btn" onclick="logout()">🚪 Salir</button>
        
        <div class="dashboard-header">
            <h1>🛡️ Dashboard de Administración</h1>
            <p>Bienvenido, {admin_user['display_name']}</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">{stats['total_users']}</div>
                <div class="stat-label">Total Usuarios</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{stats['active_subscriptions']}</div>
                <div class="stat-label">Suscripciones Activas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats['monthly_revenue']:.2f}</div>
                <div class="stat-label">Ingresos Mensuales</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{stats['usage_summary']['total_tracks']}</div>
                <div class="stat-label">Tracks Generados</div>
            </div>
        </div>
        
        <div class="users-table">
            <h3>👥 Gestión de Usuarios</h3>
            <div id="usersData">Cargando datos encriptados...</div>
        </div>
        
        <script>
            function logout() {{
                localStorage.removeItem('admin_token');
                window.location.href = '/';
            }}
            
            // Cargar datos de usuarios
            async function loadUsersData() {{
                try {{
                    const token = localStorage.getItem('admin_token');
                    const response = await fetch('/admin/users', {{
                        headers: {{ 'Authorization': `Bearer ${{token}}` }}
                    }});
                    
                    const users = await response.json();
                    displayUsers(users);
                }} catch (error) {{
                    console.error('Error cargando usuarios:', error);
                }}
            }}
            
            function displayUsers(users) {{
                const container = document.getElementById('usersData');
                let html = '<table style="width: 100%; color: white;">';
                html += '<tr><th>Usuario</th><th>Email</th><th>Tier</th><th>Estado</th><th>Último Login</th><th>Acciones</th></tr>';
                
                users.forEach(user => {{
                    html += `<tr>
                        <td>${{user.display_name}}</td>
                        <td>${{user.email}}</td>
                        <td>${{user.tier}}</td>
                        <td>${{user.subscription.status}}</td>
                        <td>${{user.last_login || 'Nunca'}}</td>
                        <td>
                            <button onclick="banUser('${{user.id}}')">🚫 Ban</button>
                            <button onclick="editUser('${{user.id}}')">✏️ Editar</button>
                        </td>
                    </tr>`;
                }});
                
                html += '</table>';
                container.innerHTML = html;
            }}
            
            function banUser(userId) {{
                if (confirm('¿Estás seguro de banear este usuario?')) {{
                    // Implementar ban
                    console.log('Baneando usuario:', userId);
                }}
            }}
            
            function editUser(userId) {{
                // Implementar edición
                console.log('Editando usuario:', userId);
            }}
            
            // Cargar datos al iniciar
            loadUsersData();
        </script>
    </body>
    </html>
    """)

@app.get("/admin/users")
async def get_all_users(admin_user = Depends(verify_admin_token)):
    """Obtener todos los usuarios (solo admin)"""
    accounts = user_system.load_encrypted_accounts()
    
    # Remover datos sensibles
    safe_accounts = []
    for account in accounts:
        safe_account = {k: v for k, v in account.items() if k != 'password_hash'}
        safe_accounts.append(safe_account)
    
    return safe_accounts

@app.get("/admin/stats")
async def get_admin_stats(admin_user = Depends(verify_admin_token)):
    """Obtener estadísticas completas"""
    return user_system.get_all_users_stats()

@app.post("/admin/users/{user_id}/ban")
async def ban_user(user_id: str, admin_user = Depends(verify_admin_token)):
    """Banear usuario"""
    accounts = user_system.load_encrypted_accounts()
    
    for account in accounts:
        if account['id'] == user_id:
            account['subscription']['status'] = 'banned'
            account['banned_at'] = datetime.now().isoformat()
            account['banned_by'] = admin_user['id']
            break
    
    user_system.save_encrypted_accounts(accounts)
    return {"success": True, "message": f"Usuario {user_id} baneado"}

@app.post("/admin/users/{user_id}/unban")
async def unban_user(user_id: str, admin_user = Depends(verify_admin_token)):
    """Desbanear usuario"""
    accounts = user_system.load_encrypted_accounts()
    
    for account in accounts:
        if account['id'] == user_id:
            account['subscription']['status'] = 'active'
            if 'banned_at' in account:
                del account['banned_at']
            if 'banned_by' in account:
                del account['banned_by']
            break
    
    user_system.save_encrypted_accounts(accounts)
    return {"success": True, "message": f"Usuario {user_id} desbaneado"}

@app.get("/admin/revenue")
async def get_revenue_report(admin_user = Depends(verify_admin_token)):
    """Reporte de ingresos detallado"""
    accounts = user_system.load_encrypted_accounts()
    
    revenue_report = {
        'monthly_revenue': 0,
        'yearly_projection': 0,
        'by_tier': {'free': 0, 'pro': 0, 'enterprise': 0},
        'active_subscriptions': 0,
        'subscription_details': []
    }
    
    for account in accounts:
        if account['subscription']['status'] == 'active':
            monthly_fee = account['subscription']['monthly_fee']
            revenue_report['monthly_revenue'] += monthly_fee
            revenue_report['by_tier'][account['tier']] += monthly_fee
            revenue_report['active_subscriptions'] += 1
            
            revenue_report['subscription_details'].append({
                'user': account['display_name'],
                'email': account['email'],
                'tier': account['tier'],
                'monthly_fee': monthly_fee,
                'expires_at': account['subscription']['expires_at']
            })
    
    revenue_report['yearly_projection'] = revenue_report['monthly_revenue'] * 12
    
    return revenue_report

@app.get("/admin/security-log")
async def get_security_log(admin_user = Depends(verify_admin_token)):
    """Log de seguridad y accesos"""
    # En producción, esto leería de un archivo de log real
    return {
        'recent_logins': [
            {
                'user': admin_user['display_name'],
                'timestamp': datetime.now().isoformat(),
                'ip': '127.0.0.1',
                'success': True
            }
        ],
        'failed_attempts': [],
        'admin_actions': [
            {
                'admin': admin_user['display_name'],
                'action': 'dashboard_access',
                'timestamp': datetime.now().isoformat()
            }
        ]
    }

if __name__ == "__main__":
    print("🛡️ Iniciando Admin Dashboard Encriptado...")
    print("🔐 Dashboard disponible en: http://localhost:8080")
    print("👤 Admin: nov4-ix@son1kvers3.com")
    print("🔑 Password: admin_secure_2024")
    
    uvicorn.run(app, host="0.0.0.0", port=8080)
