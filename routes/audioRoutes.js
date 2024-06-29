import express from 'express';
import path from 'path';
import fs from 'fs';
import upload from '../multerConfig.js';
import { parseFile } from 'music-metadata';
import Audio from '../model/Audio.js';

const router = express.Router();

function formatDuration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

router.post('/upload', upload.single('audioFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { originalname, filename } = req.file;

    try {
        const filePath = path.join(__dirname, '../uploads', filename);

        // Проверка наличия файла
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found.');
        }

        const metadata = await parseFile(filePath);
        const duration = metadata.format.duration;

        const formattedDuration = formatDuration(duration);

        res.json({
            duration: formattedDuration,
            audioFile: filename
        });
    } catch (err) {
        res.status(500).send(`Error processing audio file: ${err.message}`);
    }
});

router.post('/create', async (req, res) => {
    const { name, category, audioFile, duration } = req.body;


    const baseUrl = 'https://node-mishka.onrender.com/uploads/';
    try {
        const audio = new Audio({
            name,
            category,
            audioFile:baseUrl + audioFile,
            duration
        });

        await audio.save();
        res.send(`Audio information created successfully: ${audioFile}`);
    } catch (err) {
        res.status(500).send(`Error creating audio information: ${err.message}`);
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const audio = await Audio.findByIdAndDelete(id);
        if (!audio) {
            return res.status(404).send('Audio not found.');
        }
        res.status(200).send(`Audio deleted successfully: ${audio.audioFile}`);
    } catch (err) {
        res.status(500).send(`Error deleting audio: ${err.message}`);
    }
});

router.get('/all', async (req, res) => {
    try {
        const audios = await Audio.find();
        res.json(audios);
    } catch (err) {
        res.status(500).send(`Error fetching audio information: ${err.message}`);
    }
});



export default router;