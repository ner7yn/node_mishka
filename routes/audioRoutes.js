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
        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        const filePath = path.join(__dirname, '../uploads', filename);

        // Проверка наличия файла
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found.');
        }

        const metadata = await parseFile(filePath);
        const duration = metadata.format.duration;

        const formattedDuration = formatDuration(duration);

        res.json({
            audioFile: filename
        });
    } catch (err) {
        res.status(500).send(`Error processing audio file: ${err.message}`);
    }
});

router.post('/create', async (req, res) => {
    const audioItems = req.body; // Предполагается, что req.body теперь содержит массив объектов
    const baseUrl = 'https://node-mishka.onrender.com/uploads/';

    try {
        const createdAudios = [];

        for (const item of audioItems) {
            const { name, category, audioFile, duration } = item;

            const audio = new Audio({
                name,
                category,
                audioFile: baseUrl + audioFile,
                duration
            });

            await audio.save();
            createdAudios.push(audio);
        }

        res.status(201).json({
            message: 'Audio information created successfully',
            audios: createdAudios
        });
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