require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Material = require('./models/material');
const cors = require('cors');
const path = require('path');  // Add path for serving static files

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files (frontend files)
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB connection
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// API endpoint to get all materials
app.get('/api/materials', async (req, res) => {
    try {
        const materials = await Material.find();
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API endpoint to add a new material
app.post('/api/materials', async (req, res) => {
    try {
        const { line, workOrderNumber, materialPartNumber, quantity, description } = req.body;

        const newMaterial = new Material({
            line,
            workOrderNumber,
            materialPartNumber,
            quantity,
            description
        });

        await newMaterial.save();
        res.json(newMaterial);  // Respond with the newly created material
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API endpoint to delete a material
app.delete('/api/materials/:id', async (req, res) => {
    try {
        await Material.findByIdAndDelete(req.params.id);
        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Serve HTML files (catch-all route for frontend routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', req.path));
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
