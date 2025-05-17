import uvicorn
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import create_tables, delete_tables
from router.auth import router as auth_router
from router.shop import product_router, cart_router, order_router
from repositories.shop import ProductRepository
import asyncio


async def init_data():
    await ProductRepository.init_products()
    
@asynccontextmanager
async def lifespan(app: FastAPI):
    await delete_tables()
    print('База очищена')
    await create_tables()
    print('База готова к работе')
    await init_data()
    print('Тестовые данные добавлены')
    yield
    print('Выключение')


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Your App",
        version="1.0.0",
        description="Base nebel's FastApi template with JWT Auth",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "Bearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    
    secured_paths = {
        # Авторизация
        "/auth/me": {"method": "get", "security": [{"Bearer": []}]},
        "/auth/logout": {"method": "post", "security": [{"Bearer": []}]},
        
        # Корзина
        "/cart/": {"method": "get", "security": [{"Bearer": []}]},
        "/cart/add": {"method": "post", "security": [{"Bearer": []}]},
        "/cart/{cart_id}": {
            "method": "patch", 
            "security": [{"Bearer": []}]
        },
        "/cart/{cart_id}": {
            "method": "delete",  # КОНФЛИКТ1
            "security": [{"Bearer": []}]
        },
        "/cart/checkout": {"method": "post", "security": [{"Bearer": []}]},
        "/cart/{cart_id}": {"method": "patch", "security": [{"Bearer": []}]}, #КОНФЛИКТ1
        
        # Заказы
        "/orders/": {"method": "get", "security": [{"Bearer": []}]},
        "/orders/{order_id}": {
            "method": "get", 
            "security": [{"Bearer": []}]
        }
    }
    
    for path, config in secured_paths.items():
        if path in openapi_schema["paths"]:
            openapi_schema["paths"][path][config["method"]]["security"] = config["security"]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app = FastAPI(lifespan=lifespan)
app.openapi = custom_openapi
app.include_router(auth_router)
app.include_router(product_router)
app.include_router(cart_router)
app.include_router(order_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # Тут адрес фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



#Раскоментить, когда будешь писать докер.
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        reload=True,
    )