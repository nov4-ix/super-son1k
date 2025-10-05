#!/usr/bin/env python3
"""
💰 Pricing Calculator - Calculadora de Precios Son1kVers3
Análisis de costos y definición de precios por tier
"""

class PricingCalculator:
    def __init__(self):
        # Costos base estimados
        self.costs = {
            # Costos de API por generación
            'suno_api': 0.10,      # $0.10 por generación
            'riffusion_api': 0.08,  # $0.08 por generación
            'nuro_api': 0.12,      # $0.12 por generación
            'qwen_api': 0.02,      # $0.02 por generación de letra
            'voice_clone': 0.15,   # $0.15 por clonación
            
            # Costos de infraestructura mensual
            'gpu_rental': 200,     # $200/mes GPU H100 compartida
            'storage_tb': 10,      # $10/TB/mes almacenamiento
            'bandwidth_tb': 5,     # $5/TB transferencia
            'database': 25,        # $25/mes base de datos
            'cdn': 15,             # $15/mes CDN
            'monitoring': 20,      # $20/mes monitoreo
            
            # Costos operativos
            'support': 500,        # $500/mes soporte
            'development': 2000,   # $2000/mes desarrollo
            'marketing': 1000,     # $1000/mes marketing
            'legal': 200,          # $200/mes legal/compliance
        }
        
        # Estimación de uso por tier
        self.usage_estimates = {
            'free': {
                'avg_generations_month': 3,
                'avg_voice_clones': 0,
                'storage_gb': 0.1,
                'bandwidth_gb': 0.5
            },
            'pro': {
                'avg_generations_month': 25,
                'avg_voice_clones': 5,
                'storage_gb': 2,
                'bandwidth_gb': 10
            },
            'premium': {
                'avg_generations_month': 80,
                'avg_voice_clones': 20,
                'storage_gb': 10,
                'bandwidth_gb': 50
            },
            'enterprise': {
                'avg_generations_month': 200,
                'avg_voice_clones': 100,
                'storage_gb': 50,
                'bandwidth_gb': 200
            }
        }
    
    def calculate_cost_per_user(self, tier):
        """Calcular costo por usuario por mes"""
        usage = self.usage_estimates[tier]
        
        # Costos directos por uso
        generation_cost = usage['avg_generations_month'] * self.costs['suno_api']
        voice_cost = usage['avg_voice_clones'] * self.costs['voice_clone']
        storage_cost = (usage['storage_gb'] / 1000) * self.costs['storage_tb']
        bandwidth_cost = (usage['bandwidth_gb'] / 1000) * self.costs['bandwidth_tb']
        
        direct_costs = generation_cost + voice_cost + storage_cost + bandwidth_cost
        
        # Costos fijos distribuidos (estimando 1000 usuarios activos)
        fixed_costs_per_user = (
            self.costs['gpu_rental'] + 
            self.costs['database'] + 
            self.costs['cdn'] + 
            self.costs['monitoring'] +
            self.costs['support'] + 
            self.costs['development'] + 
            self.costs['marketing'] + 
            self.costs['legal']
        ) / 1000
        
        total_cost = direct_costs + fixed_costs_per_user
        
        return {
            'direct_costs': direct_costs,
            'fixed_costs': fixed_costs_per_user,
            'total_cost': total_cost,
            'breakdown': {
                'generation': generation_cost,
                'voice_cloning': voice_cost,
                'storage': storage_cost,
                'bandwidth': bandwidth_cost,
                'infrastructure': fixed_costs_per_user
            }
        }
    
    def suggest_pricing(self):
        """Sugerir precios basados en costos + margen"""
        pricing_suggestions = {}
        
        for tier in ['free', 'pro', 'premium', 'enterprise']:
            cost_analysis = self.calculate_cost_per_user(tier)
            total_cost = cost_analysis['total_cost']
            
            if tier == 'free':
                # Free tier: subsidiado por otros planes
                suggested_price = 0
                margin = -100  # Pérdida controlada para adquisición
            else:
                # Aplicar margen según tier
                margins = {'pro': 3, 'premium': 4, 'enterprise': 5}  # 3x, 4x, 5x margen
                margin_multiplier = margins[tier]
                suggested_price = total_cost * margin_multiplier
                margin = ((suggested_price - total_cost) / total_cost) * 100
            
            pricing_suggestions[tier] = {
                'suggested_price': round(suggested_price, 2),
                'cost_per_user': round(total_cost, 2),
                'margin_percent': round(margin, 1),
                'cost_breakdown': cost_analysis['breakdown']
            }
        
        return pricing_suggestions
    
    def get_credit_package_value(self):
        """Calcular valor del paquete inicial de créditos"""
        package = {
            'credits': 7500,
            'generations': 750,  # 7500/10 créditos por generación
            'models': ['Suno', 'Riffusion', 'Nuro'],
            'features': [
                '750 generaciones incluidas',
                'Historial de 30 días',
                'Acceso a 3 modelos de IA',
                '50 generaciones simultáneas',
                'Derechos comerciales',
                'Acceso anticipado',
                'Soporte prioritario'
            ],
            'estimated_cost': 750 * 0.10,  # 750 generaciones * $0.10
            'suggested_price': 99.99,  # Precio inicial competitivo
            'value_proposition': '92% de descuento vs pago por uso'
        }
        
        return package

# Crear instancia y calcular precios
calculator = PricingCalculator()
pricing = calculator.suggest_pricing()
credit_package = calculator.get_credit_package_value()

def get_recommended_pricing():
    """Obtener precios recomendados finales"""
    return {
        'free': {
            'price': 0,
            'credits_included': 30,  # 3 generaciones
            'description': 'Para probar la plataforma',
            'limits': {
                'generations_month': 3,
                'track_duration': 30,
                'voice_clones': 0,
                'storage_gb': 0.1,
                'support': 'community'
            }
        },
        'pro': {
            'price': 24.99,  # Ajustado considerando costos
            'credits_included': 500,  # 50 generaciones
            'description': 'Para creadores regulares',
            'limits': {
                'generations_month': 50,
                'track_duration': 120,
                'voice_clones': 10,
                'storage_gb': 5,
                'support': 'email'
            }
        },
        'premium': {
            'price': 49.99,  # Precio competitivo
            'credits_included': 2000,  # 200 generaciones
            'description': 'Todo desbloqueado + Nexus',
            'limits': {
                'generations_month': 200,
                'track_duration': 300,
                'voice_clones': 50,
                'storage_gb': 25,
                'support': 'priority'
            }
        },
        'enterprise': {
            'price': 199.99,  # Precio premium pero justificado
            'credits_included': 10000,  # 1000 generaciones
            'description': 'Para estudios y empresas',
            'limits': {
                'generations_month': -1,  # Ilimitado
                'track_duration': -1,     # Ilimitado
                'voice_clones': -1,       # Ilimitado
                'storage_gb': 500,        # 500GB
                'support': '24/7'
            }
        },
        'starter_package': credit_package
    }

if __name__ == "__main__":
    print("💰 ANÁLISIS DE PRECIOS SON1KVERS3")
    print("=" * 50)
    
    print("\n📊 COSTOS ESTIMADOS POR USUARIO:")
    for tier, analysis in pricing.items():
        print(f"\n{tier.upper()}:")
        print(f"  Costo: ${analysis['cost_per_user']:.2f}/mes")
        print(f"  Precio sugerido: ${analysis['suggested_price']:.2f}/mes")
        print(f"  Margen: {analysis['margin_percent']:.1f}%")
    
    print(f"\n💳 PAQUETE INICIAL DE CRÉDITOS:")
    print(f"  Créditos: {credit_package['credits']:,}")
    print(f"  Generaciones: {credit_package['generations']}")
    print(f"  Costo estimado: ${credit_package['estimated_cost']:.2f}")
    print(f"  Precio sugerido: ${credit_package['suggested_price']:.2f}")
    print(f"  Ahorro: {credit_package['value_proposition']}")
    
    print(f"\n🎯 PRECIOS RECOMENDADOS FINALES:")
    final_pricing = get_recommended_pricing()
    for tier, config in final_pricing.items():
        if tier != 'starter_package':
            print(f"  {tier.upper()}: ${config['price']:.2f}/mes ({config['credits_included']} créditos)")
