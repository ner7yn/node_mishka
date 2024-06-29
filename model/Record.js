import mongoose from 'mongoose';

const RecordSchema = new mongoose.Schema({
    name: {
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
    },
    user: {
        type: String,
        required:true
    }
});

const Record = mongoose.model('Record', RecordSchema);

export default Record;