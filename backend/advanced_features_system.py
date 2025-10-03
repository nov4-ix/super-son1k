#!/usr/bin/env python3
"""
🚀 Advanced Features System
Sistema de funcionalidades avanzadas para Son1kVers3
Incluye: colaboración en tiempo real, versionado de proyectos, marketplace, API pública
"""

import asyncio
import json
import time
import uuid
from typing import Dict, List, Optional, Any, Set
import logging
from datetime import datetime, timedelta
import hashlib
import redis
from collections import defaultdict

logger = logging.getLogger(__name__)

class CollaborationSystem:
    """Sistema de colaboración en tiempo real"""

    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_client = redis.from_url(redis_url) if redis_url else None
        self.active_sessions = {}
        self.user_cursors = defaultdict(dict)
        self.project_locks = defaultdict(set)

    async def create_collaboration_session(self, project_id: str, user_id: str, user_name: str) -> Dict:
        """Crear sesión de colaboración"""
        session_id = str(uuid.uuid4())

        session_data = {
            "session_id": session_id,
            "project_id": project_id,
            "owner_id": user_id,
            "owner_name": user_name,
            "created_at": time.time(),
            "active_users": [{"id": user_id, "name": user_name}],
            "status": "active"
        }

        self.active_sessions[session_id] = session_data

        # Guardar en Redis
        if self.redis_client:
            self.redis_client.setex(
                f"collab:session:{session_id}",
                3600,  # 1 hora
                json.dumps(session_data)
            )

        return {
            "success": True,
            "session": session_data,
            "invite_link": f"/collaborate/{session_id}"
        }

    async def join_collaboration_session(self, session_id: str, user_id: str, user_name: str) -> Dict:
        """Unirse a sesión de colaboración"""
        session = self.active_sessions.get(session_id)

        if not session:
            # Intentar cargar desde Redis
            if self.redis_client:
                session_data = self.redis_client.get(f"collab:session:{session_id}")
                if session_data:
                    session = json.loads(session_data)
                    self.active_sessions[session_id] = session

        if not session:
            return {"success": False, "error": "Sesión no encontrada"}

        # Agregar usuario a la sesión
        user_info = {"id": user_id, "name": user_name, "joined_at": time.time()}

        if user_info not in session["active_users"]:
            session["active_users"].append(user_info)

        # Actualizar en Redis
        if self.redis_client:
            self.redis_client.setex(
                f"collab:session:{session_id}",
                3600,
                json.dumps(session)
            )

        return {
            "success": True,
            "session": session,
            "message": f"{user_name} se unió a la sesión"
        }

    async def update_user_cursor(self, session_id: str, user_id: str, cursor_data: Dict) -> Dict:
        """Actualizar posición del cursor del usuario"""
        self.user_cursors[session_id][user_id] = {
            "x": cursor_data.get("x", 0),
            "y": cursor_data.get("y", 0),
            "timestamp": time.time()
        }

        return {
            "success": True,
            "cursors": self.user_cursors[session_id]
        }

    async def broadcast_change(self, session_id: str, user_id: str, change_data: Dict) -> Dict:
        """Transmitir cambio a todos los colaboradores"""
        change = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "user_id": user_id,
            "type": change_data.get("type"),
            "data": change_data.get("data"),
            "timestamp": time.time()
        }

        # Publicar en Redis para WebSocket
        if self.redis_client:
            self.redis_client.publish(
                f"collab:changes:{session_id}",
                json.dumps(change)
            )

        return {"success": True, "change": change}

    async def lock_element(self, session_id: str, user_id: str, element_id: str) -> Dict:
        """Bloquear elemento para edición exclusiva"""
        lock_key = f"{session_id}:{element_id}"

        if element_id in self.project_locks[session_id]:
            return {"success": False, "error": "Elemento ya bloqueado por otro usuario"}

        self.project_locks[session_id].add(element_id)

        return {
            "success": True,
            "locked_by": user_id,
            "element_id": element_id
        }

    async def unlock_element(self, session_id: str, element_id: str) -> Dict:
        """Desbloquear elemento"""
        if element_id in self.project_locks[session_id]:
            self.project_locks[session_id].remove(element_id)

        return {"success": True, "element_id": element_id}


class ProjectVersioningSystem:
    """Sistema de versionado de proyectos"""

    def __init__(self):
        self.versions = defaultdict(list)
        self.branches = defaultdict(dict)

    async def create_version(self, project_id: str, user_id: str, data: Dict, message: str = "") -> Dict:
        """Crear nueva versión del proyecto"""
        version_id = str(uuid.uuid4())

        # Calcular hash del contenido
        content_hash = hashlib.sha256(
            json.dumps(data, sort_keys=True).encode()
        ).hexdigest()[:16]

        version = {
            "version_id": version_id,
            "project_id": project_id,
            "version_number": len(self.versions[project_id]) + 1,
            "user_id": user_id,
            "data": data,
            "message": message,
            "content_hash": content_hash,
            "created_at": datetime.now().isoformat(),
            "timestamp": time.time()
        }

        self.versions[project_id].append(version)

        return {
            "success": True,
            "version": version,
            "version_number": version["version_number"]
        }

    async def get_version_history(self, project_id: str, limit: int = 50) -> Dict:
        """Obtener historial de versiones"""
        versions = self.versions.get(project_id, [])

        # Ordenar por timestamp descendente
        sorted_versions = sorted(
            versions,
            key=lambda v: v["timestamp"],
            reverse=True
        )[:limit]

        return {
            "success": True,
            "project_id": project_id,
            "versions": sorted_versions,
            "total_versions": len(versions)
        }

    async def restore_version(self, project_id: str, version_id: str) -> Dict:
        """Restaurar versión específica"""
        versions = self.versions.get(project_id, [])

        target_version = None
        for version in versions:
            if version["version_id"] == version_id:
                target_version = version
                break

        if not target_version:
            return {"success": False, "error": "Versión no encontrada"}

        # Crear nueva versión con los datos restaurados
        restored = await self.create_version(
            project_id,
            target_version["user_id"],
            target_version["data"],
            f"Restaurado desde versión {target_version['version_number']}"
        )

        return {
            "success": True,
            "restored_version": target_version,
            "new_version": restored["version"]
        }

    async def compare_versions(self, project_id: str, version_id_1: str, version_id_2: str) -> Dict:
        """Comparar dos versiones"""
        versions = self.versions.get(project_id, [])

        v1 = next((v for v in versions if v["version_id"] == version_id_1), None)
        v2 = next((v for v in versions if v["version_id"] == version_id_2), None)

        if not v1 or not v2:
            return {"success": False, "error": "Una o ambas versiones no encontradas"}

        # Calcular diferencias
        differences = self._calculate_differences(v1["data"], v2["data"])

        return {
            "success": True,
            "version_1": v1,
            "version_2": v2,
            "differences": differences
        }

    def _calculate_differences(self, data1: Dict, data2: Dict) -> List[Dict]:
        """Calcular diferencias entre dos versiones"""
        differences = []

        # Comparar claves
        keys1 = set(data1.keys())
        keys2 = set(data2.keys())

        # Claves agregadas
        for key in keys2 - keys1:
            differences.append({
                "type": "added",
                "key": key,
                "value": data2[key]
            })

        # Claves eliminadas
        for key in keys1 - keys2:
            differences.append({
                "type": "removed",
                "key": key,
                "value": data1[key]
            })

        # Claves modificadas
        for key in keys1 & keys2:
            if data1[key] != data2[key]:
                differences.append({
                    "type": "modified",
                    "key": key,
                    "old_value": data1[key],
                    "new_value": data2[key]
                })

        return differences

    async def create_branch(self, project_id: str, branch_name: str, from_version: str = None) -> Dict:
        """Crear rama de desarrollo"""
        branch_id = str(uuid.uuid4())

        branch = {
            "branch_id": branch_id,
            "branch_name": branch_name,
            "project_id": project_id,
            "from_version": from_version,
            "created_at": datetime.now().isoformat(),
            "status": "active"
        }

        self.branches[project_id][branch_id] = branch

        return {"success": True, "branch": branch}


class MarketplaceSystem:
    """Sistema de marketplace para modelos y efectos"""

    def __init__(self):
        self.items = {}
        self.categories = ["models", "effects", "presets", "templates", "voices"]
        self.user_purchases = defaultdict(list)

    async def list_item(self, seller_id: str, item_data: Dict) -> Dict:
        """Listar item en el marketplace"""
        item_id = str(uuid.uuid4())

        item = {
            "item_id": item_id,
            "seller_id": seller_id,
            "name": item_data.get("name"),
            "description": item_data.get("description"),
            "category": item_data.get("category"),
            "price": item_data.get("price", 0),
            "currency": item_data.get("currency", "USD"),
            "preview_url": item_data.get("preview_url"),
            "download_url": item_data.get("download_url"),
            "tags": item_data.get("tags", []),
            "rating": 0,
            "downloads": 0,
            "created_at": datetime.now().isoformat(),
            "status": "active"
        }

        self.items[item_id] = item

        return {"success": True, "item": item}

    async def search_marketplace(self, query: str = "", category: str = "", min_price: float = 0, max_price: float = float('inf')) -> Dict:
        """Buscar items en el marketplace"""
        results = []

        for item in self.items.values():
            # Filtrar por categoría
            if category and item["category"] != category:
                continue

            # Filtrar por precio
            if not (min_price <= item["price"] <= max_price):
                continue

            # Filtrar por query
            if query:
                query_lower = query.lower()
                if (query_lower not in item["name"].lower() and
                    query_lower not in item["description"].lower() and
                    not any(query_lower in tag.lower() for tag in item["tags"])):
                    continue

            results.append(item)

        # Ordenar por rating y descargas
        results.sort(key=lambda x: (x["rating"], x["downloads"]), reverse=True)

        return {
            "success": True,
            "results": results,
            "total": len(results)
        }

    async def purchase_item(self, user_id: str, item_id: str) -> Dict:
        """Comprar item del marketplace"""
        item = self.items.get(item_id)

        if not item:
            return {"success": False, "error": "Item no encontrado"}

        # Verificar si ya fue comprado
        if item_id in self.user_purchases[user_id]:
            return {"success": False, "error": "Ya compraste este item"}

        # Registrar compra
        purchase = {
            "purchase_id": str(uuid.uuid4()),
            "user_id": user_id,
            "item_id": item_id,
            "price": item["price"],
            "purchased_at": datetime.now().isoformat()
        }

        self.user_purchases[user_id].append(item_id)
        item["downloads"] += 1

        return {
            "success": True,
            "purchase": purchase,
            "download_url": item["download_url"]
        }

    async def rate_item(self, user_id: str, item_id: str, rating: int) -> Dict:
        """Calificar item"""
        item = self.items.get(item_id)

        if not item:
            return {"success": False, "error": "Item no encontrado"}

        if rating < 1 or rating > 5:
            return {"success": False, "error": "Rating debe estar entre 1 y 5"}

        # Actualizar rating (simplificado)
        current_rating = item.get("rating", 0)
        downloads = item.get("downloads", 1)

        new_rating = ((current_rating * downloads) + rating) / (downloads + 1)
        item["rating"] = round(new_rating, 2)

        return {
            "success": True,
            "item_id": item_id,
            "new_rating": item["rating"]
        }


class PublicAPISystem:
    """Sistema de API pública para desarrolladores"""

    def __init__(self):
        self.api_keys = {}
        self.rate_limits = defaultdict(lambda: {"count": 0, "reset_at": time.time() + 3600})
        self.usage_stats = defaultdict(lambda: {"requests": 0, "errors": 0})

    async def generate_api_key(self, user_id: str, app_name: str, tier: str = "free") -> Dict:
        """Generar API key para desarrollador"""
        api_key = f"sk_{uuid.uuid4().hex}"

        key_data = {
            "api_key": api_key,
            "user_id": user_id,
            "app_name": app_name,
            "tier": tier,
            "rate_limit": self._get_rate_limit_for_tier(tier),
            "created_at": datetime.now().isoformat(),
            "status": "active"
        }

        self.api_keys[api_key] = key_data

        return {"success": True, "api_key_data": key_data}

    def _get_rate_limit_for_tier(self, tier: str) -> int:
        """Obtener límite de requests según tier"""
        limits = {
            "free": 100,      # 100 requests/hora
            "basic": 1000,    # 1000 requests/hora
            "pro": 10000,     # 10000 requests/hora
            "enterprise": -1  # Sin límite
        }
        return limits.get(tier, 100)

    async def validate_api_key(self, api_key: str) -> Dict:
        """Validar API key"""
        key_data = self.api_keys.get(api_key)

        if not key_data:
            return {"valid": False, "error": "API key inválida"}

        if key_data["status"] != "active":
            return {"valid": False, "error": "API key inactiva"}

        # Verificar rate limit
        rate_limit_status = await self.check_rate_limit(api_key)

        if not rate_limit_status["allowed"]:
            return {"valid": False, "error": "Rate limit excedido"}

        return {"valid": True, "key_data": key_data}

    async def check_rate_limit(self, api_key: str) -> Dict:
        """Verificar rate limit"""
        key_data = self.api_keys.get(api_key)

        if not key_data:
            return {"allowed": False, "error": "API key no encontrada"}

        tier_limit = key_data["rate_limit"]

        if tier_limit == -1:  # Sin límite
            return {"allowed": True, "remaining": -1}

        current_time = time.time()
        rate_data = self.rate_limits[api_key]

        # Resetear contador si pasó la hora
        if current_time >= rate_data["reset_at"]:
            rate_data["count"] = 0
            rate_data["reset_at"] = current_time + 3600

        # Verificar límite
        if rate_data["count"] >= tier_limit:
            return {
                "allowed": False,
                "remaining": 0,
                "reset_at": rate_data["reset_at"]
            }

        # Incrementar contador
        rate_data["count"] += 1

        return {
            "allowed": True,
            "remaining": tier_limit - rate_data["count"],
            "reset_at": rate_data["reset_at"]
        }

    async def get_usage_stats(self, api_key: str) -> Dict:
        """Obtener estadísticas de uso"""
        stats = self.usage_stats[api_key]

        return {
            "success": True,
            "stats": {
                "total_requests": stats["requests"],
                "total_errors": stats["errors"],
                "error_rate": (stats["errors"] / stats["requests"] * 100) if stats["requests"] > 0 else 0
            }
        }


# Instancias globales
collaboration_system = CollaborationSystem()
versioning_system = ProjectVersioningSystem()
marketplace_system = MarketplaceSystem()
api_system = PublicAPISystem()
