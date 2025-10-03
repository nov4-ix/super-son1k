#!/bin/bash

# 🧪 Son1kVers3 API Connection Test Script
# Prueba las conexiones entre frontend y backend

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuración
API_URL="${API_URL:-http://localhost:8000}"
TIMEOUT=5

echo -e "${BOLD}${BLUE}============================================${NC}"
echo -e "${BOLD}${BLUE}  🧪 Son1kVers3 API Connection Test${NC}"
echo -e "${BOLD}${BLUE}============================================${NC}\n"

echo -e "${BLUE}API URL:${NC} $API_URL"
echo -e "${BLUE}Timeout:${NC} ${TIMEOUT}s\n"

# Función para probar endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo -n "Testing ${description}... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" --max-time $TIMEOUT "${API_URL}${endpoint}" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" --max-time $TIMEOUT -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "${API_URL}${endpoint}" 2>/dev/null)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✓${NC} (HTTP $http_code)"
        return 0
    elif [ "$http_code" = "404" ]; then
        echo -e "${YELLOW}⚠${NC} (HTTP $http_code - Not Found)"
        return 1
    elif [ "$http_code" = "422" ]; then
        echo -e "${YELLOW}⚠${NC} (HTTP $http_code - Validation Error)"
        return 1
    elif [ -z "$http_code" ]; then
        echo -e "${RED}✗${NC} (Connection Failed)"
        return 2
    else
        echo -e "${RED}✗${NC} (HTTP $http_code)"
        return 1
    fi
}

# Contador de resultados
total=0
passed=0
failed=0
connection_errors=0

echo -e "${BOLD}=== Health Checks ===${NC}\n"

test_endpoint "GET" "/" "Root endpoint"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

test_endpoint "GET" "/health" "Basic health check"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

test_endpoint "GET" "/health/detailed" "Detailed health check"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

test_endpoint "GET" "/api/status" "API status"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

echo -e "\n${BOLD}=== Advanced Features ===${NC}\n"

test_endpoint "GET" "/api/advanced/marketplace/categories" "Marketplace categories"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

test_endpoint "GET" "/api/advanced/public-api/tiers" "API tiers info"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

echo -e "\n${BOLD}=== Ghost Studio ===${NC}\n"

test_endpoint "GET" "/api/ghost-studio/presets" "Ghost Studio presets"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

echo -e "\n${BOLD}=== Clone Station ===${NC}\n"

test_endpoint "GET" "/api/clone-station/models" "Clone Station models"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

echo -e "\n${BOLD}=== The Creator ===${NC}\n"

test_endpoint "GET" "/api/the-creator/random-prompt" "Random prompt"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

echo -e "\n${BOLD}=== Community ===${NC}\n"

test_endpoint "GET" "/api/community/top-tracks" "Top tracks"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

echo -e "\n${BOLD}=== Monitoring ===${NC}\n"

test_endpoint "GET" "/api/monitoring/metrics/system" "System metrics"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

echo -e "\n${BOLD}=== UX Enhancement ===${NC}\n"

test_endpoint "GET" "/api/ux/theme/list" "Available themes"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

echo -e "\n${BOLD}=== Integrations ===${NC}\n"

test_endpoint "GET" "/api/integrations/spotify/authenticate" "Spotify auth (GET)"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

echo -e "\n${BOLD}=== Store ===${NC}\n"

test_endpoint "GET" "/api/store/products" "Store products"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

echo -e "\n${BOLD}=== Waves Integration ===${NC}\n"

test_endpoint "GET" "/api/waves/plugins" "Waves plugins list"
((total++)); [ $? -eq 0 ] && ((passed++)) || [ $? -eq 2 ] && ((connection_errors++)) || ((failed++))

# Resumen
echo -e "\n${BOLD}${BLUE}============================================${NC}"
echo -e "${BOLD}${BLUE}              Test Summary${NC}"
echo -e "${BOLD}${BLUE}============================================${NC}\n"

echo -e "Total tests: ${BOLD}$total${NC}"
echo -e "${GREEN}Passed: $passed${NC}"
echo -e "${RED}Failed: $failed${NC}"
echo -e "${YELLOW}Connection errors: $connection_errors${NC}"

# Calcular porcentaje
if [ $total -gt 0 ]; then
    percentage=$((passed * 100 / total))
    echo -e "\nSuccess rate: ${BOLD}${percentage}%${NC}"
    
    if [ $connection_errors -gt 0 ]; then
        echo -e "\n${RED}⚠️  Backend server may not be running!${NC}"
        echo -e "${YELLOW}Start the backend with: cd backend && python3 main.py${NC}"
    elif [ $percentage -ge 80 ]; then
        echo -e "\n${GREEN}✨ API connections are healthy!${NC}"
    elif [ $percentage -ge 60 ]; then
        echo -e "\n${YELLOW}⚠️  Some endpoints need attention${NC}"
    else
        echo -e "\n${RED}❌ Multiple endpoints are failing${NC}"
    fi
fi

# Exit code
if [ $connection_errors -gt 0 ]; then
    exit 2
elif [ $percentage -ge 80 ]; then
    exit 0
else
    exit 1
fi
