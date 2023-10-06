from pymongo import MongoClient
import random

username = "admin"
password = "password"
host = "34.238.235.170"
port = "27017"
database = "admin"

# client = MongoClient(f"mongodb://{username}:{password}@{host}:{port}/{database}")
client = MongoClient(
    f"mongodb://{username}:{password}@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&authSource=admin&appName=mongosh+1.10.4"
)
db = client["smart_lighting"]
collection = db["lights"]

# Simulating data for 1000 lights (you can scale this up as required)


for i in range(5000):
    light_data = {
        "light_id": i,
        "status": random.choice(["on", "off"]),
        "brightness": random.randint(0, 100),
        "color": "white",
        "location": f"floor_{random.randint(1, 10)}_room_{random.randint(1, 100)}",
        "ambient_light": random.randint(200, 800),  # in lumens
        "motion_detected": random.choice([True, False]),
        "temperature": random.uniform(15.0, 40.0),  # Celsius
        "humidity": random.uniform(30.0, 70.0),  # Relative Humidity in Percentage
        "energy_consumption": random.uniform(5.0, 20.0),  # Watts
    }
    collection.insert_one(light_data)
