// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dotenv = require("dotenv");
// Create Express app
const app = express();

// Set up middleware for parsing JSON requests
app.use(bodyParser.json());



dotenv.config({ path: "./config.env" });
const dbURL = process.env.DATABASE;
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
  })
  .then((p) => {
    console.log("DB connection success");
  });



// Define a schema for sensor readings
const sensorReadingSchema = new mongoose.Schema({
    sensorId: String,
    timestamp: { type: Date, default: Date.now },
    value: Number
});

// Define a model based on the schema
const SensorReading = mongoose.model('SensorReading', sensorReadingSchema);

// Route to handle POST requests to store sensor readings
app.post('/reading',async (req, res) => {
    // Extract sensor reading data from request body
    try{
    const { sensorId, value } = req.body;

    // Create a new sensor reading document
    const newReading = new SensorReading({
        sensorId: sensorId,
        value: value
    });

    // Save the sensor reading to the database
    await newReading.save();
     

    res.status(201).json({ message: 'Sensor data received and saved.' });

       
    }catch(err){

    res.status(500).json({ message: error.message });

    }
    
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

