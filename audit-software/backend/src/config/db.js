require('dotenv').config();
const mongoose = require('mongoose');


module.exports = () =>{
    mongoose.connect(process.env.MONGODB_URI, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        }).then(() => {
        console.log('MongoDB connected');
        }).catch((error) => {
        console.error('MongoDB connection error:', error);
        });

}
