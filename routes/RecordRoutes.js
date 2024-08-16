import express from 'express';
import Record from '../model/Record.js';

const router = express.Router();

router.post('/create_record', async (req, res) => {
    const { name, audioFile, duration, user } = req.body;
    const baseUrl = 'https://mishka-l3tq.onrender.com/uploads/';
    try {
        const record = new Record({
            name,
            audioFile:baseUrl + audioFile,
            duration,
            user
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