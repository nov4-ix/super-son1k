#!/usr/bin/env python3
"""
📊 Monitoring & Analytics API Endpoints
Endpoints para sistema de monitoreo y analytics
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import logging
from monitoring_analytics_system import (
    metrics_dashboard,
    performance_alerts,
    structured_logger,
    automated_reports,
    health_check_system
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/monitoring", tags=["Monitoring & Analytics"])

# ============= MODELOS DE DATOS =============

class RecordMetricRequest(BaseModel):
    metric_name: str
    value: float
    tags: Optional[Dict[str, str]] = None

class AlertRuleRequest(BaseModel):
    metric: str
    condition: str
    threshold: float
    severity: str = "warning"
    message: Optional[str] = ""

class LogRequest(BaseModel):
    level: str
    message: str
    context: Optional[Dict[str, Any]] = None

class ReportTemplateRequest(BaseModel):
    template_name: str
    config: Dict[str, Any]

class ScheduleReportRequest(BaseModel):
    template_name: str
    schedule: str
    recipients: List[str]


# ============= METRICS ENDPOINTS =============

@router.post("/metrics/record")
async def record_metric(request: RecordMetricRequest):
    """Registrar métrica"""
    try:
        metrics_dashboard.record_metric(
            request.metric_name,
            request.value,
            request.tags
        )
        return {"success": True, "metric": request.metric_name}
    except Exception as e:
        logger.error(f"Error recording metric: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/metrics/counter/{counter_name}")
async def increment_counter(counter_name: str, amount: int = 1):
    """Incrementar contador"""
    try:
        metrics_dashboard.increment_counter(counter_name, amount)
        return {
            "success": True,
            "counter": counter_name,
            "value": metrics_dashboard.counters[counter_name]
        }
    except Exception as e:
        logger.error(f"Error incrementing counter: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/metrics/gauge/{gauge_name}")
async def set_gauge(gauge_name: str, value: float):
    """Establecer gauge"""
    try:
        metrics_dashboard.set_gauge(gauge_name, value)
        return {"success": True, "gauge": gauge_name, "value": value}
    except Exception as e:
        logger.error(f"Error setting gauge: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/metrics/histogram/{histogram_name}")
async def record_histogram(histogram_name: str, value: float):
    """Registrar valor en histograma"""
    try:
        metrics_dashboard.record_histogram(histogram_name, value)
        return {"success": True, "histogram": histogram_name}
    except Exception as e:
        logger.error(f"Error recording histogram: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics/stats/{metric_name}")
async def get_metric_stats(metric_name: str, time_window: int = 3600):
    """Obtener estadísticas de métrica"""
    try:
        stats = metrics_dashboard.get_metric_stats(metric_name, time_window)
        return {"success": True, "stats": stats}
    except Exception as e:
        logger.error(f"Error getting metric stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics/all")
async def get_all_metrics():
    """Obtener todas las métricas"""
    try:
        metrics = metrics_dashboard.get_all_metrics()
        return {"success": True, "metrics": metrics}
    except Exception as e:
        logger.error(f"Error getting all metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics/system")
async def get_system_metrics():
    """Obtener métricas del sistema"""
    try:
        system_metrics = metrics_dashboard.get_system_metrics()
        return {"success": True, "system": system_metrics}
    except Exception as e:
        logger.error(f"Error getting system metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============= ALERTS ENDPOINTS =============

@router.post("/alerts/add-rule")
async def add_alert_rule(request: AlertRuleRequest):
    """Agregar regla de alerta"""
    try:
        rule = {
            "metric": request.metric,
            "condition": request.condition,
            "threshold": request.threshold,
            "severity": request.severity,
            "message": request.message
        }
        result = performance_alerts.add_alert_rule(rule)
        return result
    except Exception as e:
        logger.error(f"Error adding alert rule: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/alerts/check")
async def check_alerts():
    """Verificar condiciones de alerta"""
    try:
        metrics = metrics_dashboard.get_all_metrics()
        system_metrics = metrics_dashboard.get_system_metrics()

        # Agregar métricas del sistema a las métricas generales
        metrics["gauges"]["cpu_percent"] = system_metrics["cpu"]["percent"]
        metrics["gauges"]["memory_percent"] = system_metrics["memory"]["percent"]
        metrics["gauges"]["disk_percent"] = system_metrics["disk"]["percent"]

        triggered_alerts = await performance_alerts.check_alerts(metrics)

        return {
            "success": True,
            "triggered_alerts": triggered_alerts,
            "count": len(triggered_alerts)
        }
    except Exception as e:
        logger.error(f"Error checking alerts: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alerts/active")
async def get_active_alerts():
    """Obtener alertas activas"""
    try:
        active_alerts = performance_alerts.get_active_alerts()
        return {
            "success": True,
            "alerts": active_alerts,
            "count": len(active_alerts)
        }
    except Exception as e:
        logger.error(f"Error getting active alerts: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/alerts/resolve/{alert_id}")
async def resolve_alert(alert_id: str):
    """Resolver alerta"""
    try:
        result = performance_alerts.resolve_alert(alert_id)
        return result
    except Exception as e:
        logger.error(f"Error resolving alert: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============= LOGGING ENDPOINTS =============

@router.post("/logs/log")
async def create_log(request: LogRequest):
    """Crear log estructurado"""
    try:
        log_entry = structured_logger.log(
            request.level,
            request.message,
            request.context
        )
        return {"success": True, "log": log_entry}
    except Exception as e:
        logger.error(f"Error creating log: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/logs/search")
async def search_logs(
    level: Optional[str] = None,
    message: Optional[str] = None,
    start_time: Optional[float] = None,
    end_time: Optional[float] = None,
    limit: int = 100
):
    """Buscar logs"""
    try:
        filters = {}
        if level:
            filters["level"] = level
        if message:
            filters["message"] = message
        if start_time:
            filters["start_time"] = start_time
        if end_time:
            filters["end_time"] = end_time

        logs = structured_logger.search_logs(filters, limit)
        return {
            "success": True,
            "logs": logs,
            "count": len(logs)
        }
    except Exception as e:
        logger.error(f"Error searching logs: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/logs/statistics")
async def get_log_statistics(time_window: int = 3600):
    """Obtener estadísticas de logs"""
    try:
        stats = structured_logger.get_log_statistics(time_window)
        return {"success": True, "statistics": stats}
    except Exception as e:
        logger.error(f"Error getting log statistics: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============= REPORTS ENDPOINTS =============

@router.post("/reports/create-template")
async def create_report_template(request: ReportTemplateRequest):
    """Crear plantilla de reporte"""
    try:
        result = automated_reports.create_report_template(
            request.template_name,
            request.config
        )
        return result
    except Exception as e:
        logger.error(f"Error creating report template: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports/generate/{template_name}")
async def generate_report(template_name: str, time_range: str = "24h"):
    """Generar reporte"""
    try:
        result = await automated_reports.generate_report(template_name, time_range)
        return result
    except Exception as e:
        logger.error(f"Error generating report: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reports/schedule")
async def schedule_report(request: ScheduleReportRequest):
    """Programar reporte automático"""
    try:
        result = automated_reports.schedule_report(
            request.template_name,
            request.schedule,
            request.recipients
        )
        return result
    except Exception as e:
        logger.error(f"Error scheduling report: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============= HEALTH CHECK ENDPOINTS =============

@router.get("/health")
async def run_health_checks():
    """Ejecutar health checks"""
    try:
        result = await health_check_system.run_health_checks()
        return result
    except Exception as e:
        logger.error(f"Error running health checks: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health/last-results")
async def get_last_health_results():
    """Obtener últimos resultados de health checks"""
    try:
        results = health_check_system.get_last_results()
        return {
            "success": True,
            "results": results
        }
    except Exception as e:
        logger.error(f"Error getting health results: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============= DASHBOARD ENDPOINT =============

@router.get("/dashboard")
async def get_dashboard_data():
    """Obtener datos completos del dashboard"""
    try:
        # Recopilar todos los datos
        metrics = metrics_dashboard.get_all_metrics()
        system_metrics = metrics_dashboard.get_system_metrics()
        active_alerts = performance_alerts.get_active_alerts()
        log_stats = structured_logger.get_log_statistics()
        health_results = health_check_system.get_last_results()

        return {
            "success": True,
            "dashboard": {
                "metrics": metrics,
                "system": system_metrics,
                "alerts": {
                    "active": active_alerts,
                    "count": len(active_alerts)
                },
                "logs": log_stats,
                "health": health_results,
                "timestamp": system_metrics["timestamp"]
            }
        }
    except Exception as e:
        logger.error(f"Error getting dashboard data: {e}")
        raise HTTPException(status_code=500, detail=str(e))
