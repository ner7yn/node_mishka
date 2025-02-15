import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'My API',
        description: 'Description',
    },
    host: 'localhost:5000',
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/authRoutes.js', './routes/audioRoutes.js', './routes/RecordRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);