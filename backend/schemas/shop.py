from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class SProduct(BaseModel):
    id: int
    title: str
    description: str
    price: int
    address: str
    image_path: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SCartItem(BaseModel):
    id: int
    product_id: int
    product: SProduct  # Добавляем информацию о товаре
    quantity: int

class SCart(BaseModel):
    items: list[SCartItem]
    total_price: int

class SOrderItem(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    price: int
    product: Optional[SProduct] = None  # Добавляем опциональное поле продукта

    model_config = ConfigDict(from_attributes=True)

class SOrder(BaseModel):
    id: int
    user_id: int
    total_price: int
    status: str
    address: str
    created_at: datetime
    items: list[SOrderItem]  # Это поле обязательно

    model_config = ConfigDict(from_attributes=True)