const express = require('express');
const mongoose = require('mongoose')
const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/todo').then(() => {
    console.log('Connected to MongoDB');
}).catch((e) => {
    console.log('Failed to connect MongoDB');
})

app.use(express.urlencoded())
app.use(express.static(__dirname + '/public'))

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
})

const todo = mongoose.model("todo", todoSchema)

app.post('/new', async (req, res) => {
    if(req.body.title.length != 0){
        await new todo({
            title: req.body.title,
            description: req.body.description
        }).save()

        res.redirect('/')
    }else{
        res.redirect('/new?error=1')
    }
})

app.post('/edit', async(req, res) => {
    await todo.updateOne(
        {
            _id: req.body.id
        },
        {
            title: req.body.title,
            description: req.body.description
        }
    )
    res.redirect('/')
})

app.delete('/delete/:id', async(req, res) =>{
    await todo.deleteOne({_id: req.params.id})
    res.status(200).send('ok')
})


app.set("view engine", "ejs")

app.get('/', async(req, res) =>{
    const data = await todo.find()
    res.render('index', {data})
})

app.get('/new', (req, res) =>{
    res.render('new')
})

app.get('/edit/:id', async(req, res) =>{
    const todoData = await todo.findOne({
        _id: req.params.id
    })
    res.render('edit', {data: todoData})
})

const PORT = 8000;

app.listen(PORT, () =>{
    console.log(`Listening on port:${PORT}`);
})