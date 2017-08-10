function ToDoManager() {
    this.greeting = "Hello from a todo manager service.";
    this.greet = function() {
        console.log(this.greeting);
    }
}

// this does not create an object insted, it returns a refrence to constructer function.
// so the client has to create the object.
module.exports = ToDoManager;