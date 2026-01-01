const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json())
const DATA_FILE = './data.json';

function getUsers(){
    return JSON.parse(fs.readFileSync(DATA_FILE));
}
function saveUsers(data){
    fs.writeFileSync(DATA_FILE, JSON.stringify(data,null,2))
}

app.post('/users',(req,res)=>{
    const users =getUsers();
    const newUser={
        id: Date.now(),
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };
    users.push(newUser);
    saveUsers(users);
    res.status(201).json(newUser);
});

app.get('/users',(req,res)=>{
    res.json(getUsers());
})
app.get('/users/:id',(req,res)=>{
    const users = getUsers();
    const user = users.find(u=> u.id==req.params.id);
    if(!user){
        res.status(404).json({message:'user not found!'});
    }
    res.json(user);
});

app.put('/users/:id',(req,res)=>{
    const users = getUsers();
    const index = users.findIndex(u=> u.id==req.params.id);
    if(index=== -1){
        return res.status(404).json({message:'user not found'});
    }
    users[index]={
        ...users[index],
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };
    saveUsers(users);
    res.json(users[index]);
});

app.delete('/users/:id',(req,res)=>{
    let users = getUsers();
    users = users.filter(u=> u.id != req.params.id);
    saveUsers(users);
    res.json({message:'user deleted'});
});

app.listen(4000,()=>{
    console.log('server running on http://localhost:4000')
})