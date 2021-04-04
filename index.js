var express = require('express')
var app = express()

app.get('/',(req,res)=>{
    res.send("Hello from heruko")
})

app.listen(process.env.PORT || 5000);