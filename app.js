const express=require('express')
const app=express()
const path=require('path') 
// to read the folder 
const fs=require('fs')


app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))

app.get('/',(req,res)=>{
    fs.readdir('./hisaab',function (err,files){
        // console.log(err,files);
        // if error ata hai to error show hoga else index page render hoga index page where we have send the files 
        if(err) return res.status(500).send(err)
        res.render('index',{files:files});
    })
   
})

app.get('/create', (req,res)=>{
    res.render('create')
})
app.get('/edit/:filename', (req,res)=>{
    fs.readFile(`./hisaab/${req.params.filename}`,'utf-8',function(err,filedata){
        if(err) return res.status(500).send(err)
        res.render('edit',{filedata:filedata, filename:req.params.filename})
    })
   
})

//to see hisaab
app.get('/hisaab/:filename',(req,res)=>{
    fs.readFile(`./hisaab/${req.params.filename}`,'utf-8',function(err,filedata){
        if(err) return res.status(500).send(err)
        res.render("hisaab",{filedata,filename:req.params.filename})
    })
})

//  to delete hisaab by clicking on the dustbin button
app.get('/delete/:filename',function(req,res){
    fs.unlink(`./hisaab/${req.params.filename}`,function(err){
        if(err) return res.status(500).send(err)
        res.redirect('/');
    })
})


// to create a new hisaab on create page
app.post('/createhisaab', (req,res)=>{

    // to  find the current date
    var currentDate =new Date();
    // res.send(req.body)
    console.log(currentDate)

    //this will  give the current date of the hisaab created in date-month-year format
   console.log( `${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`)

//    here we are creating a new hisaab file with the name of date it is created on
    fs.writeFile(`./hisaab/${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}.txt`,req.body.content,function(err){
        if(err) return res.status(500).send(err)
        res.redirect('/')
 
   })
})



app.post('/update/:filename',(req,res)=>{
    //this we are updating the file here
    fs.writeFile(`./hisaab/${req.params.filename}`,req.body.content, function(err){
        if(err) return res.status(500).send(err)
        res.redirect('/')
    })
})

app.listen(3000)