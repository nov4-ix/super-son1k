/**
 * 💳 Stripe Service - Procesamiento de Pagos Son1kVers3
 * Servicio para manejar suscripciones y pagos con Stripe
 */

import { loadStripe } from '@stripe/stripe-js';

class StripeService {
    constructor() {
        // Clave pública de Stripe (se debe configurar en variables de entorno)
        this.stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_...'; // Placeholder
        this.stripe = null;
        this.apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        
        this.init();
    }

    async init() {
        try {
            this.stripe = await loadStripe(this.stripePublicKey);
            console.log('💳 Stripe Service inicializado');
        } catch (error) {
            console.error('Error inicializando Stripe:', error);
        }
    }

    // Crear sesión de checkout para suscripción
    async createSubscriptionCheckout(planId, billingCycle = 'monthly') {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/stripe/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    plan_id: planId,
                    billing_cycle: billingCycle,
                    success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${window.location.origin}/planes`
                })
            });

            const session = await response.json();
            
            if (session.error) {
                throw new Error(session.error);
            }

            // Redirigir a Stripe Checkout
            const result = await this.stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

            return result;

        } catch (error) {
            console.error('Error creando checkout de suscripción:', error);
            throw error;
        }
    }

    // Crear checkout para paquete de créditos único
    async createCreditsCheckout(packageType = 'starter') {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/stripe/create-credits-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    package_type: packageType,
                    success_url: `${window.location.origin}/success?type=credits&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${window.location.origin}/planes`
                })
            });

            const session = await response.json();
            
            if (session.error) {
                throw new Error(session.error);
            }

            // Redirigir a Stripe Checkout
            const result = await this.stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

            return result;

        } catch (error) {
            console.error('Error creando checkout de créditos:', error);
            throw error;
        }
    }

    // Obtener información de suscripción actual
    async getCurrentSubscription() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/stripe/subscription`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error obteniendo suscripción:', error);
            return null;
        }
    }

    // Cancelar suscripción
    async cancelSubscription() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/stripe/cancel-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }

            return result;

        } catch (error) {
            console.error('Error cancelando suscripción:', error);
            throw error;
        }
    }

    // Actualizar método de pago
    async updatePaymentMethod() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/stripe/update-payment-method`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const session = await response.json();
            
            if (session.error) {
                throw new Error(session.error);
            }

            // Abrir portal de cliente de Stripe
            window.location.href = session.url;

        } catch (error) {
            console.error('Error actualizando método de pago:', error);
            throw error;
        }
    }

    // Obtener historial de facturación
    async getBillingHistory() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/stripe/billing-history`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error obteniendo historial de facturación:', error);
            return [];
        }
    }

    // Verificar estado de pago después del checkout
    async verifyPayment(sessionId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/stripe/verify-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    session_id: sessionId
                })
            });

            const result = await response.json();
            return result;

        } catch (error) {
            console.error('Error verificando pago:', error);
            throw error;
        }
    }

    // Obtener precios de Stripe (para mostrar en tiempo real)
    async getStripePrices() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/stripe/prices`);
            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error obteniendo precios de Stripe:', error);
            return null;
        }
    }

    // Crear customer en Stripe si no existe
    async createOrGetCustomer(userEmail, userName) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/stripe/customer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    email: userEmail,
                    name: userName
                })
            });

            const customer = await response.json();
            return customer;

        } catch (error) {
            console.error('Error creando/obteniendo customer:', error);
            throw error;
        }
    }
}

// Exportar instancia única
const stripeService = new StripeService();
export default stripeService;

// También exportar la clase para casos específicos
export { StripeService };
