// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const SomeModelSchema = new Schema({
  note: String,
  email: Array,
  date: String,
  time: String,
  updated: Boolean,
});

const Notes = mongoose.model("KeepNotes", SomeModelSchema);

module.exports = Notes;
