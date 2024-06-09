require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const scanRoutes = require('./routes/scanRoutes'); // Asegúrate de que esto esté correctamente importado

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('MongoDB connected');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/scan', scanRoutes); // Asegúrate de que esto esté correctamente configurado

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
