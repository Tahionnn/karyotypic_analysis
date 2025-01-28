from .application import *
from fastapi.middleware.cors import CORSMiddleware
from .notebooks.router import notebook_router
from .users.router import user_router
from .auth.router import auth_router


app = create_application()

routers = (user_router, notebook_router, auth_router)

for router in routers:
    app.include_router(router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
