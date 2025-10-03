#!/bin/bash

# 🎛️ Son1kVers3 Plugin System Verification Script

echo "🎛️  Son1kVers3 Plugin System Verification"
echo "=========================================="
echo ""

PLUGINS_DIR="frontend/src/components/plugins"
ERRORS=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Plugin list
PLUGINS=(
    "ALVAEEqualizer"
    "SonicCompressor"
    "ResistanceCompressor"
    "VocalCompressor"
    "DeEsser"
    "StereoEnhancer"
    "ReverbChamber"
    "SaturatorPro"
    "LimiterPro"
)

echo "📋 Checking plugin files..."
echo ""

for plugin in "${PLUGINS[@]}"; do
    JSX_FILE="$PLUGINS_DIR/${plugin}.jsx"
    CSS_FILE="$PLUGINS_DIR/${plugin}.css"
    
    echo -n "  Checking $plugin... "
    
    if [ -f "$JSX_FILE" ] && [ -f "$CSS_FILE" ]; then
        echo -e "${GREEN}✓${NC} JSX + CSS"
    elif [ -f "$JSX_FILE" ]; then
        echo -e "${YELLOW}⚠${NC} JSX only (missing CSS)"
        ((WARNINGS++))
    elif [ -f "$CSS_FILE" ]; then
        echo -e "${YELLOW}⚠${NC} CSS only (missing JSX)"
        ((WARNINGS++))
    else
        echo -e "${RED}✗${NC} Missing both files"
        ((ERRORS++))
    fi
done

echo ""
echo "📦 Checking support files..."
echo ""

# Check index.js
if [ -f "$PLUGINS_DIR/index.js" ]; then
    echo -e "  ${GREEN}✓${NC} index.js exists"
else
    echo -e "  ${RED}✗${NC} index.js missing"
    ((ERRORS++))
fi

# Check README.md
if [ -f "$PLUGINS_DIR/README.md" ]; then
    echo -e "  ${GREEN}✓${NC} README.md exists"
else
    echo -e "  ${YELLOW}⚠${NC} README.md missing"
    ((WARNINGS++))
fi

echo ""
echo "🔍 Checking ResistanceDAWPro integration..."
echo ""

DAW_FILE="frontend/src/components/ResistanceDAWPro.jsx"

if [ -f "$DAW_FILE" ]; then
    echo -e "  ${GREEN}✓${NC} ResistanceDAWPro.jsx exists"
    
    # Check imports
    for plugin in "${PLUGINS[@]}"; do
        if grep -q "import.*$plugin.*from.*plugins" "$DAW_FILE"; then
            echo -e "  ${GREEN}✓${NC} $plugin imported"
        else
            echo -e "  ${YELLOW}⚠${NC} $plugin not imported"
            ((WARNINGS++))
        fi
    done
else
    echo -e "  ${RED}✗${NC} ResistanceDAWPro.jsx not found"
    ((ERRORS++))
fi

echo ""
echo "📊 Statistics"
echo "============="
echo "  Total plugins: ${#PLUGINS[@]}"
echo "  JSX files: $(ls -1 $PLUGINS_DIR/*.jsx 2>/dev/null | wc -l | tr -d ' ')"
echo "  CSS files: $(ls -1 $PLUGINS_DIR/*.css 2>/dev/null | wc -l | tr -d ' ')"
echo ""

# Summary
echo "📝 Summary"
echo "=========="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Plugin system is complete.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Checks passed with $WARNINGS warning(s).${NC}"
    exit 0
else
    echo -e "${RED}✗ Found $ERRORS error(s) and $WARNINGS warning(s).${NC}"
    exit 1
fi
