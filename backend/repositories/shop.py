from database import new_session
from sqlalchemy import select, delete, update, func
from datetime import datetime, timezone
from models.shop import ProductOrm, CartOrm, OrderOrm, Order_itemOrm
from sqlalchemy.orm import joinedload
import random

class ProductRepository:
    @classmethod
    async def init_products(cls):
        async with new_session() as session:
            # Проверяем, есть ли уже товары
            query = select(func.count()).select_from(ProductOrm)
            result = await session.execute(query)
            count = result.scalar()
            
            if count == 0:
                # Создаем 10 тестовых товаров
                products = [
                    ProductOrm(
                        title=f"Товар {i}",
                        description=f"Описание товара {i}",
                        price=random.randint(100, 10000),
                        address=f"Адрес магазина {i}",
                        image_path=f"/images/product_{i}.jpg"
                    ) for i in range(1, 11)
                ]
                session.add_all(products)
                await session.commit()

    @classmethod
    async def get_all_products(cls, limit: int, offset: int) -> list:
        try:
            async with new_session() as session:
                query = select(ProductOrm).limit(limit).offset(offset)
                result = await session.execute(query)
                return result.scalars().all()
        except Exception:
            raise ValueError("Ошибка при получении списка товаров")

    @classmethod
    async def get_product_by_id(cls, product_id: int):
        try:
            async with new_session() as session:
                query = select(ProductOrm).where(ProductOrm.id == product_id)
                result = await session.execute(query)
                product = result.scalars().first()
                if not product:
                    raise ValueError("Товар не найден")
                return product
        except Exception:
            raise ValueError("Ошибка при получении товара")

class CartRepository:
    @classmethod
    async def get_user_cart(cls, user_id: int) -> list:
        try:
            async with new_session() as session:
                query = select(CartOrm).where(CartOrm.user_id == user_id)
                result = await session.execute(query)
                return result.scalars().all()
        except Exception:
            raise ValueError("Ошибка при получении корзины")

    @classmethod
    async def add_to_cart(cls, user_id: int, product_id: int, quantity: int):
        try:
            if quantity <= 0:
                raise ValueError("Количество должно быть больше 0")
                
            async with new_session() as session:
                # Проверяем существует ли товар
                product = await ProductRepository.get_product_by_id(product_id)
                
                # Проверяем есть ли уже такой товар в корзине
                query = select(CartOrm).where(
                    (CartOrm.user_id == user_id) & 
                    (CartOrm.product_id == product_id)
                )
                result = await session.execute(query)
                existing_item = result.scalars().first()
                
                if existing_item:
                    existing_item.quantity += quantity
                else:
                    existing_item = CartOrm(
                        user_id=user_id,
                        product_id=product_id,
                        quantity=quantity
                    )
                    session.add(existing_item)
                
                await session.commit()
                return existing_item
        except Exception as e:
            raise ValueError(f"Ошибка при добавлении в корзину: {str(e)}")

    @classmethod
    async def update_cart_item(cls, cart_id: int, user_id: int, quantity: int):
        try:
            if quantity <= 0:
                raise ValueError("Количество должно быть больше 0")
                
            async with new_session() as session:
                query = select(CartOrm).where(
                    (CartOrm.id == cart_id) & 
                    (CartOrm.user_id == user_id)
                )
                result = await session.execute(query)
                cart_item = result.scalars().first()
                
                if not cart_item:
                    raise ValueError("Элемент корзины не найден")
                
                cart_item.quantity = quantity
                await session.commit()
                return cart_item
        except Exception:
            raise ValueError("Ошибка при обновлении корзины")

    @classmethod
    async def remove_from_cart(cls, cart_id: int, user_id: int):
        try:
            async with new_session() as session:
                query = delete(CartOrm).where(
                    (CartOrm.id == cart_id) & 
                    (CartOrm.user_id == user_id)
                )
                await session.execute(query)
                await session.commit()
        except Exception:
            raise ValueError("Ошибка при удалении из корзины")

    @classmethod
    async def checkout_cart(cls, user_id: int, address: str):
        try:
            async with new_session() as session:
                cart_items = await cls.get_user_cart(user_id)
                if not cart_items:
                    raise ValueError("Корзина пуста")
                
                total_price = 0
                for item in cart_items:
                    product = await ProductRepository.get_product_by_id(item.product_id)
                    total_price += product.price * item.quantity
                
                order = OrderOrm(
                    user_id=user_id,
                    total_price=total_price,
                    status="pending",
                    address=address or "Адрес не указан"
                )
                session.add(order)
                await session.flush()
                
                for item in cart_items:
                    product = await ProductRepository.get_product_by_id(item.product_id)
                    order_item = Order_itemOrm(
                        order_id=order.id,
                        product_id=item.product_id,
                        quantity=item.quantity,
                        price=product.price
                    )
                    session.add(order_item)
                
                await session.execute(delete(CartOrm).where(CartOrm.user_id == user_id))
                await session.commit()
                return order
        except Exception as e:
            raise ValueError(f"Ошибка при оформлении заказа: {str(e)}")

class OrderRepository:
    @classmethod
    async def get_user_orders(cls, user_id: int, limit: int, offset: int) -> list:
        try:
            async with new_session() as session:
                query = (
                    select(OrderOrm)
                    .where(OrderOrm.user_id == user_id)
                    .limit(limit)
                    .offset(offset)
                    .order_by(OrderOrm.created_at.desc())
                )
                result = await session.execute(query)
                return result.scalars().all()
        except Exception:
            raise ValueError("Ошибка при получении заказов")

    @classmethod
    async def get_order_details(cls, order_id: int, user_id: int = None):
        try:
            async with new_session() as session:
                query = (
                    select(OrderOrm)
                    .where(OrderOrm.id == order_id)
                    .options(joinedload(OrderOrm.items))
                )
                
                if user_id:
                    query = query.where(OrderOrm.user_id == user_id)
                
                result = await session.execute(query)
                order = result.scalars().first()
                
                if not order:
                    raise ValueError("Заказ не найден")
                
                return order
        except Exception:
            raise ValueError("Ошибка при получении деталей заказа")