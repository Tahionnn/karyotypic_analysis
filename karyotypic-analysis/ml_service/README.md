# karyotypic_analysis ml_service
## Введение
Этот сервис отвечает за инференс модели. Нейросеть запускается в среде [**ONNX Runtime**](https://onnxruntime.ai/docs/). API разработано с использованием FastAPI.

Cтруктура проекта: 
```bash
ml_service
├── celery_app.py         # Настройка Celery для асинхронных задач
├── Dockerfile            # Инструкции по созданию образа Docker
├── __init__.py           
├── main.py               # Основной файл для запуска приложения
├── ml                    # Папка с модулями для машинного обучения
│   ├── __init__.py
│   ├── models.py         # Определение моделей ответов
│   ├── router.py         # Определение маршрутов API
│   ├── tasks.py          # Задачи Celery
│   ├── utils.py          # Утилиты для обработки данных
│   └── YOLOv10.py        # Реализация модели YOLOv10
├── models                # Папка с предобученными моделями
│   └── best.onnx         # Модель в формате ONNX
├── README.md             
└── requirements.txt      # Зависимости проекта

```
Для управления нагрузкой и сокращения времени простоя сервис использует [**Celery**](https://docs.celeryq.dev/en/stable/) с [**RabbitMQ**](https://www.rabbitmq.com/docs) в качестве очереди и [**Redis**](https://redis.io/docs/latest/) для сохранения предсказаний нейронной сети.
## Эндпоинты
### Эндпоинт: /ml/predict

**Метод:** `POST`  
**Описание:** Получение предсказаний от модели машинного обучения.

#### Параметры

Нет параметров запроса.

#### Тело запроса

**Файл:**  
- **Тип:** `string($binary)`  
- **Обязательный:** Да  
- **Описание:** Изображение, которые необходимо обработать для получения предсказаний.

#### Ответы

| Код | Описание                | Ссылки |
|-----|-------------------------|--------|
| 200 | Успешный ответ          |        |
| 422 | Ошибка валидации        |        |

**Media Type:** Управляет заголовком `Accept`.

**Пример успешного ответа:**

```json
{
  "boxes": {
    "additionalProp1": [
      [
        0
      ]
    ],
    "additionalProp2": [
      [
        0
      ]
    ],
    "additionalProp3": [
      [
        0
      ]
    ]
  }
}
```