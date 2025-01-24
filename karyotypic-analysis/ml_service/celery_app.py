from celery import Celery


app = Celery(
    "ml",
    broker="amqp://rmuser:rmpassword@rabbitmq:5672/",
    backend="redis://redis:6379",
    include=["ml.tasks"],
)


app.conf.update(
    result_expires=3600,
)
