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
    product_id: int
    quantity: int

class SCart(BaseModel):
    items: list[SCartItem]
    total_price: int

class SOrderItem(BaseModel):
    product_id: int
    quantity: int
    price: int

class SOrder(BaseModel):
    id: int
    user_id: int
    total_price: int
    status: str
    address: str
    created_at: datetime
    items: list[SOrderItem]