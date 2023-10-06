const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();


app.use(cors());


const PORT = 3008;
const username = "admin";
const password = "password";
const host = "127.0.0.1"
const port = "27017";
const database = "admin";
const MONGO_URI = `mongodb://${username}:${password}@${host}:${port}/${database}`;

let db;

app.use(bodyParser.json());

MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db('smart_lighting');
    })
    .catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('Smart Lighting System!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Fetch a specific light by its ID
app.get('/lights/:id', (req, res) => {
    const lightId = parseInt(req.params.id);  

    db.collection('lights').findOne({ light_id: lightId })
        .then(light => {
            if (!light) {
                return res.status(404).send({ message: 'Light not found' });  
            }
            res.json(light);  
        })
        .catch(error => {
            console.error(error);
            res.status(500).send({ message: 'Error fetching light' });  
        });
});

// Fetch the status of all lights
app.get('/lights', (req, res) => {
    db.collection('lights').find().toArray()
        .then(results => {
            res.json(results);
        })
        .catch(error => res.send(error));
});




app.get('/adjust_lights', (req, res) => {
    db.collection('lights').find().toArray()
        .then(lights => {
            lights.forEach(light => {
                if (light.motion_detected && light.ambient_light < 300) {
                    // If motion is detected and the room is dark
                    db.collection('lights').updateOne({ light_id: light.light_id }, { $set: { status: "on" } });
                }
                if (light.temperature < 18) {
                    // If the room is cold
                    db.collection('lights').updateOne({ light_id: light.light_id }, { $set: { color: "yellow" } });
                }
            });
            res.send("Lights adjusted based on sensor data!");
        })
        .catch(error => res.send(error));
});

app.get('lights/statusCount', (req, res) => {
    db.collection('lights').aggregate([
        { 
            $group: {
                _id: "$status", 
                count: { $sum: 1 }
            } 
        }
    ]).toArray()
    .then(results => {
        const onCount = results.find(r => r._id === "on")?.count || 0;
        const offCount = results.find(r => r._id === "off")?.count || 0;
        res.json({ onCount, offCount });
    })
    .catch(error => res.send(error));
});


app.get('lights/averageReadings/:limit', (req, res) => {
    const limit = parseInt(req.params.limit, 10);

    db.collection('lights').find().sort({ _id: -1 }).limit(limit).toArray()
    .then(lights => {
        const temperatures = lights.map(l => l.temperature);
        const humidities = lights.map(l => l.humidity);

        const avgTemperature = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
        const avgHumidity = humidities.reduce((a, b) => a + b, 0) / humidities.length;

        res.json({ avgTemperature, avgHumidity });
    })
    .catch(error => res.send(error));
});

app.put('/lights/:id/toggle', (req, res) => {
 
    const { status } = req.body;
    const lightId = parseInt(req.params.id);  // Convert the ID from string to integer (if it's stored as an integer in your database)
  
      db.collection('lights').findOne({ light_id: lightId })
          .then(light => {
              if (!light) {
                  return res.status(404).send({ message: 'Light not found' });  // If no light found, return a 404 status
              }
              light.status = status
              res.json(light);  // Return the found light data
          })
          .catch(error => {
              console.error(error);
              res.status(500).send({ message: 'Error fetching light' });  // If there's an error, return a 500 status
          });
   
  });



