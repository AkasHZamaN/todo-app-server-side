const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// database connections



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.live5oz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const todoCollection = client.db("todos").collection('todo');

        //get all todos from database
        app.get('/todos', async (req, res)=>{
            const query = {};
            const cursor = todoCollection.find(query);
            const allTodos = await cursor.toArray();
            res.send(allTodos);
        });

        //get single todos
        app.get('/todos/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const singleTodo = await todoCollection.findOne(query);
            res.send(singleTodo);
        })


        //insert new todo
        app.post('/todo', async (req, res)=>{
            const newTodo = req.body;
            const result = await todoCollection.insertOne(newTodo);
            res.send(result);
        });

        // delete api
        app.delete('/todos/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await todoCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{
        // type something
    }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("Welcome to Todo Server");
  });
  
  app.listen(port, () => {
    console.log("Listening to the PORT: ", port);
  });