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
            query = select(func.count()).select_from(ProductOrm)
            result = await session.execute(query)
            count = result.scalar()
            
            types_of_products = [
                'Эспрессо', 
                'Капучино', 
                'Латте', 
                'Американо', 
                'Флэт Уайт', 
                'Раф кофе', 
                'Матча латте',
                'Круассан', 
                'Тирамису', 
                'Чизкейк'
            ]
            
            desc_of_products = [  
                "Крепкий черный кофе, приготовленный под давлением",  
                "Эспрессо с молоком и воздушной молочной пеной",  
                "Кофе с большим количеством молока и нежной пенкой",  
                "Эспрессо, разбавленный горячей водой",  
                "Двойной эспрессо с молоком и тонким слоем пены",  
                "Взбитый эспрессо со сливками и ванильным сиропом",  
                "Напиток на основе зеленого чая матча и молока", 
                "Слоеная булочка с хрустящей корочкой",  
                "Итальянский десерт из кофе, маскарпоне и савоярди",  
                "Нежный десерт из творожного сыра на песочной основе" 
            ]
            
            if count == 0:
                products = [
                    ProductOrm(
                        title=types_of_products[i],
                        description=desc_of_products[i],
                        price=random.randint(100, 10000),
                        address=f"Кофейня МИСИС {i+1}",
                        image_path=f"/product/image/{i+1}"
                    ) for i in range(len(types_of_products))
                ]
                session.add_all(products)
                await session.commit()

    @classmethod
    async def get_all_products(cls, limit: int, offset: int) -> list:
        try:
            async with new_session() as session:
                query = select(ProductOrm).limit(limit).offset(offset)
                result = await session.execute(query)
                products = result.scalars().all()
                return products
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
        async with new_session() as session:
            try:
                # Получаем товары в корзине
                cart_query = select(CartOrm).where(CartOrm.user_id == user_id)
                cart_result = await session.execute(cart_query)
                cart_items = cart_result.scalars().all()
                
                if not cart_items:
                    raise ValueError("Корзина пуста")
                
                # Рассчитываем общую сумму и готовим товары заказа
                total_price = 0
                order_items = []
                
                for item in cart_items:
                    product = await ProductRepository.get_product_by_id(item.product_id)
                    if not product:
                        continue
                        
                    total_price += product.price * item.quantity
                    order_items.append({
                        'product_id': product.id,
                        'quantity': item.quantity,
                        'price': product.price
                    })
                
                # Создаем заказ
                order = OrderOrm(
                    user_id=user_id,
                    total_price=total_price,
                    status="pending",
                    address=address or "Адрес не указан"
                )
                session.add(order)
                await session.flush()
                
                # Добавляем товары заказа
                for item in order_items:
                    order_item = Order_itemOrm(
                        order_id=order.id,
                        product_id=item['product_id'],
                        quantity=item['quantity'],
                        price=item['price']
                    )
                    session.add(order_item)
                
                # Очищаем корзину
                await session.execute(delete(CartOrm).where(CartOrm.user_id == user_id))
                await session.commit()
                
                return order
                
            except Exception as e:
                await session.rollback()
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
                    .options(joinedload(OrderOrm.items))  # Жадная загрузка items
                )
                result = await session.execute(query)
                return result.scalars().unique().all()
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