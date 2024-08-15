import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import audioRoutes from './routes/audioRoutes.js';
import recordRoutes from './routes/RecordRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'cron';
import axios from 'axios';

mongoose
    .connect('mongodb+srv://admin:admin@mishkaserver.3hjgkpz.mongodb.net/Mishka?retryWrites=true&w=majority&appName=MishkaServer')
    .then(() => { console.log('DB good') })
    .catch((err) => { console.log('DB error', err) });

const app = express();

// Используйте cors middleware
app.use(cors());

app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/auth', authRoutes);
app.use('/audio', audioRoutes);
app.use('/record',recordRoutes);
app.use(morgan('dev'));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

app.use((req, res, next) => {
    res.status(404).send('Sorry, the resource you are looking for could not be found.');
});


const job = new cron.CronJob('*/10 * * * *', () => {
  axios.get('https://mishka-l3tq.onrender.com/')
      .then(response => {
          console.log('Scheduled GET request successful:', response.data);
      })
      .catch(error => {
          console.error('Error with scheduled GET request:', error);
      });
});

job.start();

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  return console.log(`Server good on port ${PORT}`);
});