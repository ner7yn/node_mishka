import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

mongoose
    .connect('mongodb+srv://admin:admin@mishkaserver.3hjgkpz.mongodb.net/?retryWrites=true&w=majority&appName=MishkaServer')
    .then(() => { console.log('DB good') })
    .catch((err) => { console.log('DB error', err) });

const app = express();

// Используйте cors middleware
app.use(cors());

app.use(express.json());
app.use('/auth', authRoutes);

app.listen(5000, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log("Server good");
});