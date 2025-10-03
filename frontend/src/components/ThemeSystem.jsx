import React, { createContext, useContext, useState, useEffect } from 'react';
import './ThemeSystem.css';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [customColors, setCustomColors] = useState({
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb'
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedColors = JSON.parse(localStorage.getItem('customColors') || '{}');
    setTheme(savedTheme);
    if (Object.keys(savedColors).length > 0) {
      setCustomColors(savedColors);
    }
    applyTheme(savedTheme, savedColors);
  }, []);

  const applyTheme = (themeName, colors = customColors) => {
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Aplicar colores personalizados
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const updateCustomColors = (colors) => {
    setCustomColors(colors);
    localStorage.setItem('customColors', JSON.stringify(colors));
    applyTheme(theme, colors);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, customColors, updateCustomColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button className="theme-toggle" onClick={toggleTheme} title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
};

export const ThemeCustomizer = () => {
  const { customColors, updateCustomColors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [colors, setColors] = useState(customColors);

  const presets = {
    purple: { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb' },
    blue: { primary: '#4facfe', secondary: '#00f2fe', accent: '#43e97b' },
    pink: { primary: '#fa709a', secondary: '#fee140', accent: '#f093fb' },
    green: { primary: '#43e97b', secondary: '#38f9d7', accent: '#667eea' },
    orange: { primary: '#ffa751', secondary: '#ffe259', accent: '#f5576c' }
  };

  const applyPreset = (preset) => {
    setColors(presets[preset]);
    updateCustomColors(presets[preset]);
  };

  return (
    <>
      <button className="theme-customizer-toggle" onClick={() => setIsOpen(!isOpen)}>
        🎨
      </button>

      {isOpen && (
        <div className="theme-customizer-panel">
          <div className="customizer-header">
            <h3>🎨 Personalizar Tema</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="customizer-content">
            <div className="preset-section">
              <h4>Presets</h4>
              <div className="preset-grid">
                {Object.keys(presets).map(preset => (
                  <button
                    key={preset}
                    className="preset-btn"
                    style={{ background: `linear-gradient(135deg, ${presets[preset].primary}, ${presets[preset].secondary})` }}
                    onClick={() => applyPreset(preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="color-pickers">
              <div className="color-input">
                <label>Color Primario</label>
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => {
                    const newColors = { ...colors, primary: e.target.value };
                    setColors(newColors);
                    updateCustomColors(newColors);
                  }}
                />
              </div>
              <div className="color-input">
                <label>Color Secundario</label>
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => {
                    const newColors = { ...colors, secondary: e.target.value };
                    setColors(newColors);
                    updateCustomColors(newColors);
                  }}
                />
              </div>
              <div className="color-input">
                <label>Color Acento</label>
                <input
                  type="color"
                  value={colors.accent}
                  onChange={(e) => {
                    const newColors = { ...colors, accent: e.target.value };
                    setColors(newColors);
                    updateCustomColors(newColors);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
