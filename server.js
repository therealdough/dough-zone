const express=require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
const cors=require('cors');

const app=express(); const PORT=3000;
app.use(bodyParser.json()); app.use(cors());

const USERS_FILE='users.json', BALANCES_FILE='balances.json';
if(!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE,'{}');
if(!fs.existsSync(BALANCES_FILE)) fs.writeFileSync(BALANCES_FILE,'{}');

let users=JSON.parse(fs.readFileSync(USERS_FILE));
let balances=JSON.parse(fs.readFileSync(BALANCES_FILE));

app.post('/register',(req,res)=>{
  const {username,password}=req.body;
  if(users[username]) return res.status(400).json({message:'User exists'});
  users[username]={password}; fs.writeFileSync(USERS_FILE,JSON.stringify(users,null,2));
  balances[username]=1000; fs.writeFileSync(BALANCES_FILE,JSON.stringify(balances,null,2));
  res.json({message:'Registered successfully'});
});

app.post('/login',(req,res)=>{
  const {username,password}=req.body;
  if(!users[username]||users[username].password!==password) return res.status(400).json({message:'Invalid username/password'});
  res.json({message:'Login successful'});
});

app.get('/balance/:username',(req,res)=>{
  const username=req.params.username; res.json({balance:balances[username]??1000});
});
app.post('/balance/:username',(req,res)=>{
  const username=req.params.username;
  balances[username]=req.body.amount; fs.writeFileSync(BALANCES_FILE,JSON.stringify(balances,null,2));
  res.json({balance:balances[username]});
});

app.listen(PORT,()=>console.log(`Server running on http://localhost:${PORT}`));
