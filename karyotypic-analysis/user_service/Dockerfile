FROM python:3.12-slim

WORKDIR /app/user_service

RUN apt update -y && \
    apt install -y curl && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .

ENV PYTHONPATH="/app"

CMD ["uvicorn", "user_service.main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]
