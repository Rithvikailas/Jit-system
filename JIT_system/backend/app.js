require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Material = require('./models/material');
const cors = require('cors');
const path = require('path');  // Add path for serving static files
const ExcelData = require('./models/exceldata');
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




  app.post('/api/excelData', async (req, res) => {
    try {
        const excelData = req.body; // Excel data in JSON format
        await ExcelData.deleteMany({}); // Remove old data
        const newExcelData = new ExcelData({ data: excelData });
        await newExcelData.save();
        res.json({ message: 'Excel data uploaded successfully!' });
    } catch (error) {
        console.error('Error processing Excel data:', error);
        res.status(500).json({ message: 'Error processing file' });
    }
});

// API to fetch Excel data for dropdowns (used in `productionline.html`)
app.get('/api/excelData', async (req, res) => {
    try {
        const excelData = await ExcelData.findOne();
        res.json(excelData ? excelData.data : {});
    } catch (error) {
        console.error('Error fetching Excel data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

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

// API endpoint to mark material as sent
// API endpoint to mark material as received
// API endpoint to mark material as received
// Assuming you are using Express.js
// Ensure this endpoint is in your backend code
// In your backend code (e.g., app.js or routes file)
app.put('/api/materials/send/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const material = await Material.findById(id);
        
        if (!material) {
            return res.status(404).send('Material not found');
        }

        material.status = 'Sent';  // Update status or set a field that indicates it's been sent
        await material.save();
        res.status(200).json(material);
    } catch (error) {
        console.error('Error updating material status:', error);
        res.status(500).send('Server error');
    }
});

// DELETE material by ID
app.delete('/api/materials/:id', (req, res) => {
    const materialId = req.params.id;

    Material.findByIdAndDelete(materialId, (err, result) => {
        if (err) {
            console.error('Error deleting material:', err);
            res.status(500).send({ error: 'Error deleting material' });
        } else if (!result) {
            res.status(404).send({ message: 'Material not found' });
        } else {
            res.status(200).send({ message: 'Material deleted successfully' });
        }
    });
});



const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
