var express = require('express');
var logger = require('winston');
var Todo = require('../model/todo/todoModel');
// Get the todomgrService attribute from the todo_mgr module export root object
// It is an function constructor.
var TodoMgr = require('../todo_mgr').todomgrService;
var todomgrService = new TodoMgr();
var router = express.Router();

/**
 * This service endpoint will return all TODO's which are relevent to 
 * given user name.
 * @param {String} uname : The user name to be query for todos.
 */
router.get('/todos/:uname', (req, res) => {
    logger.info(todomgrService.greet());
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
 * @param {Object}
 */
router.post('/todo', (req, res) => {
    logger.info('Request recived to POST /users/add service.');
    if (req.body._id) {
            Todo.findByIdAndUpdate(req.body._id,  // id 
             { todo: req.body.todo,
               isDone: req.body.isDone,
               hasAttachment: req.body.hasAttachment
             },                                 // object to be updated
             (err, todo) => {
                 if (err) {
                     logger.error(`Error while updating the todo object identified by ${req.body._id} error : ${err}`);
                     let errorMessage = {errorMessage: err};
                     res.status(500).send(errorMessage);
                 } else {
                    let successMessage = { message : `Record identified by ${req.body._id} has been updated successfully`};
                    res.send(successMessage);  // call back
                 }
             });
        } else {
            var newTodo = Todo({
                username: 'test',               // TODO this need to be the logged in username.
                todo: req.body.todo,
                isDone: req.body.isDone,
                hasAttachment: req.body.hasAttachment
            });
            newTodo.save( (err) => {
                if (err) {
                    logger.error(`Error while creating the todo object with content by ${req.body.todo} error : ${err}`);
                    let errorMessage = {errorMessage: err};
                    res.status(500).send(errorMessage);
                } else {
                    logger.info(`Record with content ${JSON.stringify(newTodo)} has been created successfully`);
                    res.send(newTodo);  // call back
                }
            });
        }

});

module.exports = router;