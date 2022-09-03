const mongoose = require('mongoose');
const colors = require('colors');

(async () => {
    try {
        await mongoose.connect(process.env.URI);
        console.log('Conectado a MongoDB'.green);
    } catch (error) {
        console.log(`fallo la conexion a MongoDB ${error}`.red);
    }
})();