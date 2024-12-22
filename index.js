const mongoose = require('mongoose')
const express = require('express');
var methodOverride = require('method-override')
const Chat = require('./models/chats');
const app = express();
const port = 3000;
app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs')


main().then(()=>{
    console.log('connected to DB');
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/chating');
}



// app.get('/', (req, res) => {
//     res.send('works')
// })

app.get('/chat/new',(req,res)=>{
res.render('new.ejs')

})

app.post('/addchat', (req,res)=>{
let {from,to,msg} = req.body;
let newChat = new Chat({
    from:from,
    to:to,
    msg:msg,
    created_at:new Date()
})

newChat.save().then((res)=>{
    console.log('Chat saved');
}).catch((err)=>{
    console.log(err);
})
res.redirect('/chat/new')
})


app.get('/allChats',async (req, res) => {
    let chats =await Chat.find()
    // console.log(chats);
    res.render('index.ejs',{chats})
})


app.get('/chat/:id/edit',async(req,res)=>{
    let {id}=req.params;
    let chat=await Chat.findById(id)
    res.render('edit.ejs',{chat})
    
    })

app.put('/chat/:id',async(req,res)=>{
    let {id}=req.params
    let {to,from,msg}=req.body;
    let updatechat=await Chat.findByIdAndUpdate(id,{to,from,msg},{runValidators:true,new:true});
    console.log(updatechat);
    res.redirect('/allChats')
    
})

app.delete('/chat/:id',async(req,res)=>{
    let {id}=req.params;
   let deletechat=await Chat.findByIdAndDelete(id)
   console.log(deletechat)
    res.redirect('/allChats')
    
    })

app.listen(port, () => {
    console.log('Server Running');

})

