#!/usr/bin/env python3
"""
💳 Stripe Integration - Integración de Pagos Son1kVers3
Backend para procesamiento de pagos y suscripciones con Stripe
"""

from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
import stripe
import os
import json
from datetime import datetime, timedelta
from user_accounts import get_user_system
import logging

# Configurar Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_...')  # Placeholder
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', 'whsec_...')  # Placeholder

router = APIRouter(prefix="/api/stripe", tags=["stripe"])
user_system = get_user_system()

# Configuración de productos y precios
STRIPE_PRODUCTS = {
    'free': {
        'name': 'Son1kVers3 Free',
        'price_monthly': None,
        'price_yearly': None,
        'credits': 30
    },
    'pro': {
        'name': 'Son1kVers3 Pro',
        'price_monthly': 'price_pro_monthly',  # ID del precio en Stripe
        'price_yearly': 'price_pro_yearly',
        'credits': 500
    },
    'premium': {
        'name': 'Son1kVers3 Premium',
        'price_monthly': 'price_premium_monthly',
        'price_yearly': 'price_premium_yearly', 
        'credits': 2000
    },
    'enterprise': {
        'name': 'Son1kVers3 Enterprise',
        'price_monthly': 'price_enterprise_monthly',
        'price_yearly': 'price_enterprise_yearly',
        'credits': 10000
    },
    'starter_package': {
        'name': 'Son1kVers3 Starter Package',
        'price_one_time': 'price_starter_package',
        'credits': 7500
    }
}

def verify_user_token(request: Request):
    """Verificar token de usuario"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Token requerido")
    
    token = auth_header.split(' ')[1]
    token_result = user_system.verify_session_token(token)
    
    if not token_result['valid']:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    user = user_system.get_user_by_id(token_result['user_id'])
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return user

@router.post("/create-checkout-session")
async def create_checkout_session(request: Request, user = Depends(verify_user_token)):
    """Crear sesión de checkout para suscripción"""
    try:
        body = await request.json()
        plan_id = body.get('plan_id')
        billing_cycle = body.get('billing_cycle', 'monthly')
        success_url = body.get('success_url')
        cancel_url = body.get('cancel_url')
        
        if plan_id not in STRIPE_PRODUCTS:
            raise HTTPException(status_code=400, detail="Plan inválido")
        
        if plan_id == 'free':
            raise HTTPException(status_code=400, detail="Plan gratuito no requiere pago")
        
        product_config = STRIPE_PRODUCTS[plan_id]
        price_id = product_config[f'price_{billing_cycle}']
        
        # Crear o obtener customer en Stripe
        customer = await get_or_create_stripe_customer(user)
        
        # Crear sesión de checkout
        checkout_session = stripe.checkout.Session.create(
            customer=customer['id'],
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                'user_id': user['id'],
                'plan_id': plan_id,
                'billing_cycle': billing_cycle
            },
            subscription_data={
                'metadata': {
                    'user_id': user['id'],
                    'plan_id': plan_id
                }
            }
        )
        
        return {'id': checkout_session.id, 'url': checkout_session.url}
        
    except Exception as e:
        logging.error(f"Error creando checkout session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-credits-checkout")
async def create_credits_checkout(request: Request, user = Depends(verify_user_token)):
    """Crear checkout para paquete de créditos"""
    try:
        body = await request.json()
        package_type = body.get('package_type', 'starter')
        success_url = body.get('success_url')
        cancel_url = body.get('cancel_url')
        
        if package_type not in STRIPE_PRODUCTS:
            raise HTTPException(status_code=400, detail="Paquete inválido")
        
        product_config = STRIPE_PRODUCTS[package_type]
        price_id = product_config['price_one_time']
        
        # Crear o obtener customer en Stripe
        customer = await get_or_create_stripe_customer(user)
        
        # Crear sesión de checkout para pago único
        checkout_session = stripe.checkout.Session.create(
            customer=customer['id'],
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='payment',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                'user_id': user['id'],
                'package_type': package_type,
                'credits': product_config['credits']
            }
        )
        
        return {'id': checkout_session.id, 'url': checkout_session.url}
        
    except Exception as e:
        logging.error(f"Error creando checkout de créditos: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/subscription")
async def get_current_subscription(user = Depends(verify_user_token)):
    """Obtener suscripción actual del usuario"""
    try:
        # Buscar customer en Stripe
        customers = stripe.Customer.list(email=user['email'], limit=1)
        
        if not customers.data:
            return {'subscription': None, 'status': 'no_subscription'}
        
        customer = customers.data[0]
        
        # Obtener suscripciones activas
        subscriptions = stripe.Subscription.list(
            customer=customer.id,
            status='active',
            limit=1
        )
        
        if not subscriptions.data:
            return {'subscription': None, 'status': 'no_active_subscription'}
        
        subscription = subscriptions.data[0]
        
        return {
            'subscription': {
                'id': subscription.id,
                'status': subscription.status,
                'current_period_start': subscription.current_period_start,
                'current_period_end': subscription.current_period_end,
                'plan': subscription.items.data[0].price.lookup_key,
                'amount': subscription.items.data[0].price.unit_amount / 100,
                'currency': subscription.items.data[0].price.currency,
                'interval': subscription.items.data[0].price.recurring.interval
            },
            'status': 'active'
        }
        
    except Exception as e:
        logging.error(f"Error obteniendo suscripción: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cancel-subscription")
async def cancel_subscription(user = Depends(verify_user_token)):
    """Cancelar suscripción del usuario"""
    try:
        # Buscar suscripción activa
        customers = stripe.Customer.list(email=user['email'], limit=1)
        
        if not customers.data:
            raise HTTPException(status_code=404, detail="Customer no encontrado")
        
        customer = customers.data[0]
        subscriptions = stripe.Subscription.list(
            customer=customer.id,
            status='active',
            limit=1
        )
        
        if not subscriptions.data:
            raise HTTPException(status_code=404, detail="No hay suscripción activa")
        
        subscription = subscriptions.data[0]
        
        # Cancelar al final del período actual
        updated_subscription = stripe.Subscription.modify(
            subscription.id,
            cancel_at_period_end=True
        )
        
        # Actualizar en base de datos local
        accounts = user_system.load_encrypted_accounts()
        for account in accounts:
            if account['id'] == user['id']:
                account['subscription']['status'] = 'canceling'
                account['subscription']['cancel_at_period_end'] = True
                account['subscription']['canceled_at'] = datetime.now().isoformat()
                break
        
        user_system.save_encrypted_accounts(accounts)
        
        return {
            'success': True,
            'message': 'Suscripción cancelada al final del período actual',
            'period_end': updated_subscription.current_period_end
        }
        
    except Exception as e:
        logging.error(f"Error cancelando suscripción: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Webhook de Stripe para actualizar estados de suscripción"""
    try:
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')
        
        # Verificar webhook
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
        
        # Procesar eventos
        if event['type'] == 'checkout.session.completed':
            await handle_checkout_completed(event['data']['object'])
        elif event['type'] == 'customer.subscription.created':
            await handle_subscription_created(event['data']['object'])
        elif event['type'] == 'customer.subscription.updated':
            await handle_subscription_updated(event['data']['object'])
        elif event['type'] == 'customer.subscription.deleted':
            await handle_subscription_deleted(event['data']['object'])
        elif event['type'] == 'invoice.payment_succeeded':
            await handle_payment_succeeded(event['data']['object'])
        elif event['type'] == 'invoice.payment_failed':
            await handle_payment_failed(event['data']['object'])
        
        return JSONResponse(content={'status': 'success'})
        
    except ValueError as e:
        logging.error(f"Error en webhook - payload inválido: {e}")
        raise HTTPException(status_code=400, detail="Payload inválido")
    except stripe.error.SignatureVerificationError as e:
        logging.error(f"Error en webhook - firma inválida: {e}")
        raise HTTPException(status_code=400, detail="Firma inválida")
    except Exception as e:
        logging.error(f"Error procesando webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def get_or_create_stripe_customer(user):
    """Crear o obtener customer en Stripe"""
    try:
        # Buscar customer existente
        customers = stripe.Customer.list(email=user['email'], limit=1)
        
        if customers.data:
            return customers.data[0]
        
        # Crear nuevo customer
        customer = stripe.Customer.create(
            email=user['email'],
            name=user['display_name'],
            metadata={
                'user_id': user['id'],
                'tier': user['tier'],
                'alvae_level': user['alvae_level']
            }
        )
        
        return customer
        
    except Exception as e:
        logging.error(f"Error con customer de Stripe: {e}")
        raise e

async def handle_checkout_completed(session):
    """Manejar checkout completado"""
    try:
        user_id = session['metadata']['user_id']
        
        if 'plan_id' in session['metadata']:
            # Es una suscripción
            plan_id = session['metadata']['plan_id']
            await activate_subscription(user_id, plan_id, session['subscription'])
        elif 'package_type' in session['metadata']:
            # Es un paquete de créditos
            credits = int(session['metadata']['credits'])
            await add_credits_to_user(user_id, credits)
        
        logging.info(f"Checkout completado para usuario {user_id}")
        
    except Exception as e:
        logging.error(f"Error manejando checkout completado: {e}")

async def activate_subscription(user_id, plan_id, stripe_subscription_id):
    """Activar suscripción en base de datos local"""
    try:
        accounts = user_system.load_encrypted_accounts()
        
        for account in accounts:
            if account['id'] == user_id:
                # Actualizar tier y suscripción
                account['tier'] = plan_id
                account['subscription']['plan'] = plan_id
                account['subscription']['status'] = 'active'
                account['subscription']['stripe_subscription_id'] = stripe_subscription_id
                account['subscription']['activated_at'] = datetime.now().isoformat()
                
                # Actualizar display name con símbolos ALVAE
                account['display_name'] = user_system.generate_alvae_nickname(
                    account['username'], 
                    plan_id
                )
                
                # Añadir créditos del plan
                product_config = STRIPE_PRODUCTS[plan_id]
                account['credits'] = account.get('credits', 0) + product_config['credits']
                
                break
        
        user_system.save_encrypted_accounts(accounts)
        logging.info(f"Suscripción {plan_id} activada para usuario {user_id}")
        
    except Exception as e:
        logging.error(f"Error activando suscripción: {e}")

async def add_credits_to_user(user_id, credits):
    """Añadir créditos a usuario"""
    try:
        accounts = user_system.load_encrypted_accounts()
        
        for account in accounts:
            if account['id'] == user_id:
                account['credits'] = account.get('credits', 0) + credits
                account['credits_purchased_at'] = datetime.now().isoformat()
                break
        
        user_system.save_encrypted_accounts(accounts)
        logging.info(f"Añadidos {credits} créditos a usuario {user_id}")
        
    except Exception as e:
        logging.error(f"Error añadiendo créditos: {e}")

async def handle_subscription_created(subscription):
    """Manejar suscripción creada"""
    try:
        user_id = subscription['metadata']['user_id']
        plan_id = subscription['metadata']['plan_id']
        
        await activate_subscription(user_id, plan_id, subscription['id'])
        
    except Exception as e:
        logging.error(f"Error manejando suscripción creada: {e}")

async def handle_subscription_updated(subscription):
    """Manejar suscripción actualizada"""
    try:
        user_id = subscription['metadata']['user_id']
        
        accounts = user_system.load_encrypted_accounts()
        
        for account in accounts:
            if account['id'] == user_id:
                account['subscription']['status'] = subscription['status']
                account['subscription']['current_period_end'] = subscription['current_period_end']
                break
        
        user_system.save_encrypted_accounts(accounts)
        
    except Exception as e:
        logging.error(f"Error manejando suscripción actualizada: {e}")

async def handle_subscription_deleted(subscription):
    """Manejar suscripción eliminada"""
    try:
        user_id = subscription['metadata']['user_id']
        
        accounts = user_system.load_encrypted_accounts()
        
        for account in accounts:
            if account['id'] == user_id:
                # Degradar a plan gratuito
                account['tier'] = 'free'
                account['subscription']['plan'] = 'free'
                account['subscription']['status'] = 'canceled'
                account['subscription']['canceled_at'] = datetime.now().isoformat()
                
                # Actualizar display name
                account['display_name'] = user_system.generate_alvae_nickname(
                    account['username'], 
                    'free'
                )
                
                break
        
        user_system.save_encrypted_accounts(accounts)
        
    except Exception as e:
        logging.error(f"Error manejando suscripción eliminada: {e}")

async def handle_payment_succeeded(invoice):
    """Manejar pago exitoso"""
    try:
        subscription_id = invoice['subscription']
        
        if subscription_id:
            subscription = stripe.Subscription.retrieve(subscription_id)
            user_id = subscription['metadata']['user_id']
            plan_id = subscription['metadata']['plan_id']
            
            # Renovar créditos mensuales
            await renew_monthly_credits(user_id, plan_id)
        
    except Exception as e:
        logging.error(f"Error manejando pago exitoso: {e}")

async def handle_payment_failed(invoice):
    """Manejar pago fallido"""
    try:
        subscription_id = invoice['subscription']
        
        if subscription_id:
            subscription = stripe.Subscription.retrieve(subscription_id)
            user_id = subscription['metadata']['user_id']
            
            # Marcar cuenta como pago pendiente
            accounts = user_system.load_encrypted_accounts()
            
            for account in accounts:
                if account['id'] == user_id:
                    account['subscription']['status'] = 'past_due'
                    account['subscription']['payment_failed_at'] = datetime.now().isoformat()
                    break
            
            user_system.save_encrypted_accounts(accounts)
        
    except Exception as e:
        logging.error(f"Error manejando pago fallido: {e}")

async def renew_monthly_credits(user_id, plan_id):
    """Renovar créditos mensuales"""
    try:
        accounts = user_system.load_encrypted_accounts()
        
        for account in accounts:
            if account['id'] == user_id:
                # Añadir créditos del plan
                product_config = STRIPE_PRODUCTS[plan_id]
                account['credits'] = account.get('credits', 0) + product_config['credits']
                account['credits_renewed_at'] = datetime.now().isoformat()
                break
        
        user_system.save_encrypted_accounts(accounts)
        
    except Exception as e:
        logging.error(f"Error renovando créditos: {e}")

@router.get("/prices")
async def get_stripe_prices():
    """Obtener precios actuales de Stripe"""
    try:
        prices = stripe.Price.list(active=True, limit=100)
        
        formatted_prices = {}
        for price in prices.data:
            if price.lookup_key:
                formatted_prices[price.lookup_key] = {
                    'id': price.id,
                    'amount': price.unit_amount / 100,
                    'currency': price.currency,
                    'interval': price.recurring.interval if price.recurring else 'one_time'
                }
        
        return formatted_prices
        
    except Exception as e:
        logging.error(f"Error obteniendo precios: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/customer")
async def create_or_get_customer(request: Request, user = Depends(verify_user_token)):
    """Crear o obtener customer en Stripe"""
    try:
        customer = await get_or_create_stripe_customer(user)
        return {
            'id': customer.id,
            'email': customer.email,
            'name': customer.name
        }
        
    except Exception as e:
        logging.error(f"Error con customer: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-payment")
async def verify_payment(request: Request, user = Depends(verify_user_token)):
    """Verificar pago después del checkout"""
    try:
        body = await request.json()
        session_id = body.get('session_id')
        
        session = stripe.checkout.Session.retrieve(session_id)
        
        if session.payment_status == 'paid':
            return {
                'success': True,
                'payment_status': session.payment_status,
                'customer_email': session.customer_details.email
            }
        else:
            return {
                'success': False,
                'payment_status': session.payment_status
            }
        
    except Exception as e:
        logging.error(f"Error verificando pago: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Función para crear productos y precios en Stripe (ejecutar una vez)
def setup_stripe_products():
    """Configurar productos y precios en Stripe"""
    products_to_create = [
        {
            'name': 'Son1kVers3 Pro',
            'description': 'Plan Pro con 500 créditos mensuales',
            'prices': [
                {'amount': 2499, 'interval': 'month', 'lookup_key': 'price_pro_monthly'},
                {'amount': 24999, 'interval': 'year', 'lookup_key': 'price_pro_yearly'}
            ]
        },
        {
            'name': 'Son1kVers3 Premium',
            'description': 'Plan Premium con 2,000 créditos mensuales',
            'prices': [
                {'amount': 4999, 'interval': 'month', 'lookup_key': 'price_premium_monthly'},
                {'amount': 49999, 'interval': 'year', 'lookup_key': 'price_premium_yearly'}
            ]
        },
        {
            'name': 'Son1kVers3 Enterprise',
            'description': 'Plan Enterprise con 10,000 créditos mensuales',
            'prices': [
                {'amount': 19999, 'interval': 'month', 'lookup_key': 'price_enterprise_monthly'},
                {'amount': 199999, 'interval': 'year', 'lookup_key': 'price_enterprise_yearly'}
            ]
        },
        {
            'name': 'Son1kVers3 Starter Package',
            'description': 'Paquete inicial de 7,500 créditos',
            'prices': [
                {'amount': 9999, 'interval': None, 'lookup_key': 'price_starter_package'}
            ]
        }
    ]
    
    for product_data in products_to_create:
        try:
            # Crear producto
            product = stripe.Product.create(
                name=product_data['name'],
                description=product_data['description'],
                metadata={'platform': 'son1kvers3'}
            )
            
            # Crear precios
            for price_data in product_data['prices']:
                price_params = {
                    'unit_amount': price_data['amount'],
                    'currency': 'usd',
                    'product': product.id,
                    'lookup_key': price_data['lookup_key']
                }
                
                if price_data['interval']:
                    price_params['recurring'] = {'interval': price_data['interval']}
                
                stripe.Price.create(**price_params)
            
            print(f"✅ Producto creado: {product_data['name']}")
            
        except Exception as e:
            print(f"❌ Error creando producto {product_data['name']}: {e}")

if __name__ == "__main__":
    print("💳 Configurando productos en Stripe...")
    setup_stripe_products()
    print("✅ Configuración de Stripe completada")
