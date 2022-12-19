// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const SomeModelSchema = new Schema({
  note: String,
});


const Notes = mongoose.model("KeepNotes", SomeModelSchema);


module.exports = Notes