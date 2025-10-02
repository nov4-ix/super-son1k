/**
 * 💳 Subscription Plans - Planes de Suscripción Son1kVers3
 * Componente para mostrar y gestionar planes de suscripción
 */

import React, { useState } from 'react';
import './SubscriptionPlans.css';
import StripeCheckout from './StripeCheckout';
import stripeService from '../services/StripeService';

const SubscriptionPlans = ({ currentUser, onPlanSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState(currentUser?.tier || 'free');
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, yearly
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [isCreditsCheckout, setIsCreditsCheckout] = useState(false);

  // Definición de planes con precios basados en análisis de costos
  const subscriptionPlans = {
    free: {
      name: 'Free',
      displayName: 'Tester / Free',
      symbol: '',
      price: { monthly: 0, yearly: 0 },
      credits: 30,
      description: 'Para probar el flujo esencial',
      color: '#888888',
      features: [
        '30 créditos incluidos (3 generaciones)',
        'Ghost Studio básico',
        'Duración máxima: 30 segundos',
        'Modelo Suno básico',
        'Archivo limitado (0.1GB)',
        'Soporte comunitario'
      ],
      limits: {
        generations_month: 3,
        track_duration: 30,
        voice_clones: 0,
        storage_gb: 0.1,
        models: ['suno_basic']
      },
      popular: false
    },
    pro: {
      name: 'Pro',
      displayName: 'Pro ◯',
      symbol: '◯',
      price: { monthly: 24.99, yearly: 249.99 },
      credits: 500,
      description: 'Para creadores regulares',
      color: '#00FFE7',
      features: [
        '500 créditos mensuales (50 generaciones)',
        'Ghost Studio completo',
        'Duración máxima: 2 minutos',
        'Modelos: Suno + Riffusion',
        'Clonación de voz (10 por mes)',
        'The Creator con Qwen',
        'Archivo: 5GB',
        'Soporte por email'
      ],
      limits: {
        generations_month: 50,
        track_duration: 120,
        voice_clones: 10,
        storage_gb: 5,
        models: ['suno', 'riffusion']
      },
      popular: false
    },
    premium: {
      name: 'Premium',
      displayName: '⚡ Premium',
      symbol: '⚡',
      price: { monthly: 49.99, yearly: 499.99 },
      credits: 2000,
      description: 'BETA TOTAL - Todo desbloqueado + Santuario',
      color: '#8b5cf6',
      features: [
        '2,000 créditos mensuales (200 generaciones)',
        'Modelos: Suno + Riffusion + Nuro',
        'Generaciones simultáneas: 50',
        'Modo Nexus completo',
        'Clonación de voz avanzada (50/mes)',
        'Knobs profesionales (SSL, saturación)',
        'Analytics avanzados',
        'Acceso al Santuario',
        'Historial 30 días',
        'Archivo: 25GB',
        'Derechos comerciales',
        'Soporte prioritario'
      ],
      limits: {
        generations_month: 200,
        track_duration: 300,
        voice_clones: 50,
        storage_gb: 25,
        models: ['suno', 'riffusion', 'nuro'],
        simultaneous: 50
      },
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      displayName: '◯⚡ Enterprise ◯⚡',
      symbol: '◯⚡',
      price: { monthly: 199.99, yearly: 1999.99 },
      credits: 10000,
      description: 'Para estudios profesionales y empresas',
      color: '#FFC107',
      features: [
        '10,000 créditos mensuales (1,000 generaciones)',
        'Todos los modelos + acceso anticipado',
        'Generaciones simultáneas: ilimitadas',
        'Entrenamiento personalizado de modelos',
        'API completa con documentación',
        'White label personalizable',
        'Soporte 24/7 prioritario',
        'Integración personalizada',
        'Dashboard de administración',
        'Múltiples usuarios (hasta 10)',
        'Archivo: 500GB',
        'Derechos comerciales extendidos',
        'SLA garantizado 99.9%'
      ],
      limits: {
        generations_month: -1, // Ilimitado
        track_duration: -1,   // Ilimitado
        voice_clones: -1,     // Ilimitado
        storage_gb: 500,
        models: ['all', 'early_access'],
        simultaneous: -1
      },
      popular: false
    }
  };

  // Paquete inicial de créditos
  const starterPackage = {
    name: 'Starter Package',
    price: 99.99,
    credits: 7500,
    generations: 750,
    description: 'Paquete inicial para comenzar con potencia',
    features: [
      '7,500 créditos (750 generaciones)',
      'Historial de registro de 30 días',
      'Acceso al modelo Suno',
      'Acceso al modelo Riffusion', 
      'Acceso al modelo Nuro',
      '50 generaciones simultáneas a la vez',
      'Derechos de uso comercial de canciones',
      'Acceso anticipado a nuevas funciones',
      'Soporte prioritario'
    ],
    value: '92% de descuento vs pago por uso',
    oneTime: true
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    if (onPlanSelect) {
      onPlanSelect(planId, billingCycle);
    }
  };

  const handlePurchase = (planId) => {
    if (planId === 'free') {
      // Plan gratuito no requiere pago
      alert('El plan gratuito ya está activo. ¡Comienza a crear música!');
      return;
    }
    
    const plan = subscriptionPlans[planId];
    setCheckoutPlan(plan);
    setIsCreditsCheckout(false);
    setShowCheckout(true);
  };

  const handleCreditsPackage = () => {
    setCheckoutPlan(starterPackage);
    setIsCreditsCheckout(true);
    setShowCheckout(true);
  };

  const closeCheckout = () => {
    setShowCheckout(false);
    setCheckoutPlan(null);
    setIsCreditsCheckout(false);
  };

  const getDiscountPercentage = () => {
    return billingCycle === 'yearly' ? 17 : 0; // 17% descuento anual
  };

  const calculatePrice = (plan) => {
    const basePrice = plan.price[billingCycle];
    if (billingCycle === 'yearly') {
      return basePrice; // Ya tiene descuento aplicado
    }
    return basePrice;
  };

  return (
    <div className="subscription-plans">
      <div className="plans-header">
        <h2>💳 Planes de Acceso</h2>
        <p>Comienza gratis. Desbloquea la potencia total con Premium.</p>
        
        {/* Toggle de facturación */}
        <div className="billing-toggle">
          <button 
            className={`billing-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Mensual
          </button>
          <button 
            className={`billing-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('yearly')}
          >
            Anual
            <span className="discount-badge">-17%</span>
          </button>
        </div>
      </div>

      {/* Paquete inicial de créditos */}
      <div className="starter-package">
        <div className="package-header">
          <h3>🚀 Paquete de Inicio</h3>
          <p>Comienza con potencia desde el primer día</p>
        </div>
        
        <div className="package-card">
          <div className="package-price">
            <span className="package-amount">${starterPackage.price}</span>
            <span className="package-type">Pago único</span>
          </div>
          
          <div className="package-credits">
            <div className="credits-display">
              <span className="credits-amount">{starterPackage.credits.toLocaleString()}</span>
              <span className="credits-label">créditos</span>
            </div>
            <div className="generations-display">
              = {starterPackage.generations} generaciones
            </div>
          </div>
          
          <div className="package-features">
            <ul>
              {starterPackage.features.map((feature, index) => (
                <li key={index}>
                  <span className="feature-icon">⚡</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="package-value">
            <span className="value-badge">{starterPackage.value}</span>
          </div>
          
          <button 
            className="package-buy-btn"
            onClick={handleCreditsPackage}
          >
            🚀 Comprar Paquete Inicial
          </button>
        </div>
      </div>

      <div className="plans-grid">
        {Object.entries(subscriptionPlans).map(([planId, plan]) => (
          <div
            key={planId}
            className={`plan-card ${planId} ${selectedPlan === planId ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
            onClick={() => handlePlanSelect(planId)}
          >
            {plan.popular && (
              <div className="popular-badge">
                ⭐ MÁS POPULAR
              </div>
            )}
            
            <div className="plan-header" style={{ borderColor: plan.color }}>
              <h3 style={{ color: plan.color }}>
                {plan.displayName}
              </h3>
              <div className="plan-price">
                {plan.price.monthly === 0 ? (
                  <span className="price-free">GRATIS</span>
                ) : (
                  <>
                    <span className="price-amount" style={{ color: plan.color }}>
                      ${calculatePrice(plan)}
                    </span>
                    <span className="price-period">
                      /{billingCycle === 'monthly' ? 'mes' : 'año'}
                    </span>
                  </>
                )}
              </div>
              <p className="plan-description">{plan.description}</p>
            </div>

            <div className="plan-features">
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <span className="feature-icon" style={{ color: plan.color }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="plan-limits">
              <h4>📊 Límites</h4>
              <div className="limits-grid">
                <div className="limit-item">
                  <span className="limit-label">Pistas/mes:</span>
                  <span className="limit-value" style={{ color: plan.color }}>
                    {plan.limits.tracks_per_month === -1 ? '∞' : plan.limits.tracks_per_month}
                  </span>
                </div>
                <div className="limit-item">
                  <span className="limit-label">Duración:</span>
                  <span className="limit-value" style={{ color: plan.color }}>
                    {plan.limits.track_duration === -1 ? '∞' : `${plan.limits.track_duration}s`}
                  </span>
                </div>
                {plan.limits.voice_clones !== undefined && (
                  <div className="limit-item">
                    <span className="limit-label">Clones voz:</span>
                    <span className="limit-value" style={{ color: plan.color }}>
                      {plan.limits.voice_clones === -1 ? '∞' : plan.limits.voice_clones}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button 
              className={`plan-select-btn ${selectedPlan === planId ? 'selected' : ''}`}
              style={{ 
                backgroundColor: selectedPlan === planId ? plan.color : 'transparent',
                borderColor: plan.color,
                color: selectedPlan === planId ? '#000000' : plan.color
              }}
              onClick={() => handlePurchase(planId)}
            >
              {currentUser?.tier === planId ? 'Plan Actual' : 
               planId === 'free' ? 'Comenzar Gratis' : 'Suscribirse'}
            </button>
          </div>
        ))}
      </div>

      {/* Información adicional */}
      <div className="plans-info">
        <div className="info-section">
          <h3>🎵 Símbolos ALVAE</h3>
          <p>Tu nickname mostrará símbolos según tu plan:</p>
          <div className="symbols-guide">
            <div className="symbol-item">
              <span className="symbol-display">USUARIO</span>
              <span className="symbol-desc">Free - Sin símbolo</span>
            </div>
            <div className="symbol-item">
              <span className="symbol-display">USUARIO◯</span>
              <span className="symbol-desc">Pro - Círculo al final</span>
            </div>
            <div className="symbol-item">
              <span className="symbol-display">⚡USUARIO</span>
              <span className="symbol-desc">Premium - Rayo al inicio</span>
            </div>
            <div className="symbol-item">
              <span className="symbol-display">◯⚡USUARIO◯⚡</span>
              <span className="symbol-desc">Enterprise - Símbolos completos</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>🔐 Cuentas de Prueba</h3>
          <div className="test-accounts">
            <div className="account-group">
              <h4>👤 Administrador:</h4>
              <p><strong>Email:</strong> nov4-ix@son1kvers3.com</p>
              <p><strong>Usuario:</strong> ◯⚡NOV4-IX◯⚡</p>
            </div>
            <div className="account-group">
              <h4>🧪 Testers Disponibles:</h4>
              <p><strong>Pro:</strong> PIXEL◯, ECHO◯, FLUX◯</p>
              <p><strong>Premium:</strong> ⚡NOVA, ⚡GHOST, ⚡NOCTIS, ⚡SHADOW</p>
              <p><strong>Free:</strong> LIGHT, SPARK, VOID</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Stripe Checkout */}
      {showCheckout && checkoutPlan && (
        <StripeCheckout
          isOpen={showCheckout}
          onClose={closeCheckout}
          planId={isCreditsCheckout ? 'starter' : selectedPlan}
          billingCycle={billingCycle}
          isCreditsPackage={isCreditsCheckout}
          planDetails={checkoutPlan}
        />
      )}
    </div>
  );
};

export default SubscriptionPlans;
