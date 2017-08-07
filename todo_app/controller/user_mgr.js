var express = require('express');
var logger = require('winston');
var Todo = require('../model/todo/todoModel');
var router = express.Router();

/**
 * This service endpoint will return all TODO's which are relevent to 
 * given user name.
 * @param {String} uname : The user name to be query for todos.
 */
router.get('/todos/:uname', (req, res) => {
    logger.info(`Request recived to GET /todos service for user name : ${req.params.uname}`);
    Todo.find({username: req.params.uname}, (err, todos) => {
        if (err) {
            var errorMessage = {errorMessage: err};
            res.status(500).send(errorMessage);
        } else {
            if(todos.length === 0) {
                // we can not find any tods related this user.
                res.status(404).send({errorMessage : "We could not find any todos for the given user name."});
            }
            logger.info(`Response contains following todo object : ${JSON.stringify(todos)}`);
            res.send(todos);
        }
    });
});

/**
 * This service endpoint will act as upsert endpoint for todo requests based on todo id.
 * @param {JSON}  { "todo": {String} ,
                   "isDone": {Boolean},
                   "hasAttachment": {Boolean}
                  }
 */
router.post('/todo', (req, res) => {
    logger.info('Request recived to POST /users/add service.');
    if (req.body.id) {
            Todo.findByIdAndUpdate(req.body.id,  // id 
             { todo: req.body.todo,
               isDone: req.body.isDone,
               hasAttachment: req.body.hasAttachment
             },                                 // object to be updated
             (err, todo) => {
                 if(err) throw err;
                 res.send("Success - Update");  // call back
             });
        } else {
            var newTodo = Todo({
                username: 'test',               // TODO this need to be the logged in username.
                todo: req.body.todo,
                isDone: req.body.isDone,
                hasAttachment: req.body.hasAttachment
            });
            newTodo.save((err) => {
                if(err) throw err;
                res.send("Success - Create");   // call back
            });
        }

});

module.exports = router;