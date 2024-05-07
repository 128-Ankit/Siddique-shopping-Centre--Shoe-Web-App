const mongoose = require('mongoose')
require('dotenv').config();

const connect = () => {
    mongoose.connect(process.env.DB_URL, {

    }).then(()=>{
        console.log("DB connection successfully!");
    })
    .catch((err) => {
        console.log("DB connection failed!"  + err);
        process.exit(1);
    })
}

module.exports = connect;

 