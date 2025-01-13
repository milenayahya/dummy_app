FROM python:3.10-slim-bookworm
ENV PYTHONUNBUFFERED=1
WORKDIR /server
COPY ./requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host=0.0.0.0", "--reload"]