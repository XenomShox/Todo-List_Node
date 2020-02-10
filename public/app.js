$(document).ready(function() {
    $.getJSON("/api/todos").then(addTodos);

    $("#todoInput").keypress(function(event) {
        if (event.which === 13) {
            createTodo();
            $(this).val("");
        }
    });

    $(".list").on("click", "li", function() {
        updateTodo($(this));
    });

    $(".list").on("click", "span", function(event) {
        event.stopPropagation();
        removeTodo($(this).parent());
    });
});

function addTodos(todos) {
    //add todos to page
    todos.forEach(function(todo) {
        addTodo(todo);
    });
}

function addTodo(todo) {
    var newTodo = $(`<li class="task">${todo.name} <span>X</span></li>`);
    newTodo.data("id", todo._id);
    newTodo.data("completed", todo.completed);
    if (todo.completed) {
        newTodo.addClass("done");
    }
    $(".list").append(newTodo);
}

function createTodo() {
    // send request to create new todo
    var userInput = $("#todoInput").val();
    $.post("/api/todos", { name: userInput })
        .then(function(newTodo) {
            addTodo(newTodo);
        })
        .catch(function(err) {
            console.log(err);
        });
}

function removeTodo(todo) {
    var id = todo.data("id");
    $.ajax({
        method: "DELETE",
        url: `/api/todos/${id}`
    })
        .then(function(data) {
            todo.remove();
        })
        .catch(function(err) {
            console.log(err);
        });
}

function updateTodo(todo) {
    var id = todo.data("id");
    var isDone = !todo.data("completed");
    $.ajax({
        method: "PUT",
        url: `/api/todos/${id}`,
        data: { completed: isDone }
    })
        .then(function(updatedTodo) {
            todo.toggleClass("done");
            todo.data("completed", isDone);
        })
        .catch(function(err) {
            console.log(err);
        });
}
