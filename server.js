const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs')
todos = require('./data.json');

const app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

app.get('/api/todo', (req, res) => {
    return res.json(todos)
})

app.post('/api/todo', (req, res) => {
    const body = req.body
    console.log(body);
    todos.push({ ...body, id: todos.length + 1 })
    fs.writeFile('./data.json', JSON.stringify(todos), (err, data) => {
        return res.json({ status: "pending", id: todos.length })
    })
})

app.route('/api/todo/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        todo = todos.find((todo) => todo.id === id);
        console.log(todo, "klklkl");
        return res.json(todo)
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const todo = todos.find((todo) => todo.id === id);

        if (!todo) {
            return res.status(404).json({ error: 'Object not found' });
        }
        todo.data = req.body.data;
        fs.writeFile('./data.json', JSON.stringify(todos), (err, data) => {
            return res.json({ status: "true" })
        })
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const todoIndex = todos.findIndex((todo) => todo.id === id);

        if (todoIndex === -1) {
            return res.status(404).json({ error: 'Object not found' });
        }
        todos.splice(todoIndex, 1);

        fs.writeFile('./data.json', JSON.stringify(todos), (err, data) => {
            return res.json({ status: "true" })
        })
    })

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});