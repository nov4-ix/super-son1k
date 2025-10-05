/**
 * 💳 Stripe Checkout - Componente de Pago
 * Integración completa con Stripe para suscripciones y paquetes de créditos
 */

import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './StripeCheckout.css';
import stripeService from '../services/StripeService';

// Cargar Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_...');

const CheckoutForm = ({ planId, billingCycle, onSuccess, onError, isCreditsPackage = false }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      if (isCreditsPackage) {
        // Checkout para paquete de créditos
        await stripeService.createCreditsCheckout('starter');
      } else {
        // Checkout para suscripción
        await stripeService.createSubscriptionCheckout(planId, billingCycle);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error en checkout:', error);
      setPaymentError(error.message);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#ffffff',
                backgroundColor: 'transparent',
                '::placeholder': {
                  color: '#888888',
                },
              },
              invalid: {
                color: '#ff6b6b',
              },
            },
          }}
        />
      </div>
      
      {paymentError && (
        <div className="payment-error">
          ❌ {paymentError}
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className={`checkout-submit-btn ${isProcessing ? 'processing' : ''}`}
      >
        {isProcessing ? (
          <>
            <span className="spinner"></span>
            Procesando...
          </>
        ) : (
          <>
            💳 {isCreditsPackage ? 'Comprar Créditos' : 'Suscribirse'}
          </>
        )}
      </button>
    </form>
  );
};

const StripeCheckout = ({ 
  isOpen, 
  onClose, 
  planId, 
  billingCycle = 'monthly',
  isCreditsPackage = false,
  planDetails = null 
}) => {
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSuccess = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      onClose();
      window.location.reload(); // Recargar para actualizar estado del usuario
    }, 2000);
  };

  const handleError = (error) => {
    console.error('Checkout error:', error);
  };

  return (
    <div className="stripe-checkout-modal">
      <div className="checkout-overlay" onClick={onClose}></div>
      
      <div className="checkout-content">
        <button className="checkout-close" onClick={onClose}>✕</button>
        
        <div className="checkout-header">
          <h2>💳 Finalizar Compra</h2>
          {planDetails && (
            <div className="plan-summary">
              <h3>{planDetails.displayName}</h3>
              <div className="plan-price">
                {isCreditsPackage ? (
                  <>
                    <span className="price-amount">${planDetails.price}</span>
                    <span className="price-desc">Pago único - {planDetails.credits.toLocaleString()} créditos</span>
                  </>
                ) : (
                  <>
                    <span className="price-amount">${planDetails.price[billingCycle]}</span>
                    <span className="price-desc">
                      {billingCycle === 'monthly' ? 'por mes' : 'por año'} - {planDetails.credits} créditos
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {checkoutSuccess ? (
          <div className="checkout-success">
            <div className="success-animation">
              <div className="success-circle">
                <div className="success-check">✓</div>
              </div>
            </div>
            <h3>🎉 ¡Pago Exitoso!</h3>
            <p>
              {isCreditsPackage 
                ? 'Tus créditos han sido añadidos a tu cuenta'
                : 'Tu suscripción ha sido activada'
              }
            </p>
            <p className="success-redirect">Redirigiendo...</p>
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              planId={planId}
              billingCycle={billingCycle}
              onSuccess={handleSuccess}
              onError={handleError}
              isCreditsPackage={isCreditsPackage}
            />
          </Elements>
        )}

        <div className="checkout-security">
          <div className="security-badges">
            <span className="security-badge">🔒 SSL Seguro</span>
            <span className="security-badge">💳 Stripe Certificado</span>
            <span className="security-badge">🛡️ Datos Encriptados</span>
          </div>
          <p className="security-note">
            Tus datos de pago están protegidos por Stripe, líder mundial en seguridad de pagos.
            Son1kVers3 no almacena información de tarjetas de crédito.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;
