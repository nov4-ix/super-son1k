#!/usr/bin/env python3
"""
🔍 Son1kVers3 Endpoint Verification Script
Verifica que todos los endpoints y conexiones estén correctamente configurados
"""

import os
import sys
import importlib.util
from pathlib import Path
import re

# Colores para output
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text:^60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓{Colors.END} {text}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠{Colors.END} {text}")

def print_error(text):
    print(f"{Colors.RED}✗{Colors.END} {text}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ{Colors.END} {text}")

# Estructura esperada de endpoints
EXPECTED_ENDPOINTS = {
    "advanced_features_endpoints.py": {
        "prefix": "/api/advanced",
        "endpoints": [
            "POST /collaboration/create",
            "POST /collaboration/join",
            "POST /collaboration/cursor",
            "POST /collaboration/broadcast",
            "POST /versioning/create",
            "GET /versioning/list",
            "POST /versioning/restore",
            "GET /marketplace/list",
            "POST /marketplace/publish",
            "POST /api-keys/generate",
            "GET /api-keys/usage"
        ]
    },
    "integrations_endpoints.py": {
        "prefix": "/api/integrations",
        "endpoints": [
            "POST /spotify/authenticate",
            "POST /spotify/upload",
            "POST /apple-music/authenticate",
            "POST /apple-music/upload",
            "POST /social-media/post",
            "POST /marketing/email-campaign",
            "POST /cloud/upload"
        ]
    },
    "monitoring_endpoints.py": {
        "prefix": "/api/monitoring",
        "endpoints": [
            "GET /metrics",
            "GET /logs",
            "GET /errors",
            "GET /performance",
            "POST /alerts/configure",
            "GET /health/services"
        ]
    },
    "ux_enhancement_endpoints.py": {
        "prefix": "/api/ux",
        "endpoints": [
            "GET /tutorial/start",
            "POST /tutorial/progress",
            "POST /tutorial/complete",
            "POST /feedback/submit",
            "GET /feedback/stats",
            "POST /shortcuts/save",
            "GET /shortcuts/list"
        ]
    },
    "ghost_studio_endpoints.py": {
        "prefix": "/api/ghost-studio",
        "endpoints": [
            "POST /generate",
            "POST /process",
            "GET /presets",
            "POST /save-preset"
        ]
    },
    "clone_station_endpoints.py": {
        "prefix": "/api/clone-station",
        "endpoints": [
            "POST /clone",
            "POST /train",
            "GET /models",
            "POST /convert"
        ]
    },
    "nova_post_enhanced_endpoints.py": {
        "prefix": "/api/nova-post",
        "endpoints": [
            "POST /analyze",
            "POST /schedule",
            "POST /post",
            "GET /analytics"
        ]
    },
    "the_creator_endpoints.py": {
        "prefix": "/api/creator",
        "endpoints": [
            "POST /generate-music",
            "POST /generate-lyrics",
            "POST /generate-cover",
            "GET /history"
        ]
    },
    "auth_endpoints.py": {
        "prefix": "/api/auth",
        "endpoints": [
            "POST /register",
            "POST /login",
            "POST /logout",
            "GET /me"
        ]
    },
    "community_endpoints.py": {
        "prefix": "/api/community",
        "endpoints": [
            "GET /tracks",
            "POST /tracks",
            "GET /users"
        ]
    }
}

def check_file_exists(backend_dir, filename):
    """Verifica si un archivo existe"""
    filepath = backend_dir / filename
    if filepath.exists():
        print_success(f"Archivo encontrado: {filename}")
        return True
    else:
        print_error(f"Archivo NO encontrado: {filename}")
        return False

def check_router_definition(backend_dir, filename, expected_prefix):
    """Verifica que el router esté correctamente definido"""
    filepath = backend_dir / filename
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Buscar definición del router
        router_pattern = r'router\s*=\s*APIRouter\s*\('
        if re.search(router_pattern, content):
            print_success(f"  Router definido correctamente")
            
            # Verificar prefix
            prefix_pattern = rf'prefix\s*=\s*["\']({expected_prefix})["\']'
            if re.search(prefix_pattern, content):
                print_success(f"  Prefix correcto: {expected_prefix}")
            else:
                print_warning(f"  Prefix no encontrado o incorrecto (esperado: {expected_prefix})")
            
            return True
        else:
            print_error(f"  Router NO definido")
            return False
            
    except Exception as e:
        print_error(f"  Error al leer archivo: {e}")
        return False

def check_endpoints_defined(backend_dir, filename, expected_endpoints):
    """Verifica que los endpoints estén definidos"""
    filepath = backend_dir / filename
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        found_endpoints = []
        missing_endpoints = []
        
        for endpoint in expected_endpoints:
            method, path = endpoint.split(' ', 1)
            # Buscar decorador del endpoint
            pattern = rf'@router\.{method.lower()}\(["\']({path})["\']'
            if re.search(pattern, content, re.IGNORECASE):
                found_endpoints.append(endpoint)
            else:
                missing_endpoints.append(endpoint)
        
        if found_endpoints:
            print_success(f"  Endpoints encontrados: {len(found_endpoints)}/{len(expected_endpoints)}")
            for ep in found_endpoints[:3]:  # Mostrar solo los primeros 3
                print(f"    • {ep}")
            if len(found_endpoints) > 3:
                print(f"    ... y {len(found_endpoints) - 3} más")
        
        if missing_endpoints:
            print_warning(f"  Endpoints faltantes: {len(missing_endpoints)}")
            for ep in missing_endpoints[:3]:
                print(f"    • {ep}")
            if len(missing_endpoints) > 3:
                print(f"    ... y {len(missing_endpoints) - 3} más")
        
        return len(found_endpoints), len(missing_endpoints)
        
    except Exception as e:
        print_error(f"  Error al verificar endpoints: {e}")
        return 0, len(expected_endpoints)

def check_main_py_imports(backend_dir):
    """Verifica que main.py importe todos los routers"""
    filepath = backend_dir / "main.py"
    
    print_header("VERIFICANDO MAIN.PY")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        imported_routers = []
        included_routers = []
        
        # Buscar imports
        for filename in EXPECTED_ENDPOINTS.keys():
            module_name = filename.replace('.py', '')
            import_pattern = rf'from {module_name} import.*router'
            if re.search(import_pattern, content):
                imported_routers.append(module_name)
                print_success(f"Router importado: {module_name}")
            else:
                print_warning(f"Router NO importado: {module_name}")
        
        # Buscar includes
        include_pattern = r'app\.include_router\((\w+)\)'
        includes = re.findall(include_pattern, content)
        
        print(f"\n{Colors.BOLD}Routers incluidos en la app:{Colors.END}")
        for router_var in includes:
            print_success(f"  app.include_router({router_var})")
        
        return len(imported_routers), len(includes)
        
    except Exception as e:
        print_error(f"Error al verificar main.py: {e}")
        return 0, 0

def check_frontend_api_calls(frontend_dir):
    """Verifica las llamadas API en el frontend"""
    print_header("VERIFICANDO LLAMADAS API EN FRONTEND")
    
    api_calls = {}
    
    # Buscar archivos .jsx y .js
    for filepath in frontend_dir.rglob('*.jsx'):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Buscar llamadas axios o fetch
            axios_pattern = r'axios\.(get|post|put|delete)\(["\']([^"\']+)["\']'
            fetch_pattern = r'fetch\(["\']([^"\']+)["\']'
            
            axios_calls = re.findall(axios_pattern, content)
            fetch_calls = re.findall(fetch_pattern, content)
            
            if axios_calls or fetch_calls:
                relative_path = filepath.relative_to(frontend_dir)
                api_calls[str(relative_path)] = {
                    'axios': [f"{method.upper()} {url}" for method, url in axios_calls],
                    'fetch': fetch_calls
                }
        except Exception as e:
            pass
    
    if api_calls:
        print_success(f"Archivos con llamadas API encontrados: {len(api_calls)}")
        for file, calls in list(api_calls.items())[:5]:
            print(f"\n  📄 {file}")
            for call in calls['axios'][:3]:
                print(f"    • {call}")
            for call in calls['fetch'][:3]:
                print(f"    • GET {call}")
    else:
        print_warning("No se encontraron llamadas API en el frontend")
    
    return len(api_calls)

def check_cors_configuration(backend_dir):
    """Verifica la configuración de CORS"""
    print_header("VERIFICANDO CONFIGURACIÓN CORS")
    
    filepath = backend_dir / "main.py"
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'CORSMiddleware' in content:
            print_success("CORSMiddleware configurado")
            
            if 'allow_origins' in content:
                print_success("  allow_origins configurado")
            if 'allow_credentials' in content:
                print_success("  allow_credentials configurado")
            if 'allow_methods' in content:
                print_success("  allow_methods configurado")
            if 'allow_headers' in content:
                print_success("  allow_headers configurado")
            
            return True
        else:
            print_error("CORSMiddleware NO configurado")
            return False
            
    except Exception as e:
        print_error(f"Error al verificar CORS: {e}")
        return False

def main():
    print_header("🔍 SON1KVERS3 ENDPOINT VERIFICATION")
    
    # Obtener directorios
    script_dir = Path(__file__).parent
    backend_dir = script_dir / "backend"
    frontend_dir = script_dir / "frontend" / "src"
    
    if not backend_dir.exists():
        print_error(f"Directorio backend no encontrado: {backend_dir}")
        return
    
    # Estadísticas
    total_files = len(EXPECTED_ENDPOINTS)
    files_found = 0
    total_endpoints_expected = sum(len(v['endpoints']) for v in EXPECTED_ENDPOINTS.values())
    total_endpoints_found = 0
    total_endpoints_missing = 0
    
    # Verificar cada archivo de endpoints
    print_header("VERIFICANDO ARCHIVOS DE ENDPOINTS")
    
    for filename, config in EXPECTED_ENDPOINTS.items():
        print(f"\n{Colors.BOLD}📄 {filename}{Colors.END}")
        
        if check_file_exists(backend_dir, filename):
            files_found += 1
            check_router_definition(backend_dir, filename, config['prefix'])
            found, missing = check_endpoints_defined(backend_dir, filename, config['endpoints'])
            total_endpoints_found += found
            total_endpoints_missing += missing
    
    # Verificar main.py
    imported, included = check_main_py_imports(backend_dir)
    
    # Verificar CORS
    check_cors_configuration(backend_dir)
    
    # Verificar frontend
    if frontend_dir.exists():
        api_calls_count = check_frontend_api_calls(frontend_dir)
    else:
        print_warning(f"Directorio frontend no encontrado: {frontend_dir}")
        api_calls_count = 0
    
    # Resumen final
    print_header("📊 RESUMEN DE VERIFICACIÓN")
    
    print(f"\n{Colors.BOLD}Backend:{Colors.END}")
    print(f"  Archivos de endpoints: {files_found}/{total_files}")
    print(f"  Endpoints encontrados: {total_endpoints_found}/{total_endpoints_expected}")
    print(f"  Endpoints faltantes: {total_endpoints_missing}")
    print(f"  Routers importados: {imported}/{total_files}")
    print(f"  Routers incluidos: {included}")
    
    print(f"\n{Colors.BOLD}Frontend:{Colors.END}")
    print(f"  Archivos con llamadas API: {api_calls_count}")
    
    # Calcular score
    backend_score = ((files_found / total_files) * 30 + 
                     (total_endpoints_found / total_endpoints_expected) * 40 +
                     (imported / total_files) * 15 +
                     (included / total_files) * 15)
    
    print(f"\n{Colors.BOLD}Score de Integridad: {backend_score:.1f}/100{Colors.END}")
    
    if backend_score >= 90:
        print_success("\n✨ Sistema en excelente estado!")
    elif backend_score >= 70:
        print_warning("\n⚠️  Sistema funcional con algunas advertencias")
    else:
        print_error("\n❌ Sistema requiere atención")
    
    return backend_score >= 70

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except Exception as e:
        print_error(f"\n❌ Error crítico: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
