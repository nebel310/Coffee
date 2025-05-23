from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime




class SUserRegister(BaseModel):
    username: str
    email: EmailStr
    phone: str
    password: str
    password_confirm: str
    is_confirmed: bool = False


class SUserLogin(BaseModel):
    email: EmailStr
    password: str


class SUser(BaseModel):
    id: int
    username: str
    email: EmailStr
    phone: str
    is_confirmed: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)