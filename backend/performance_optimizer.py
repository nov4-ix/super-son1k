#!/usr/bin/env python3
"""
🚀 Performance Optimization System
Sistema avanzado de optimización de rendimiento para Son1kVers3
Incluye: cache inteligente, procesamiento paralelo, compresión de audio, lazy loading
"""

import asyncio
import hashlib
import json
import time
import redis
import pickle
from typing import Dict, List, Optional, Any, Callable
import logging
import functools
from concurrent.futures import ThreadPoolExecutor, as_completed
import gzip
import io
import base64

logger = logging.getLogger(__name__)

class PerformanceOptimizer:
    """Sistema completo de optimización de rendimiento"""

    def __init__(self, redis_url: str = "redis://localhost:6379", max_workers: int = 4):
        self.redis_client = redis.from_url(redis_url) if redis_url else None
        self.max_workers = max_workers
        self.executor = ThreadPoolExecutor(max_workers=max_workers)

        # Estadísticas de rendimiento
        self.cache_hits = 0
        self.cache_misses = 0
        self.parallel_tasks = 0
        self.compression_ratio = 0.0

        # Configuración de cache
        self.cache_ttl = {
            'ai_results': 3600,  # 1 hora
            'audio_files': 7200,  # 2 horas
            'user_data': 1800,   # 30 minutos
            'analytics': 900,    # 15 minutos
        }

    def _generate_cache_key(self, func_name: str, *args, **kwargs) -> str:
        """Genera una clave única para el cache basada en función y parámetros"""
        # Crear una representación única de los parámetros
        params_str = json.dumps({
            'args': args,
            'kwargs': kwargs
        }, sort_keys=True)

        # Crear hash de la representación
        params_hash = hashlib.sha256(params_str.encode()).hexdigest()[:16]

        return f"son1k:{func_name}:{params_hash}"

    async def get_cached_result(self, cache_key: str) -> Optional[Any]:
        """Obtiene resultado del cache si existe"""
        try:
            if not self.redis_client:
                return None

            cached_data = self.redis_client.get(cache_key)
            if cached_data:
                self.cache_hits += 1
                # Descomprimir si es necesario
                if isinstance(cached_data, bytes):
                    return pickle.loads(gzip.decompress(cached_data))
                return pickle.loads(cached_data)
            else:
                self.cache_misses += 1
                return None
        except Exception as e:
            logger.error(f"Error getting cached result: {e}")
            return None

    async def set_cached_result(self, cache_key: str, result: Any, ttl: int = None) -> None:
        """Guarda resultado en cache con compresión"""
        try:
            if not self.redis_client:
                return

            # Comprimir datos grandes
            pickled_data = pickle.dumps(result)

            if len(pickled_data) > 1000:  # Comprimir si > 1KB
                compressed_data = gzip.compress(pickled_data)
                self.redis_client.setex(cache_key, ttl or self.cache_ttl.get('ai_results', 3600), compressed_data)
            else:
                self.redis_client.setex(cache_key, ttl or self.cache_ttl.get('ai_results', 3600), pickled_data)

        except Exception as e:
            logger.error(f"Error setting cached result: {e}")

    def cache_ai_result(self, ttl_key: str = 'ai_results'):
        """Decorador para cachear resultados de IA"""
        def decorator(func):
            @functools.wraps(func)
            async def wrapper(*args, **kwargs):
                cache_key = self._generate_cache_key(func.__name__, *args, **kwargs)

                # Intentar obtener del cache primero
                cached_result = await self.get_cached_result(cache_key)
                if cached_result is not None:
                    logger.info(f"Cache hit for {func.__name__}")
                    return cached_result

                # Ejecutar función y cachear resultado
                result = await func(*args, **kwargs)
                await self.set_cached_result(cache_key, result, self.cache_ttl.get(ttl_key, 3600))

                return result
            return wrapper
        return decorator

    async def process_parallel(self, tasks: List[Callable], max_concurrent: int = None) -> List[Any]:
        """Procesa múltiples tareas en paralelo"""
        if not tasks:
            return []

        max_concurrent = max_concurrent or self.max_workers
        self.parallel_tasks += len(tasks)

        # Crear tareas asíncronas
        async_tasks = []
        semaphore = asyncio.Semaphore(max_concurrent)

        for task_func in tasks:
            async def task_wrapper():
                async with semaphore:
                    return await asyncio.get_event_loop().run_in_executor(
                        self.executor, task_func
                    )

            async_tasks.append(task_wrapper())

        # Ejecutar todas las tareas
        results = await asyncio.gather(*async_tasks, return_exceptions=True)

        # Manejar excepciones
        processed_results = []
        for result in results:
            if isinstance(result, Exception):
                logger.error(f"Error in parallel task: {result}")
                processed_results.append(None)
            else:
                processed_results.append(result)

        return processed_results

    def compress_audio_data(self, audio_data: bytes) -> bytes:
        """Comprime datos de audio usando múltiples algoritmos"""
        try:
            # Usar compresión gzip para audio
            compressed = gzip.compress(audio_data)

            # Calcular ratio de compresión
            original_size = len(audio_data)
            compressed_size = len(compressed)
            self.compression_ratio = (original_size - compressed_size) / original_size

            logger.info(f"Audio compressed: {original_size} -> {compressed_size} bytes ({self.compression_ratio*100:.1f}% reduction)")

            return compressed

        except Exception as e:
            logger.error(f"Error compressing audio: {e}")
            return audio_data

    def decompress_audio_data(self, compressed_data: bytes) -> bytes:
        """Descomprime datos de audio"""
        try:
            return gzip.decompress(compressed_data)
        except Exception as e:
            logger.error(f"Error decompressing audio: {e}")
            return compressed_data

    async def lazy_load_model(self, model_name: str, model_loader: Callable) -> Any:
        """Carga modelos de IA de forma lazy (solo cuando se necesitan)"""
        cache_key = f"model:{model_name}"

        # Verificar si modelo ya está cargado en cache
        cached_model = await self.get_cached_result(cache_key)
        if cached_model is not None:
            logger.info(f"Model {model_name} loaded from cache")
            return cached_model

        # Cargar modelo
        logger.info(f"Loading model {model_name}...")
        model = await asyncio.get_event_loop().run_in_executor(
            self.executor, model_loader
        )

        # Cachear modelo cargado
        await self.set_cached_result(cache_key, model, self.cache_ttl.get('user_data', 1800))

        return model

    def get_performance_stats(self) -> Dict[str, Any]:
        """Obtiene estadísticas de rendimiento"""
        total_requests = self.cache_hits + self.cache_misses
        hit_rate = (self.cache_hits / total_requests * 100) if total_requests > 0 else 0

        return {
            'cache_hits': self.cache_hits,
            'cache_misses': self.cache_misses,
            'hit_rate_percent': round(hit_rate, 2),
            'parallel_tasks_processed': self.parallel_tasks,
            'avg_compression_ratio': round(self.compression_ratio * 100, 2),
            'active_workers': self.max_workers
        }

    def optimize_database_query(self, query_func: Callable) -> Callable:
        """Optimiza consultas a base de datos con cache"""
        @functools.wraps(query_func)
        async def wrapper(*args, **kwargs):
            cache_key = self._generate_cache_key(query_func.__name__, *args, **kwargs)

            # Verificar cache primero
            cached_result = await self.get_cached_result(cache_key)
            if cached_result is not None:
                return cached_result

            # Ejecutar consulta
            result = await query_func(*args, **kwargs)

            # Cachear resultado (TTL más corto para datos dinámicos)
            await self.set_cached_result(cache_key, result, self.cache_ttl.get('user_data', 300))

            return result

        return wrapper

    async def batch_process_audio_files(self, audio_files: List[bytes], batch_size: int = 10) -> List[bytes]:
        """Procesa archivos de audio en lotes para optimizar memoria"""
        results = []

        for i in range(0, len(audio_files), batch_size):
            batch = audio_files[i:i + batch_size]

            # Procesar batch en paralelo
            batch_tasks = [
                self._process_single_audio_file(audio_data)
                for audio_data in batch
            ]

            batch_results = await self.process_parallel(batch_tasks)
            results.extend(batch_results)

        return results

    def _process_single_audio_file(self, audio_data: bytes) -> bytes:
        """Procesa un archivo de audio individual"""
        # Aquí iría el procesamiento específico de audio
        # Por ahora solo comprime
        return self.compress_audio_data(audio_data)

    async def __aenter__(self):
        """Context manager entry"""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.executor.shutdown(wait=True)

# Instancia global del optimizador
performance_optimizer = PerformanceOptimizer()

# Funciones de utilidad para usar en otros módulos
def optimize_ai_function(func: Callable) -> Callable:
    """Decorador simple para optimizar funciones de IA"""
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        return await performance_optimizer.cache_ai_result()(func)(*args, **kwargs)
    return wrapper

def parallel_process(func: Callable) -> Callable:
    """Decorador para ejecutar funciones en paralelo"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # Crear tarea para ejecutar en executor
        return asyncio.get_event_loop().run_in_executor(
            performance_optimizer.executor, func, *args, **kwargs
        )
    return wrapper
