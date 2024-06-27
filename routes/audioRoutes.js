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
        const filePath = path.join(path.dirname(path.win32.basename(new URL(import.meta.url).pathname)), '../node_mishka/uploads', filename);
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


    const baseUrl = 'http://192.168.1.7:5000/uploads/';
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

router.get('/all', async (req, res) => {
    try {
        const audios = await Audio.find();
        res.json(audios);
    } catch (err) {
        res.status(500).send(`Error fetching audio information: ${err.message}`);
    }
});

export default router;