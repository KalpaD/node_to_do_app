var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Create the schema
var todoSchema = new Schema({
    username: String,
    todo: String,
    isDone: Boolean,
    hasAttchment: Boolean
});

var Todo = mongoose.model('Todo', todoSchema);

// Return the module
module.exports = Todo;