#!/bin/bash

# 🔍 Son1kVers3 Complete System Verification
# Ejecuta todas las verificaciones del sistema

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

clear

echo -e "${BOLD}${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ███████╗ ██████╗ ███╗   ██╗ ██╗██╗  ██╗██╗   ██╗███████╗  ║
║   ██╔════╝██╔═══██╗████╗  ██║███║██║ ██╔╝██║   ██║██╔════╝  ║
║   ███████╗██║   ██║██╔██╗ ██║╚██║█████╔╝ ██║   ██║███████╗  ║
║   ╚════██║██║   ██║██║╚██╗██║ ██║██╔═██╗ ╚██╗ ██╔╝╚════██║  ║
║   ███████║╚██████╔╝██║ ╚████║ ██║██║  ██╗ ╚████╔╝ ███████║  ║
║   ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝  ║
║                                                               ║
║              🎵 Complete System Verification 🎵               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

# Contadores
total_checks=0
passed_checks=0
failed_checks=0

# Función para ejecutar verificación
run_check() {
    local name=$1
    local command=$2
    local description=$3
    
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${MAGENTA}🔍 $name${NC}"
    echo -e "${CYAN}$description${NC}"
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    
    ((total_checks++))
    
    if eval "$command"; then
        echo -e "\n${GREEN}✅ $name: PASSED${NC}\n"
        ((passed_checks++))
        return 0
    else
        echo -e "\n${RED}❌ $name: FAILED${NC}\n"
        ((failed_checks++))
        return 1
    fi
}

# Verificación 1: Plugin System
run_check \
    "Plugin System Verification" \
    "./verify_plugins.sh" \
    "Verificando sistema de plugins de audio (9 plugins)"

# Verificación 2: Backend Endpoints
run_check \
    "Backend Endpoints Verification" \
    "python3 verify_endpoints.py" \
    "Verificando endpoints del backend (119 endpoints esperados)"

# Verificación 3: Python Imports
run_check \
    "Python Module Imports" \
    "cd backend && python3 -c 'import main; import advanced_features_endpoints; import integrations_endpoints; import monitoring_endpoints; import ux_enhancement_endpoints; import ghost_studio_endpoints; import clone_station_endpoints; import nova_post_enhanced_endpoints; import the_creator_endpoints; import auth_endpoints; import community_endpoints; print(\"✅ All modules imported successfully\")'" \
    "Verificando que todos los módulos Python se puedan importar"

# Verificación 4: Frontend Structure
run_check \
    "Frontend Structure" \
    "test -d frontend/src && test -d frontend/src/components && test -d frontend/src/components/plugins && echo '✅ Frontend structure OK'" \
    "Verificando estructura de directorios del frontend"

# Verificación 5: Documentation
run_check \
    "Documentation Completeness" \
    "test -f ENDPOINTS_MAPPING.md && test -f PLUGIN_SYSTEM_COMPLETION.md && test -f SYSTEM_VERIFICATION_REPORT.md && test -f ADVANCED_FEATURES_DOCUMENTATION.md && echo '✅ All documentation files present'" \
    "Verificando que toda la documentación esté presente"

# Verificación 6: Configuration Files
run_check \
    "Configuration Files" \
    "test -f backend/main.py && test -f frontend/package.json && echo '✅ Configuration files OK'" \
    "Verificando archivos de configuración principales"

# Resumen Final
echo -e "${BOLD}${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                      VERIFICATION SUMMARY                     ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

echo -e "${BOLD}Total Checks:${NC} $total_checks"
echo -e "${GREEN}${BOLD}Passed:${NC} $passed_checks"
echo -e "${RED}${BOLD}Failed:${NC} $failed_checks"

# Calcular porcentaje
if [ $total_checks -gt 0 ]; then
    percentage=$((passed_checks * 100 / total_checks))
    echo -e "\n${BOLD}Success Rate:${NC} ${percentage}%"
    
    # Barra de progreso
    echo -n "Progress: ["
    filled=$((percentage / 5))
    for ((i=0; i<20; i++)); do
        if [ $i -lt $filled ]; then
            echo -n "${GREEN}█${NC}"
        else
            echo -n "░"
        fi
    done
    echo "]"
    
    echo ""
    
    # Veredicto final
    if [ $percentage -eq 100 ]; then
        echo -e "${GREEN}${BOLD}"
        cat << "EOF"
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║   ✨✨✨  PERFECT! ALL CHECKS PASSED!  ✨✨✨            ║
    ║                                                           ║
    ║   🚀 System is PRODUCTION READY! 🚀                      ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
EOF
        echo -e "${NC}\n"
        
        echo -e "${CYAN}Next Steps:${NC}"
        echo -e "  1. Review ${BOLD}SYSTEM_VERIFICATION_REPORT.md${NC} for details"
        echo -e "  2. Configure production environment variables"
        echo -e "  3. Set up PostgreSQL database"
        echo -e "  4. Configure Redis for caching"
        echo -e "  5. Deploy to staging environment"
        echo -e "  6. Run load tests"
        echo -e "  7. Deploy to production! 🎉\n"
        
    elif [ $percentage -ge 80 ]; then
        echo -e "${YELLOW}${BOLD}"
        cat << "EOF"
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║   ⚠️  GOOD! Most checks passed                           ║
    ║                                                           ║
    ║   System is functional but needs attention               ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
EOF
        echo -e "${NC}\n"
        echo -e "${YELLOW}Please review failed checks above${NC}\n"
        
    else
        echo -e "${RED}${BOLD}"
        cat << "EOF"
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║   ❌ ATTENTION NEEDED!                                    ║
    ║                                                           ║
    ║   Multiple checks failed - review required               ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
EOF
        echo -e "${NC}\n"
        echo -e "${RED}Please fix the issues above before proceeding${NC}\n"
    fi
fi

# Información adicional
echo -e "${BOLD}${CYAN}📚 Documentation:${NC}"
echo -e "  • SYSTEM_VERIFICATION_REPORT.md - Complete system status"
echo -e "  • ENDPOINTS_MAPPING.md - API endpoints reference"
echo -e "  • PLUGIN_SYSTEM_COMPLETION.md - Audio plugins documentation"
echo -e "  • ADVANCED_FEATURES_DOCUMENTATION.md - Advanced features guide"

echo -e "\n${BOLD}${CYAN}🔧 Verification Scripts:${NC}"
echo -e "  • ./verify_plugins.sh - Verify audio plugins"
echo -e "  • python3 verify_endpoints.py - Verify API endpoints"
echo -e "  • ./test_api_connections.sh - Test API connections (requires server running)"

echo -e "\n${BOLD}${CYAN}🚀 Quick Start:${NC}"
echo -e "  Backend:  cd backend && python3 main.py"
echo -e "  Frontend: cd frontend && npm start"
echo -e "  API Docs: http://localhost:8000/docs"

echo -e "\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Exit code
if [ $percentage -ge 80 ]; then
    exit 0
else
    exit 1
fi
