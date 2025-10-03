# 🎛️ Son1kVers3 Audio Plugins

Professional-grade audio processing plugins for the ResistanceDAWPro system.

## Available Plugins

### 🎚️ ALVAEEqualizer

**Category:** EQ  
**Description:** Ecualizador paramétrico de 8 bandas con análisis de espectro en tiempo real  
**Features:**

- 8 bandas paramétricas ajustables
- Visualización de espectro FFT
- Presets profesionales
- Filtros high-pass y low-pass

### 🔊 SonicCompressor

**Category:** Dynamics  
**Description:** Compresor estilo CLA-76 con medidor de reducción de ganancia  
**Features:**

- Ratio variable (1:1 a 20:1)
- Attack y Release ajustables
- Knee suave/duro
- Medidor GR en tiempo real

### 🔊 ResistanceCompressor

**Category:** Dynamics  
**Description:** Compresor de alta resistencia con controles avanzados  
**Features:**

- Compresión paralela
- Sidechain filtering
- Visualización de forma de onda
- Presets optimizados

### 🎤 VocalCompressor

**Category:** Vocals  
**Description:** Compresor optimizado específicamente para procesamiento de voces  
**Features:**

- Presets vocales (Soft, Punchy, Broadcast, Gentle)
- Control de presencia
- HPF en sidechain
- Visualización de compresión

### 🔇 DeEsser

**Category:** Vocals  
**Description:** Control de sibilantes para voces profesionales  
**Features:**

- Modos Split Band y Wideband
- Detección de sibilancia en tiempo real
- Control de frecuencia y umbral
- Modo Listen para monitoreo

### 🎧 StereoEnhancer

**Category:** Mastering  
**Description:** Mejora de imagen estéreo y procesamiento M/S  
**Features:**

- Control de ancho estéreo (0-200%)
- Procesamiento Mid/Side
- Medidor de correlación
- Detección de problemas de fase
- Presets (Wide, Narrow, Mono)

### 🌊 ReverbChamber

**Category:** Effects  
**Description:** Reverberación de cámara con múltiples algoritmos  
**Features:**

- 4 tipos de reverb (Room, Hall, Plate, Spring)
- Pre-delay ajustable
- Damping y difusión
- Visualización de respuesta de impulso

### 🔥 SaturatorPro

**Category:** Effects  
**Description:** Saturación y distorsión armónica  
**Features:**

- 4 tipos de saturación (Tube, Tape, Analog, Digital)
- Control de drive y mix
- Visualización de armónicos
- Procesamiento de color tonal

### 🧱 LimiterPro

**Category:** Mastering  
**Description:** Limitador de brickwall para mastering  
**Features:**

- True Peak limiting
- Lookahead ajustable
- Medidor de reducción de ganancia
- ISP (Inter-Sample Peak) detection

## Usage

### Basic Import

```jsx
import { VocalCompressor, DeEsser, StereoEnhancer } from './components/plugins';
```

### Individual Import

```jsx
import VocalCompressor from './components/plugins/VocalCompressor';
```

### Integration with ResistanceDAWPro

All plugins are automatically integrated into the ResistanceDAWPro system and can be added to any track through the plugin browser.

```jsx
const availablePlugins = [
  { id: 'vocal-compressor', name: 'Vocal Compressor', component: VocalCompressor },
  { id: 'de-esser', name: 'De-Esser', component: DeEsser },
  // ... more plugins
];
```

## Plugin Architecture

### Common Structure

Each plugin follows a consistent structure:

```jsx
const PluginName = () => {
  // State management
  const [params, setParams] = useState({...});
  
  // Parameter update handler
  const updateParam = (param, value) => {
    setParams({ ...params, [param]: value });
  };
  
  return (
    <div className="plugin-name">
      <div className="plugin-header-section">
        {/* Header with branding */}
      </div>
      
      <div className="plugin-main">
        {/* Visualizers and controls */}
      </div>
      
      <div className="plugin-footer">
        {/* Footer info */}
      </div>
    </div>
  );
};
```

### Common CSS Classes

All plugins share these CSS classes for consistency:

- `.plugin-header-section` - Header container
- `.plugin-branding` - Logo and title area
- `.plugin-subtitle` - Subtitle text
- `.control-group` - Individual control container
- `.knob-container` - Knob control wrapper
- `.knob` - Rotary knob element
- `.knob-indicator` - Knob position indicator
- `.param-value` - Parameter value display
- `.plugin-footer` - Footer container

### Knob Controls

Knobs use a rotation-based visual feedback:

```jsx
<div className="knob" style={{
  transform: `rotate(${((value - min) / (max - min)) * 270 - 135}deg)`
}}>
  <div className="knob-indicator"></div>
</div>
<input
  type="range"
  min={min}
  max={max}
  value={value}
  onChange={(e) => updateParam('param', parseFloat(e.target.value))}
  className="knob-input"
/>
```

## Styling Guidelines

### Color Palette

- **Primary Accent:** `#4FACFE` (Cyan)
- **Secondary Accent:** `#FF006E` (Pink)
- **Tertiary Accent:** `#8338EC` (Purple)
- **Warning:** `#FFD700` (Gold)
- **Background Dark:** `#0a0a0a`
- **Background Medium:** `#1a1a1a`
- **Border:** `#333`

### Typography

- **Headers:** `'Inter', sans-serif` - Bold, uppercase
- **Values:** `'Share Tech Mono', monospace` - For numeric displays
- **Body:** `'Inter', sans-serif` - Regular weight

## Development

### Adding a New Plugin

1. Create `PluginName.jsx` in `/components/plugins/`
2. Create `PluginName.css` in `/components/plugins/`
3. Follow the common structure pattern
4. Add to `index.js` exports
5. Register in `ResistanceDAWPro.jsx`

### Testing

Each plugin should be tested for:

- Parameter range validation
- Visual feedback accuracy
- Responsive layout
- Performance with real-time updates

## Performance Considerations

- Use `React.memo()` for expensive visualizations
- Throttle rapid parameter updates
- Lazy load heavy audio processing
- Optimize SVG rendering for visualizers

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Part of Son1kVers3 Enhanced - MIT License

---

**Version:** 2.0  
**Last Updated:** October 2025  
**Maintainer:** Son1kVers3 Team
