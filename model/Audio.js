import mongoose from 'mongoose';

const AudioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    audioFile: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    }
});

const Audio = mongoose.model('Audio', AudioSchema);

export default Audio;