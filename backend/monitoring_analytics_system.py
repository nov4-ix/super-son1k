#!/usr/bin/env python3
"""
📊 Monitoring & Analytics System
Sistema avanzado de monitoreo y analytics para Son1kVers3
Incluye: dashboard de métricas, alertas de rendimiento, logs estructurados, reportes automáticos
"""

import asyncio
import json
import time
import psutil
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from collections import defaultdict, deque
import statistics

logger = logging.getLogger(__name__)

class MetricsDashboard:
    """Dashboard de métricas en tiempo real"""

    def __init__(self):
        self.metrics = defaultdict(lambda: deque(maxlen=1000))
        self.counters = defaultdict(int)
        self.gauges = defaultdict(float)
        self.histograms = defaultdict(list)

    def record_metric(self, metric_name: str, value: float, tags: Dict[str, str] = None):
        """Registrar métrica"""
        metric_data = {
            "name": metric_name,
            "value": value,
            "timestamp": time.time(),
            "tags": tags or {}
        }

        self.metrics[metric_name].append(metric_data)

    def increment_counter(self, counter_name: str, amount: int = 1):
        """Incrementar contador"""
        self.counters[counter_name] += amount

    def set_gauge(self, gauge_name: str, value: float):
        """Establecer gauge"""
        self.gauges[gauge_name] = value

    def record_histogram(self, histogram_name: str, value: float):
        """Registrar valor en histograma"""
        self.histograms[histogram_name].append(value)

        # Mantener solo últimos 1000 valores
        if len(self.histograms[histogram_name]) > 1000:
            self.histograms[histogram_name] = self.histograms[histogram_name][-1000:]

    def get_metric_stats(self, metric_name: str, time_window: int = 3600) -> Dict:
        """Obtener estadísticas de métrica"""
        current_time = time.time()
        cutoff_time = current_time - time_window

        # Filtrar métricas en ventana de tiempo
        recent_metrics = [
            m for m in self.metrics[metric_name]
            if m["timestamp"] >= cutoff_time
        ]

        if not recent_metrics:
            return {
                "metric": metric_name,
                "count": 0,
                "min": 0,
                "max": 0,
                "avg": 0,
                "median": 0,
                "p95": 0,
                "p99": 0
            }

        values = [m["value"] for m in recent_metrics]

        return {
            "metric": metric_name,
            "count": len(values),
            "min": min(values),
            "max": max(values),
            "avg": statistics.mean(values),
            "median": statistics.median(values),
            "p95": self._percentile(values, 95),
            "p99": self._percentile(values, 99)
        }

    def _percentile(self, values: List[float], percentile: int) -> float:
        """Calcular percentil"""
        if not values:
            return 0
        sorted_values = sorted(values)
        index = int(len(sorted_values) * (percentile / 100))
        return sorted_values[min(index, len(sorted_values) - 1)]

    def get_all_metrics(self) -> Dict:
        """Obtener todas las métricas"""
        return {
            "counters": dict(self.counters),
            "gauges": dict(self.gauges),
            "metrics": {
                name: self.get_metric_stats(name)
                for name in self.metrics.keys()
            }
        }

    def get_system_metrics(self) -> Dict:
        """Obtener métricas del sistema"""
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')

        return {
            "cpu": {
                "percent": cpu_percent,
                "count": psutil.cpu_count()
            },
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "percent": memory.percent,
                "used": memory.used
            },
            "disk": {
                "total": disk.total,
                "used": disk.used,
                "free": disk.free,
                "percent": disk.percent
            },
            "timestamp": time.time()
        }


class PerformanceAlerts:
    """Sistema de alertas de rendimiento"""

    def __init__(self):
        self.alert_rules = []
        self.active_alerts = []
        self.alert_history = deque(maxlen=1000)
        self.notification_channels = []

    def add_alert_rule(self, rule: Dict):
        """Agregar regla de alerta"""
        rule_id = f"rule_{len(self.alert_rules)}"
        rule["id"] = rule_id
        rule["created_at"] = time.time()
        rule["enabled"] = True

        self.alert_rules.append(rule)

        return {"success": True, "rule_id": rule_id, "rule": rule}

    async def check_alerts(self, metrics: Dict):
        """Verificar condiciones de alerta"""
        triggered_alerts = []

        for rule in self.alert_rules:
            if not rule.get("enabled"):
                continue

            metric_name = rule.get("metric")
            condition = rule.get("condition")
            threshold = rule.get("threshold")

            # Obtener valor de métrica
            metric_value = self._get_metric_value(metrics, metric_name)

            # Evaluar condición
            if self._evaluate_condition(metric_value, condition, threshold):
                alert = {
                    "id": f"alert_{int(time.time() * 1000)}",
                    "rule_id": rule["id"],
                    "metric": metric_name,
                    "value": metric_value,
                    "threshold": threshold,
                    "condition": condition,
                    "severity": rule.get("severity", "warning"),
                    "message": rule.get("message", f"{metric_name} {condition} {threshold}"),
                    "triggered_at": time.time()
                }

                triggered_alerts.append(alert)
                self.active_alerts.append(alert)
                self.alert_history.append(alert)

                # Enviar notificaciones
                await self._send_alert_notifications(alert)

        return triggered_alerts

    def _get_metric_value(self, metrics: Dict, metric_name: str) -> float:
        """Obtener valor de métrica"""
        # Buscar en diferentes tipos de métricas
        if metric_name in metrics.get("gauges", {}):
            return metrics["gauges"][metric_name]
        elif metric_name in metrics.get("counters", {}):
            return metrics["counters"][metric_name]
        elif metric_name in metrics.get("metrics", {}):
            return metrics["metrics"][metric_name].get("avg", 0)
        return 0

    def _evaluate_condition(self, value: float, condition: str, threshold: float) -> bool:
        """Evaluar condición de alerta"""
        conditions = {
            ">": lambda v, t: v > t,
            ">=": lambda v, t: v >= t,
            "<": lambda v, t: v < t,
            "<=": lambda v, t: v <= t,
            "==": lambda v, t: v == t,
            "!=": lambda v, t: v != t
        }

        condition_func = conditions.get(condition)
        if condition_func:
            return condition_func(value, threshold)
        return False

    async def _send_alert_notifications(self, alert: Dict):
        """Enviar notificaciones de alerta"""
        for channel in self.notification_channels:
            try:
                await channel.send(alert)
            except Exception as e:
                logger.error(f"Error sending alert notification: {e}")

    def add_notification_channel(self, channel):
        """Agregar canal de notificación"""
        self.notification_channels.append(channel)

    def get_active_alerts(self) -> List[Dict]:
        """Obtener alertas activas"""
        return self.active_alerts

    def resolve_alert(self, alert_id: str):
        """Resolver alerta"""
        self.active_alerts = [
            a for a in self.active_alerts
            if a["id"] != alert_id
        ]

        return {"success": True, "alert_id": alert_id, "status": "resolved"}


class StructuredLogger:
    """Sistema de logs estructurados"""

    def __init__(self):
        self.logs = deque(maxlen=10000)
        self.log_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]

    def log(self, level: str, message: str, context: Dict = None, **kwargs):
        """Registrar log estructurado"""
        log_entry = {
            "timestamp": time.time(),
            "datetime": datetime.now().isoformat(),
            "level": level.upper(),
            "message": message,
            "context": context or {},
            "extra": kwargs
        }

        self.logs.append(log_entry)

        # También registrar en logger estándar
        logger_func = getattr(logger, level.lower(), logger.info)
        logger_func(f"{message} | Context: {json.dumps(context or {})}")

        return log_entry

    def debug(self, message: str, **kwargs):
        """Log debug"""
        return self.log("DEBUG", message, **kwargs)

    def info(self, message: str, **kwargs):
        """Log info"""
        return self.log("INFO", message, **kwargs)

    def warning(self, message: str, **kwargs):
        """Log warning"""
        return self.log("WARNING", message, **kwargs)

    def error(self, message: str, **kwargs):
        """Log error"""
        return self.log("ERROR", message, **kwargs)

    def critical(self, message: str, **kwargs):
        """Log critical"""
        return self.log("CRITICAL", message, **kwargs)

    def search_logs(self, filters: Dict, limit: int = 100) -> List[Dict]:
        """Buscar logs con filtros"""
        filtered_logs = []

        for log in reversed(self.logs):
            # Filtrar por nivel
            if "level" in filters and log["level"] != filters["level"].upper():
                continue

            # Filtrar por mensaje
            if "message" in filters and filters["message"].lower() not in log["message"].lower():
                continue

            # Filtrar por rango de tiempo
            if "start_time" in filters and log["timestamp"] < filters["start_time"]:
                continue

            if "end_time" in filters and log["timestamp"] > filters["end_time"]:
                continue

            filtered_logs.append(log)

            if len(filtered_logs) >= limit:
                break

        return filtered_logs

    def get_log_statistics(self, time_window: int = 3600) -> Dict:
        """Obtener estadísticas de logs"""
        current_time = time.time()
        cutoff_time = current_time - time_window

        recent_logs = [
            log for log in self.logs
            if log["timestamp"] >= cutoff_time
        ]

        level_counts = defaultdict(int)
        for log in recent_logs:
            level_counts[log["level"]] += 1

        return {
            "total_logs": len(recent_logs),
            "by_level": dict(level_counts),
            "time_window_seconds": time_window,
            "error_rate": level_counts.get("ERROR", 0) / max(len(recent_logs), 1)
        }


class AutomatedReports:
    """Sistema de reportes automáticos"""

    def __init__(self, metrics_dashboard: MetricsDashboard, structured_logger: StructuredLogger):
        self.metrics_dashboard = metrics_dashboard
        self.structured_logger = structured_logger
        self.report_templates = {}
        self.scheduled_reports = []

    def create_report_template(self, template_name: str, config: Dict):
        """Crear plantilla de reporte"""
        self.report_templates[template_name] = {
            "name": template_name,
            "config": config,
            "created_at": time.time()
        }

        return {"success": True, "template": template_name}

    async def generate_report(self, template_name: str, time_range: str = "24h") -> Dict:
        """Generar reporte"""
        template = self.report_templates.get(template_name)

        if not template:
            return {"success": False, "error": "Plantilla no encontrada"}

        # Obtener datos según el rango de tiempo
        time_window = self._parse_time_range(time_range)

        # Recopilar métricas
        metrics = self.metrics_dashboard.get_all_metrics()
        system_metrics = self.metrics_dashboard.get_system_metrics()
        log_stats = self.structured_logger.get_log_statistics(time_window)

        # Generar reporte
        report = {
            "template": template_name,
            "generated_at": datetime.now().isoformat(),
            "time_range": time_range,
            "summary": {
                "total_requests": metrics["counters"].get("total_requests", 0),
                "total_errors": metrics["counters"].get("total_errors", 0),
                "error_rate": log_stats.get("error_rate", 0),
                "avg_response_time": metrics["metrics"].get("response_time", {}).get("avg", 0)
            },
            "system_health": {
                "cpu_usage": system_metrics["cpu"]["percent"],
                "memory_usage": system_metrics["memory"]["percent"],
                "disk_usage": system_metrics["disk"]["percent"]
            },
            "metrics": metrics,
            "logs": log_stats,
            "recommendations": self._generate_recommendations(metrics, system_metrics, log_stats)
        }

        return {"success": True, "report": report}

    def _parse_time_range(self, time_range: str) -> int:
        """Parsear rango de tiempo a segundos"""
        ranges = {
            "1h": 3600,
            "24h": 86400,
            "7d": 604800,
            "30d": 2592000
        }
        return ranges.get(time_range, 86400)

    def _generate_recommendations(self, metrics: Dict, system_metrics: Dict, log_stats: Dict) -> List[str]:
        """Generar recomendaciones basadas en métricas"""
        recommendations = []

        # CPU alto
        if system_metrics["cpu"]["percent"] > 80:
            recommendations.append("⚠️ Uso de CPU alto. Considera escalar horizontalmente.")

        # Memoria alta
        if system_metrics["memory"]["percent"] > 85:
            recommendations.append("⚠️ Uso de memoria alto. Revisa posibles memory leaks.")

        # Tasa de error alta
        if log_stats.get("error_rate", 0) > 0.05:
            recommendations.append("⚠️ Tasa de error alta (>5%). Revisa logs de errores.")

        # Disco lleno
        if system_metrics["disk"]["percent"] > 90:
            recommendations.append("🚨 Espacio en disco crítico. Limpia archivos temporales.")

        if not recommendations:
            recommendations.append("✅ Todos los sistemas operando normalmente.")

        return recommendations

    def schedule_report(self, template_name: str, schedule: str, recipients: List[str]):
        """Programar reporte automático"""
        scheduled_report = {
            "id": f"scheduled_{len(self.scheduled_reports)}",
            "template": template_name,
            "schedule": schedule,
            "recipients": recipients,
            "created_at": time.time(),
            "status": "active"
        }

        self.scheduled_reports.append(scheduled_report)

        return {"success": True, "scheduled_report": scheduled_report}

    async def send_report(self, report: Dict, recipients: List[str]):
        """Enviar reporte a destinatarios"""
        # Aquí se implementaría el envío por email, Slack, etc.
        logger.info(f"Enviando reporte a {len(recipients)} destinatarios")

        return {
            "success": True,
            "sent_to": recipients,
            "sent_at": time.time()
        }


class HealthCheckSystem:
    """Sistema de health checks"""

    def __init__(self):
        self.health_checks = {}
        self.last_check_results = {}

    def register_health_check(self, name: str, check_func: callable):
        """Registrar health check"""
        self.health_checks[name] = check_func

    async def run_health_checks(self) -> Dict:
        """Ejecutar todos los health checks"""
        results = {}
        overall_healthy = True

        for name, check_func in self.health_checks.items():
            try:
                result = await check_func()
                results[name] = {
                    "status": "healthy" if result else "unhealthy",
                    "checked_at": time.time()
                }

                if not result:
                    overall_healthy = False

            except Exception as e:
                results[name] = {
                    "status": "error",
                    "error": str(e),
                    "checked_at": time.time()
                }
                overall_healthy = False

        self.last_check_results = results

        return {
            "overall_status": "healthy" if overall_healthy else "unhealthy",
            "checks": results,
            "timestamp": time.time()
        }

    def get_last_results(self) -> Dict:
        """Obtener últimos resultados de health checks"""
        return self.last_check_results


# Instancias globales
metrics_dashboard = MetricsDashboard()
performance_alerts = PerformanceAlerts()
structured_logger = StructuredLogger()
automated_reports = AutomatedReports(metrics_dashboard, structured_logger)
health_check_system = HealthCheckSystem()

# Configurar alertas predeterminadas
performance_alerts.add_alert_rule({
    "metric": "cpu_percent",
    "condition": ">",
    "threshold": 90,
    "severity": "critical",
    "message": "Uso de CPU crítico"
})

performance_alerts.add_alert_rule({
    "metric": "memory_percent",
    "condition": ">",
    "threshold": 85,
    "severity": "warning",
    "message": "Uso de memoria alto"
})

performance_alerts.add_alert_rule({
    "metric": "error_rate",
    "condition": ">",
    "threshold": 0.05,
    "severity": "warning",
    "message": "Tasa de error elevada"
})
