const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connessione a MongoDB
mongoose.connect('mongodb://localhost:27017/calendario', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connesso'))
    .catch(err => console.log(err));

// Schema per le date selezionate
const dateSchema = new mongoose.Schema({
    email: String,
    selectedDates: [String]
});

const DateModel = mongoose.model('Date', dateSchema);

// Endpoint per salvare le date
app.post('/api/dates', async (req, res) => {
    const { email, selectedDates } = req.body;
    const newDateEntry = new DateModel({ email, selectedDates });
    await newDateEntry.save();
    res.status(201).send(newDateEntry);
});

// Endpoint per ottenere le date
app.get('/api/dates/:email', async (req, res) => {
    const { email } = req.params;
    const dates = await DateModel.findOne({ email });
    res.status(200).send(dates);
});

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
}); 