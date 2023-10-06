FROM python:3.11.5
WORKDIR /smart_light_app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "light_sensor_data.py"]  
