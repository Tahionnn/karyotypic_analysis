from .schemas import Token
from .utils import *
from ..utils import commit_session

from fastapi import APIRouter


auth_router = APIRouter(tags=['Auth methods'])


@auth_router.post("/register/")
async def register_user(user_data: UserRegister, session: AsyncSession = Depends(get_session)):
    result_user = await session.execute(select(User).where(User.email == user_data.email))
    user = result_user.scalar_one_or_none()
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='A user with email address={user_data.email} already exists.'
        )
    user_dict = user_data.model_dump()
    user_dict['password']  = get_password_hash(user_data.password)
    new_user = User(**user_dict)
    session.add(new_user)
    await session.flush()
    await commit_session(session)
    
    return {'message': f'{user_data.username} has been  registered'}


@auth_router.post("/token")
@auth_router.post("/api/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: AsyncSession = Depends(get_session),
) -> Token:
    user = await authenticate_user(username_or_email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")