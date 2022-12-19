const mongoose = require('mongoose');

const URL = "mongodb://localhost:27017/keet_notes" ;



const conn = () =>{
    mongoose.connect(URL , { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{console.log('successfully Connected!!!')})
    .catch((err)=>{console.log(err)});
} 

module.exports = conn 