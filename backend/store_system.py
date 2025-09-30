#!/usr/bin/env python3
"""
🛒 Store System - Sistema de Tienda de Son1kVers3
Sistema completo de e-commerce para productos y servicios musicales
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging
import json
import sqlite3
from datetime import datetime, timedelta
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Router para la tienda
store_router = APIRouter(prefix="/api/store", tags=["Store"])

# Enums
class ProductCategory(str, Enum):
    PLUGINS = "plugins"
    SOUNDS = "sounds"
    TEMPLATES = "templates"
    SUBSCRIPTIONS = "subscriptions"
    CREDITS = "credits"
    MERCHANDISE = "merchandise"

class ProductStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    OUT_OF_STOCK = "out_of_stock"
    COMING_SOON = "coming_soon"

class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

# Models
class Product(BaseModel):
    id: str
    name: str
    description: str
    category: ProductCategory
    price: float
    currency: str = "USD"
    status: ProductStatus = ProductStatus.ACTIVE
    features: List[str] = []
    images: List[str] = []
    demo_url: Optional[str] = None
    download_url: Optional[str] = None
    system_requirements: Dict[str, Any] = {}
    tags: List[str] = []
    created_at: datetime
    updated_at: datetime

class CartItem(BaseModel):
    product_id: str
    quantity: int
    price: float

class ShoppingCart(BaseModel):
    user_id: str
    items: List[CartItem]
    total: float
    currency: str = "USD"
    created_at: datetime
    updated_at: datetime

class Order(BaseModel):
    id: str
    user_id: str
    items: List[CartItem]
    total: float
    currency: str = "USD"
    status: OrderStatus
    payment_method: str
    payment_id: Optional[str] = None
    shipping_address: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

class PurchaseRequest(BaseModel):
    product_id: str
    quantity: int = 1
    payment_method: str = "stripe"
    user_id: str

# Base de datos de productos
STORE_PRODUCTS = {
    "plugins": [
        Product(
            id="waves-bundle-pro",
            name="Waves Bundle Pro",
            description="Paquete completo de plugins de Waves para producción profesional",
            category=ProductCategory.PLUGINS,
            price=299.99,
            status=ProductStatus.ACTIVE,
            features=[
                "50+ plugins de Waves",
                "EQ, Compressor, Reverb, Delay",
                "Compatibilidad VST3, AU, AAX",
                "Actualizaciones gratuitas",
                "Soporte técnico 24/7"
            ],
            images=["/images/waves-bundle-pro.jpg"],
            demo_url="https://waves.com/bundles/pro",
            system_requirements={
                "os": ["Windows 10+", "macOS 10.14+"],
                "ram": "8GB",
                "storage": "2GB"
            },
            tags=["waves", "plugins", "bundle", "pro"],
            created_at=datetime.now(),
            updated_at=datetime.now()
        ),
        Product(
            id="nexus-2-expansion",
            name="Nexus 2 Expansion Pack",
            description="Expansión para Nexus 2 con sonidos cyberpunk y electrónicos",
            category=ProductCategory.SOUNDS,
            price=149.99,
            status=ProductStatus.ACTIVE,
            features=[
                "100+ presets cyberpunk",
                "Sonidos electrónicos únicos",
                "Compatible con Nexus 2",
                "Archivos WAV incluidos",
                "Documentación completa"
            ],
            images=["/images/nexus-2-expansion.jpg"],
            demo_url="https://son1kvers3.com/demo/nexus-2",
            system_requirements={
                "os": ["Windows 10+", "macOS 10.14+"],
                "ram": "4GB",
                "storage": "500MB"
            },
            tags=["nexus", "sounds", "cyberpunk", "electronic"],
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    ],
    "templates": [
        Product(
            id="cyberpunk-template-pack",
            name="Cyberpunk Template Pack",
            description="Plantillas de proyectos para música cyberpunk y synthwave",
            category=ProductCategory.TEMPLATES,
            price=79.99,
            status=ProductStatus.ACTIVE,
            features=[
                "20+ plantillas de proyectos",
                "Ableton Live, FL Studio, Logic Pro",
                "Pistas separadas por instrumento",
                "Efectos pre-configurados",
                "Tutoriales incluidos"
            ],
            images=["/images/cyberpunk-templates.jpg"],
            demo_url="https://son1kvers3.com/demo/templates",
            system_requirements={
                "daw": ["Ableton Live 11+", "FL Studio 20+", "Logic Pro X"],
                "ram": "8GB",
                "storage": "1GB"
            },
            tags=["templates", "cyberpunk", "synthwave", "daw"],
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    ],
    "subscriptions": [
        Product(
            id="pro-monthly",
            name="Son1kVers3 Pro - Mensual",
            description="Suscripción Pro mensual con acceso completo a todas las funciones",
            category=ProductCategory.SUBSCRIPTIONS,
            price=29.99,
            status=ProductStatus.ACTIVE,
            features=[
                "Generación musical ilimitada",
                "Clonación de voz avanzada",
                "Acceso a Nexus (modo inmersivo)",
                "Analytics avanzados",
                "Soporte prioritario"
            ],
            images=["/images/pro-subscription.jpg"],
            demo_url="https://son1kvers3.com/demo/pro",
            system_requirements={},
            tags=["subscription", "pro", "monthly"],
            created_at=datetime.now(),
            updated_at=datetime.now()
        ),
        Product(
            id="enterprise-yearly",
            name="Son1kVers3 Enterprise - Anual",
            description="Suscripción Enterprise anual con funciones empresariales",
            category=ProductCategory.SUBSCRIPTIONS,
            price=999.99,
            status=ProductStatus.ACTIVE,
            features=[
                "Todo lo de Pro",
                "API personalizada",
                "Integración empresarial",
                "Soporte dedicado",
                "Entrenamiento personalizado"
            ],
            images=["/images/enterprise-subscription.jpg"],
            demo_url="https://son1kvers3.com/demo/enterprise",
            system_requirements={},
            tags=["subscription", "enterprise", "yearly"],
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    ],
    "credits": [
        Product(
            id="credits-100",
            name="100 Créditos",
            description="100 créditos para generación musical y clonación de voz",
            category=ProductCategory.CREDITS,
            price=9.99,
            status=ProductStatus.ACTIVE,
            features=[
                "100 créditos de generación",
                "Sin expiración",
                "Uso flexible",
                "Aplicable a todas las funciones"
            ],
            images=["/images/credits-100.jpg"],
            system_requirements={},
            tags=["credits", "generation", "voice"],
            created_at=datetime.now(),
            updated_at=datetime.now()
        ),
        Product(
            id="credits-500",
            name="500 Créditos",
            description="500 créditos para generación musical y clonación de voz",
            category=ProductCategory.CREDITS,
            price=39.99,
            status=ProductStatus.ACTIVE,
            features=[
                "500 créditos de generación",
                "20% de descuento",
                "Sin expiración",
                "Aplicable a todas las funciones"
            ],
            images=["/images/credits-500.jpg"],
            system_requirements={},
            tags=["credits", "generation", "voice", "bulk"],
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    ],
    "merchandise": [
        Product(
            id="son1k-hoodie",
            name="Son1kVers3 Hoodie",
            description="Hoodie oficial de Son1kVers3 con diseño cyberpunk",
            category=ProductCategory.MERCHANDISE,
            price=49.99,
            status=ProductStatus.ACTIVE,
            features=[
                "Diseño cyberpunk exclusivo",
                "Tallas S, M, L, XL, XXL",
                "Material premium",
                "Envío mundial",
                "Garantía de calidad"
            ],
            images=["/images/son1k-hoodie.jpg"],
            system_requirements={},
            tags=["merchandise", "hoodie", "cyberpunk", "clothing"],
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    ]
}

# Base de datos SQLite para órdenes
def init_store_db():
    """Inicializar base de datos de la tienda"""
    conn = sqlite3.connect('store.db')
    cursor = conn.cursor()
    
    # Tabla de órdenes
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            items TEXT NOT NULL,  -- JSON
            total REAL NOT NULL,
            currency TEXT DEFAULT 'USD',
            status TEXT DEFAULT 'pending',
            payment_method TEXT NOT NULL,
            payment_id TEXT,
            shipping_address TEXT,  -- JSON
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabla de carritos de compras
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS shopping_carts (
            user_id TEXT PRIMARY KEY,
            items TEXT NOT NULL,  -- JSON
            total REAL NOT NULL,
            currency TEXT DEFAULT 'USD',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

# Inicializar base de datos
init_store_db()

# Endpoints
@store_router.get("/products")
async def get_products(
    category: Optional[ProductCategory] = None,
    status: Optional[ProductStatus] = None,
    limit: int = 50,
    offset: int = 0
):
    """Obtener productos de la tienda"""
    all_products = []
    
    for cat_products in STORE_PRODUCTS.values():
        all_products.extend(cat_products)
    
    # Filtrar por categoría
    if category:
        all_products = [p for p in all_products if p.category == category]
    
    # Filtrar por estado
    if status:
        all_products = [p for p in all_products if p.status == status]
    
    # Paginación
    total = len(all_products)
    products = all_products[offset:offset + limit]
    
    return {
        "products": products,
        "total": total,
        "limit": limit,
        "offset": offset,
        "has_more": offset + limit < total
    }

@store_router.get("/products/{product_id}")
async def get_product(product_id: str):
    """Obtener producto específico"""
    for cat_products in STORE_PRODUCTS.values():
        for product in cat_products:
            if product.id == product_id:
                return product
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Product not found"
    )

@store_router.get("/categories")
async def get_categories():
    """Obtener categorías de productos"""
    categories = []
    for category in ProductCategory:
        products = STORE_PRODUCTS.get(category.value, [])
        categories.append({
            "name": category.value,
            "display_name": category.value.replace("_", " ").title(),
            "product_count": len(products),
            "active_products": len([p for p in products if p.status == ProductStatus.ACTIVE])
        })
    
    return {"categories": categories}

@store_router.post("/cart/add")
async def add_to_cart(item: CartItem, user_id: str):
    """Agregar producto al carrito"""
    # Verificar que el producto existe
    product = None
    for cat_products in STORE_PRODUCTS.values():
        for p in cat_products:
            if p.id == item.product_id:
                product = p
                break
        if product:
            break
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    if product.status != ProductStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product not available"
        )
    
    # Actualizar carrito en base de datos
    conn = sqlite3.connect('store.db')
    cursor = conn.cursor()
    
    # Obtener carrito actual
    cursor.execute('SELECT items, total FROM shopping_carts WHERE user_id = ?', (user_id,))
    result = cursor.fetchone()
    
    if result:
        items = json.loads(result[0])
        total = result[1]
    else:
        items = []
        total = 0.0
    
    # Agregar item
    item_price = product.price * item.quantity
    items.append({
        "product_id": item.product_id,
        "quantity": item.quantity,
        "price": item_price
    })
    total += item_price
    
    # Guardar carrito
    cursor.execute('''
        INSERT OR REPLACE INTO shopping_carts (user_id, items, total, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ''', (user_id, json.dumps(items), total))
    
    conn.commit()
    conn.close()
    
    return {
        "message": "Item added to cart",
        "cart_total": total,
        "items_count": len(items)
    }

@store_router.get("/cart/{user_id}")
async def get_cart(user_id: str):
    """Obtener carrito de compras"""
    conn = sqlite3.connect('store.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT items, total FROM shopping_carts WHERE user_id = ?', (user_id,))
    result = cursor.fetchone()
    
    conn.close()
    
    if not result:
        return {
            "items": [],
            "total": 0.0,
            "currency": "USD"
        }
    
    return {
        "items": json.loads(result[0]),
        "total": result[1],
        "currency": "USD"
    }

@store_router.post("/purchase")
async def purchase_product(request: PurchaseRequest):
    """Comprar producto"""
    # Verificar que el producto existe
    product = None
    for cat_products in STORE_PRODUCTS.values():
        for p in cat_products:
            if p.id == request.product_id:
                product = p
                break
        if product:
            break
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    if product.status != ProductStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product not available"
        )
    
    # Crear orden
    order_id = f"order_{int(datetime.now().timestamp())}"
    total = product.price * request.quantity
    
    order = Order(
        id=order_id,
        user_id=request.user_id,
        items=[CartItem(
            product_id=request.product_id,
            quantity=request.quantity,
            price=product.price
        )],
        total=total,
        status=OrderStatus.PENDING,
        payment_method=request.payment_method,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    # Guardar orden en base de datos
    conn = sqlite3.connect('store.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO orders (id, user_id, items, total, status, payment_method, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        order.id,
        order.user_id,
        json.dumps([item.dict() for item in order.items]),
        order.total,
        order.status.value,
        order.payment_method,
        order.created_at,
        order.updated_at
    ))
    
    conn.commit()
    conn.close()
    
    return {
        "order_id": order_id,
        "status": "pending",
        "total": total,
        "payment_required": True,
        "payment_url": f"https://checkout.son1kvers3.com/{order_id}"
    }

@store_router.get("/orders/{user_id}")
async def get_user_orders(user_id: str):
    """Obtener órdenes del usuario"""
    conn = sqlite3.connect('store.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, items, total, status, created_at
        FROM orders 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    ''', (user_id,))
    
    results = cursor.fetchall()
    conn.close()
    
    orders = []
    for row in results:
        orders.append({
            "id": row[0],
            "items": json.loads(row[1]),
            "total": row[2],
            "status": row[3],
            "created_at": row[4]
        })
    
    return {"orders": orders}

@store_router.get("/health")
async def store_health_check():
    """Health check para el sistema de tienda"""
    return {
        "status": "healthy",
        "service": "Store System",
        "version": "1.0.0",
        "products_available": sum(len(products) for products in STORE_PRODUCTS.values()),
        "categories": len(STORE_PRODUCTS),
        "timestamp": datetime.now().isoformat()
    }
