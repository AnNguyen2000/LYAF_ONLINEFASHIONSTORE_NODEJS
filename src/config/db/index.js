//Impport library:
const mongoose = require('mongoose');
async function connect_db(){
    try {
        await mongoose.connect(process.env.MONGODB_CONFIG, {
            useNewUrlParser: true, 
            useUnifiedTopology: true 
            });
            console.log('Connect successfully !!!');
    } catch (error) {
            console.log(error);
    }
}

module.exports = connect_db;