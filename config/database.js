// const mongoose = require('mongoose');
// const URL = "mongodb://localhost:27017/keet_notes" ;
// mongoose.set('strictQuery', true);

// const conn = () =>{
//     mongoose.connect(URL , { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(()=>{console.log('successfully Connected!!!')})
//     .catch((err)=>{console.log(err)});
// } 
// module.exports = conn 



const mongoose = require('mongoose');
const {ServerApiVersion } = require('mongodb');

const URL = "mongodb+srv://root:mongopass@cluster0.42gwgmd.mongodb.net/?retryWrites=true&w=majority" ;
// const URL = "mongodb://127.0.0.1:27017/keep_notes" ;

mongoose.set('strictQuery', true);

const conn = () =>{
    mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
    .then(()=>{console.log('successfully Connected!!!')})
    .catch((err)=>{console.log(err)});
} 

module.exports = conn 





// const uri = "mongodb+srv://root:mongopass@cluster0.42gwgmd.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// const conn = () => client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
