# Use the official Python 3.12 image
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Copy dependency files first
COPY pyproject.toml poetry.lock ./

# Install Poetry
RUN pip install --no-cache-dir poetry=="2.0.0"

# Configure Poetry to create the virtual environment in the project directory
RUN poetry config virtualenvs.in-project true

# Install dependencies
RUN poetry install --no-root

# Debugging step: List the contents of the .venv directory
RUN ls -la .venv/bin

# Now copy the entire project into the container
COPY . .

# Expose port 8000
EXPOSE 8000

# Use the shell form of CMD to ensure the correct environment is used
CMD ["sh", "-c", "./.venv/bin/python -m uvicorn karyotypic_analysis.ml.router:app --host 0.0.0.0 --port 8000"]
