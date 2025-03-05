import express from 'express';
import Record from '../model/Record.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/create_record', async (req, res) => {
    const { name, audioFile, duration, user } = req.body;
    const baseUrl = 'https://node-mishka.onrender.com/uploads/';
    try {
        const userId = mongoose.Types.ObjectId(user);

        const record = new Record({
            name,
            audioFile: baseUrl + audioFile,
            duration,
            user: userId // Используем ObjectId
        });

        await record.save();
        res.status(201).send(`Record created successfully: ${record._id}`);
    } catch (err) {
        res.status(500).send(`Error creating record: ${err.message}`);
    }
});

// Удаление записи по ID
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const record = await Record.findByIdAndDelete(id);
        if (!record) {
            return res.status(404).send('Record not found.');
        }
        res.status(200).send(`Record deleted successfully: ${record._id}`);
    } catch (err) {
        res.status(500).send(`Error deleting record: ${err.message}`);
    }
});

// Получение всех записей
router.post('/user-records', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send('User ID is required.');
    }

    try {
        const records = await Record.find({ user: id }).populate('user', 'username email');
        res.status(200).json(records);
    } catch (err) {
        res.status(500).send(`Error fetching records: ${err.message}`);
    }
});

export default router;
