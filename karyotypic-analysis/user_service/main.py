from fastapi import FastAPI
from .notebooks.router import notebook_router
from .users.router import user_router
from .auth.router import auth_router


app = FastAPI()


routers = (user_router, notebook_router, auth_router)

for router in routers:
    app.include_router(router)