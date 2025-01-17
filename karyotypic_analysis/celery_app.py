from celery import Celery


app = Celery(
    'karyotypic_analysis',
    broker='amqp://rmuser:rmpassword@localhost:5672/',
    backend="redis://localhost:6379",
    include=['karyotypic_analysis.ml.tasks']
)


app.conf.update(
    result_expires=3600,
)