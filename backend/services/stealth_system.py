#!/usr/bin/env python3
"""
🔒 Stealth System - Sistema Stealth con Múltiples Cuentas
Sistema para rotación de cuentas y evasión de detección
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import asyncio
import random
import time
import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import httpx
import hashlib
import secrets

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Stealth System API", version="1.0.0")
security = HTTPBearer()

# Configuration
ACCOUNTS_DB = "accounts.json"
ROTATION_INTERVAL = 300  # 5 minutes
MAX_REQUESTS_PER_ACCOUNT = 100
COOLDOWN_PERIOD = 3600  # 1 hour

# Models
class AccountInfo(BaseModel):
    account_id: str
    username: str
    email: str
    password: str
    cookies: Dict[str, Any]
    last_used: Optional[datetime] = None
    request_count: int = 0
    is_active: bool = True
    tier: str = "free"
    user_agent: str = ""
    proxy: Optional[str] = None

class StealthRequest(BaseModel):
    action: str
    target_url: str
    payload: Optional[Dict[str, Any]] = None
    priority: str = "normal"
    use_proxy: bool = True
    rotate_account: bool = True

class StealthResponse(BaseModel):
    success: bool
    account_used: str
    response_data: Dict[str, Any]
    stealth_level: int
    remaining_requests: int

# Account management
class AccountManager:
    def __init__(self):
        self.accounts = {}
        self.active_accounts = []
        self.rotation_queue = []
        self.load_accounts()
    
    def load_accounts(self):
        """Load accounts from database"""
        try:
            with open(ACCOUNTS_DB, 'r') as f:
                data = json.load(f)
                for account_data in data.get('accounts', []):
                    account = AccountInfo(**account_data)
                    self.accounts[account.account_id] = account
                    if account.is_active:
                        self.active_accounts.append(account.account_id)
        except FileNotFoundError:
            logger.warning("Accounts database not found, creating new one")
            self.create_default_accounts()
    
    def create_default_accounts(self):
        """Create default accounts for testing"""
        default_accounts = [
            {
                "account_id": "account_1",
                "username": "user1",
                "email": "user1@example.com",
                "password": "password1",
                "cookies": {},
                "tier": "free",
                "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "is_active": True
            },
            {
                "account_id": "account_2",
                "username": "user2",
                "email": "user2@example.com",
                "password": "password2",
                "cookies": {},
                "tier": "pro",
                "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                "is_active": True
            },
            {
                "account_id": "account_3",
                "username": "user3",
                "email": "user3@example.com",
                "password": "password3",
                "cookies": {},
                "tier": "enterprise",
                "user_agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
                "is_active": True
            }
        ]
        
        for account_data in default_accounts:
            account = AccountInfo(**account_data)
            self.accounts[account.account_id] = account
            self.active_accounts.append(account.account_id)
        
        self.save_accounts()
    
    def save_accounts(self):
        """Save accounts to database"""
        data = {
            "accounts": [account.dict() for account in self.accounts.values()],
            "last_updated": datetime.now().isoformat()
        }
        with open(ACCOUNTS_DB, 'w') as f:
            json.dump(data, f, indent=2, default=str)
    
    def get_best_account(self, priority="normal", tier="free"):
        """Get the best account for the request"""
        available_accounts = [
            acc_id for acc_id in self.active_accounts
            if self.accounts[acc_id].is_active and 
               self.accounts[acc_id].request_count < MAX_REQUESTS_PER_ACCOUNT
        ]
        
        if not available_accounts:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="No available accounts"
            )
        
        # Filter by tier if specified
        if tier != "all":
            available_accounts = [
                acc_id for acc_id in available_accounts
                if self.accounts[acc_id].tier == tier
            ]
        
        # Select account based on priority
        if priority == "high":
            # Use account with least requests
            best_account = min(available_accounts, 
                            key=lambda x: self.accounts[x].request_count)
        elif priority == "low":
            # Use account with most requests (for load balancing)
            best_account = max(available_accounts, 
                            key=lambda x: self.accounts[x].request_count)
        else:
            # Random selection for normal priority
            best_account = random.choice(available_accounts)
        
        return best_account
    
    def rotate_account(self, current_account_id):
        """Rotate to next available account"""
        current_index = self.active_accounts.index(current_account_id)
        next_index = (current_index + 1) % len(self.active_accounts)
        return self.active_accounts[next_index]
    
    def update_account_usage(self, account_id, success=True):
        """Update account usage statistics"""
        if account_id in self.accounts:
            account = self.accounts[account_id]
            account.last_used = datetime.now()
            if success:
                account.request_count += 1
            else:
                # Penalty for failed requests
                account.request_count += 2
            
            # Check if account needs cooldown
            if account.request_count >= MAX_REQUESTS_PER_ACCOUNT:
                account.is_active = False
                self.active_accounts.remove(account_id)
                logger.warning(f"Account {account_id} deactivated due to request limit")
            
            self.save_accounts()
    
    def reset_account_limits(self):
        """Reset account limits (called periodically)"""
        for account in self.accounts.values():
            if not account.is_active and account.request_count >= MAX_REQUESTS_PER_ACCOUNT:
                # Check if cooldown period has passed
                if account.last_used and datetime.now() - account.last_used > timedelta(seconds=COOLDOWN_PERIOD):
                    account.is_active = True
                    account.request_count = 0
                    if account.account_id not in self.active_accounts:
                        self.active_accounts.append(account.account_id)
                    logger.info(f"Account {account.account_id} reactivated")

# Stealth operations
class StealthOperations:
    def __init__(self, account_manager: AccountManager):
        self.account_manager = account_manager
        self.proxy_pool = [
            "http://proxy1.example.com:8080",
            "http://proxy2.example.com:8080",
            "http://proxy3.example.com:8080"
        ]
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0"
        ]
    
    async def execute_stealth_request(self, request: StealthRequest) -> StealthResponse:
        """Execute a stealth request with account rotation"""
        account_id = self.account_manager.get_best_account(request.priority)
        account = self.account_manager.accounts[account_id]
        
        try:
            # Prepare stealth headers
            headers = self.prepare_stealth_headers(account)
            
            # Select proxy if requested
            proxy = None
            if request.use_proxy and self.proxy_pool:
                proxy = random.choice(self.proxy_pool)
            
            # Execute request
            async with httpx.AsyncClient(
                proxies=proxy,
                timeout=30.0,
                follow_redirects=True
            ) as client:
                response = await client.request(
                    method=request.action.upper(),
                    url=request.target_url,
                    headers=headers,
                    json=request.payload
                )
                
                # Update account usage
                self.account_manager.update_account_usage(account_id, success=True)
                
                # Calculate stealth level
                stealth_level = self.calculate_stealth_level(account, response)
                
                return StealthResponse(
                    success=True,
                    account_used=account_id,
                    response_data={
                        "status_code": response.status_code,
                        "headers": dict(response.headers),
                        "content": response.text[:1000]  # Limit content size
                    },
                    stealth_level=stealth_level,
                    remaining_requests=MAX_REQUESTS_PER_ACCOUNT - account.request_count
                )
                
        except Exception as e:
            # Update account usage with failure
            self.account_manager.update_account_usage(account_id, success=False)
            
            logger.error(f"Stealth request failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Stealth request failed: {str(e)}"
            )
    
    def prepare_stealth_headers(self, account: AccountInfo) -> Dict[str, str]:
        """Prepare stealth headers for the request"""
        headers = {
            "User-Agent": account.user_agent or random.choice(self.user_agents),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Cache-Control": "max-age=0",
            "DNT": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1"
        }
        
        # Add cookies if available
        if account.cookies:
            cookie_string = "; ".join([f"{k}={v}" for k, v in account.cookies.items()])
            headers["Cookie"] = cookie_string
        
        # Add random delays to mimic human behavior
        time.sleep(random.uniform(0.5, 2.0))
        
        return headers
    
    def calculate_stealth_level(self, account: AccountInfo, response) -> int:
        """Calculate stealth level based on account and response"""
        stealth_level = 1
        
        # Base stealth level
        if account.tier == "enterprise":
            stealth_level += 3
        elif account.tier == "pro":
            stealth_level += 2
        else:
            stealth_level += 1
        
        # Response-based adjustments
        if response.status_code == 200:
            stealth_level += 2
        elif response.status_code in [301, 302, 307, 308]:
            stealth_level += 1
        
        # Account usage adjustments
        if account.request_count < 10:
            stealth_level += 2
        elif account.request_count < 50:
            stealth_level += 1
        
        # Random factor for unpredictability
        stealth_level += random.randint(0, 2)
        
        return min(stealth_level, 10)  # Cap at 10

# Initialize services
account_manager = AccountManager()
stealth_operations = StealthOperations(account_manager)

# API Endpoints
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Stealth System",
        "version": "1.0.0",
        "active_accounts": len(account_manager.active_accounts),
        "total_accounts": len(account_manager.accounts)
    }

@app.post("/api/stealth/execute", response_model=StealthResponse)
async def execute_stealth_request(
    request: StealthRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Execute a stealth request with account rotation"""
    try:
        result = await stealth_operations.execute_stealth_request(request)
        return result
    except Exception as e:
        logger.error(f"Stealth execution failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Stealth execution failed: {str(e)}"
        )

@app.get("/api/stealth/accounts")
async def get_account_status(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get status of all accounts"""
    return {
        "total_accounts": len(account_manager.accounts),
        "active_accounts": len(account_manager.active_accounts),
        "accounts": [
            {
                "account_id": acc.account_id,
                "username": acc.username,
                "tier": acc.tier,
                "is_active": acc.is_active,
                "request_count": acc.request_count,
                "last_used": acc.last_used.isoformat() if acc.last_used else None
            }
            for acc in account_manager.accounts.values()
        ]
    }

@app.post("/api/stealth/rotate")
async def rotate_accounts(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Manually rotate accounts"""
    account_manager.reset_account_limits()
    return {
        "message": "Account rotation completed",
        "active_accounts": len(account_manager.active_accounts)
    }

@app.post("/api/stealth/add-account")
async def add_account(
    account: AccountInfo,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Add a new account to the stealth system"""
    account_manager.accounts[account.account_id] = account
    if account.is_active:
        account_manager.active_accounts.append(account.account_id)
    account_manager.save_accounts()
    
    return {
        "message": "Account added successfully",
        "account_id": account.account_id
    }

@app.delete("/api/stealth/account/{account_id}")
async def remove_account(
    account_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Remove an account from the stealth system"""
    if account_id in account_manager.accounts:
        del account_manager.accounts[account_id]
        if account_id in account_manager.active_accounts:
            account_manager.active_accounts.remove(account_id)
        account_manager.save_accounts()
        
        return {
            "message": "Account removed successfully",
            "account_id": account_id
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

@app.get("/api/stealth/stats")
async def get_stealth_stats(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get stealth system statistics"""
    total_requests = sum(acc.request_count for acc in account_manager.accounts.values())
    active_requests = sum(
        acc.request_count for acc in account_manager.accounts.values()
        if acc.is_active
    )
    
    return {
        "total_requests": total_requests,
        "active_requests": active_requests,
        "account_distribution": {
            "free": len([acc for acc in account_manager.accounts.values() if acc.tier == "free"]),
            "pro": len([acc for acc in account_manager.accounts.values() if acc.tier == "pro"]),
            "enterprise": len([acc for acc in account_manager.accounts.values() if acc.tier == "enterprise"])
        },
        "system_health": "healthy" if len(account_manager.active_accounts) > 0 else "degraded"
    }

# Background tasks
@app.on_event("startup")
async def startup_event():
    """Initialize background tasks on startup"""
    asyncio.create_task(account_rotation_task())

async def account_rotation_task():
    """Background task for account rotation"""
    while True:
        try:
            account_manager.reset_account_limits()
            logger.info("Account rotation completed")
            await asyncio.sleep(ROTATION_INTERVAL)
        except Exception as e:
            logger.error(f"Account rotation task failed: {str(e)}")
            await asyncio.sleep(60)  # Wait 1 minute before retrying

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)


