from fastapi import APIRouter, Depends, HTTPException
from utils.security import get_current_user
from repositories.shop import ProductRepository, CartRepository, OrderRepository
from schemas.shop import SProduct, SCart, SOrder
from models.auth import UserOrm

product_router = APIRouter(
    prefix="/products",
    tags=['Продукты']
)

cart_router = APIRouter(
    prefix="/cart",
    tags=['Корзина']
)

order_router = APIRouter(
    prefix="/orders",
    tags=['Заказы']
)

@product_router.get("/", response_model=list[SProduct])
async def get_products(limit: int = 10, offset: int = 0):
    try:
        products = await ProductRepository.get_all_products(limit, offset)
        return products
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@product_router.get("/{product_id}", response_model=SProduct)
async def get_product(product_id: int):
    try:
        product = await ProductRepository.get_product_by_id(product_id)
        return product
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@cart_router.get("/", response_model=SCart)
async def get_user_cart(user: UserOrm = Depends(get_current_user)):
    try:
        cart_items = await CartRepository.get_user_cart(user.id)
        total_price = 0
        for item in cart_items:
            product = await ProductRepository.get_product_by_id(item.product_id)
            total_price += product.price * item.quantity
        return {"items": cart_items, "total_price": total_price}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@cart_router.post("/add")
async def add_in_cart(product_id: int, quantity: int, user: UserOrm = Depends(get_current_user)):
    try:
        item = await CartRepository.add_to_cart(user.id, product_id, quantity)
        return item
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@cart_router.post("/checkout")
async def checkout_cart(address: str, user: UserOrm = Depends(get_current_user)):
    try:
        order = await CartRepository.checkout_cart(user.id, address)
        return order
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@cart_router.patch("/{cart_id}")
async def update_cart(cart_id: int, quantity: int, user: UserOrm = Depends(get_current_user)):
    try:
        item = await CartRepository.update_cart_item(cart_id, user.id, quantity)
        return item
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@cart_router.delete("/{cart_id}")
async def delete_cart(cart_id: int, user: UserOrm = Depends(get_current_user)):
    try:
        await CartRepository.remove_from_cart(cart_id, user.id)
        return {"message": "Товар удален из корзины"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@order_router.get("/", response_model=list[SOrder])
async def get_user_orders(limit: int = 10, offset: int = 0, user: UserOrm = Depends(get_current_user)):
    try:
        orders = await OrderRepository.get_user_orders(user.id, limit, offset)
        return orders
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@order_router.get("/{order_id}", response_model=SOrder)
async def get_order_details(order_id: int, user: UserOrm = Depends(get_current_user)):
    try:
        order = await OrderRepository.get_order_details(order_id, user.id)
        return order
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))