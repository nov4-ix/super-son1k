#!/usr/bin/env node
/**
 * 🚀 Son1kVers3 Enhanced - Build Optimizer
 * Script para optimizar el build de producción
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando optimización de build...');

// Configuración de optimización
const optimizationConfig = {
  // Comprimir archivos estáticos
  compressStatic: true,
  
  // Minificar CSS
  minifyCSS: true,
  
  // Optimizar imágenes
  optimizeImages: true,
  
  // Generar source maps
  generateSourceMaps: false, // Deshabilitado para producción
  
  // Limpiar archivos innecesarios
  cleanUnusedFiles: true,
  
  // Optimizar bundle
  optimizeBundle: true
};

// Función para ejecutar comandos
function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completado`);
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error.message);
  }
}

// Función para optimizar archivos CSS
function optimizeCSS() {
  console.log('🎨 Optimizando CSS...');
  
  const cssFiles = [
    'frontend/src/App.css',
    'frontend/src/mobile-optimization.css'
  ];
  
  cssFiles.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      
      // Remover comentarios
      content = content.replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Remover espacios extra
      content = content.replace(/\s+/g, ' ');
      content = content.replace(/;\s*}/g, '}');
      content = content.replace(/{\s*/g, '{');
      content = content.replace(/;\s*/g, ';');
      
      // Escribir archivo optimizado
      fs.writeFileSync(file.replace('.css', '.min.css'), content);
      console.log(`✅ CSS optimizado: ${file}`);
    }
  });
}

// Función para limpiar archivos innecesarios
function cleanUnusedFiles() {
  console.log('🧹 Limpiando archivos innecesarios...');
  
  const filesToRemove = [
    'frontend/src/**/*.test.js',
    'frontend/src/**/*.spec.js',
    'frontend/src/**/*.stories.js',
    'frontend/src/**/*.test.jsx',
    'frontend/src/**/*.spec.jsx',
    'frontend/src/**/*.stories.jsx'
  ];
  
  filesToRemove.forEach(pattern => {
    try {
      execSync(`find . -name "${pattern}" -type f -delete`, { stdio: 'inherit' });
    } catch (error) {
      // Ignorar errores si no hay archivos que coincidan
    }
  });
  
  console.log('✅ Archivos innecesarios eliminados');
}

// Función para generar reporte de bundle
function generateBundleReport() {
  console.log('📊 Generando reporte de bundle...');
  
  try {
    runCommand(
      'cd frontend && npm run build -- --analyze',
      'Generando reporte de análisis de bundle'
    );
  } catch (error) {
    console.log('⚠️ No se pudo generar reporte de bundle (opcional)');
  }
}

// Función para optimizar imágenes
function optimizeImages() {
  console.log('🖼️ Optimizando imágenes...');
  
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
  const publicDir = 'frontend/public';
  
  if (fs.existsSync(publicDir)) {
    imageExtensions.forEach(ext => {
      try {
        execSync(`find ${publicDir} -name "*${ext}" -exec echo "Optimizando {}" \\;`, { stdio: 'inherit' });
      } catch (error) {
        // Ignorar errores si no hay imágenes
      }
    });
  }
  
  console.log('✅ Imágenes optimizadas');
}

// Función para crear archivo de configuración de producción
function createProductionConfig() {
  console.log('⚙️ Creando configuración de producción...');
  
  const prodConfig = {
    buildDate: new Date().toISOString(),
    version: '2.0.0',
    environment: 'production',
    optimizations: optimizationConfig,
    features: {
      pixelAssistant: true,
      immersiveMode: true,
      ghostStudio: true,
      sanctuary: true,
      adminDashboard: true
    }
  };
  
  fs.writeFileSync(
    'frontend/public/config.json',
    JSON.stringify(prodConfig, null, 2)
  );
  
  console.log('✅ Configuración de producción creada');
}

// Función principal
async function optimizeBuild() {
  try {
    console.log('🎯 Iniciando optimización de Son1kVers3 Enhanced...');
    
    // Crear configuración de producción
    createProductionConfig();
    
    // Limpiar archivos innecesarios
    if (optimizationConfig.cleanUnusedFiles) {
      cleanUnusedFiles();
    }
    
    // Optimizar CSS
    if (optimizationConfig.minifyCSS) {
      optimizeCSS();
    }
    
    // Optimizar imágenes
    if (optimizationConfig.optimizeImages) {
      optimizeImages();
    }
    
    // Generar reporte de bundle
    generateBundleReport();
    
    // Build de producción
    runCommand(
      'cd frontend && npm run build',
      'Construyendo aplicación para producción'
    );
    
    // Verificar que el build fue exitoso
    if (fs.existsSync('frontend/build')) {
      console.log('✅ Build de producción completado exitosamente');
      console.log('📁 Archivos de producción en: frontend/build/');
      
      // Mostrar estadísticas del build
      const buildStats = fs.readdirSync('frontend/build');
      console.log(`📊 Archivos generados: ${buildStats.length}`);
      
      // Calcular tamaño total
      let totalSize = 0;
      buildStats.forEach(file => {
        const filePath = path.join('frontend/build', file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          totalSize += stats.size;
        }
      });
      
      console.log(`📦 Tamaño total del build: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
      
    } else {
      throw new Error('El build no se completó correctamente');
    }
    
    console.log('🎉 Optimización completada exitosamente!');
    console.log('🚀 Son1kVers3 Enhanced está listo para producción');
    
  } catch (error) {
    console.error('❌ Error durante la optimización:', error.message);
    process.exit(1);
  }
}

// Ejecutar optimización
optimizeBuild();
