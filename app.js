/**
 * Created by rajith on 2/25/17.
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;
const users = require('./routes/users');
const config = require('./config/database');

mongoose.connect(config.database);
mongoose.connection.on("connected",()=>{
    console.log("connected to  " + config.database);
})

mongoose.connection.on("error",(err)=>{
    console.log("error to connect  " + err);
})

app.use(cors());
app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.use('/users',users);


app.get('/',function(req,res){
   res.send('index page');

});


app.listen(port, function(){
    console.log("server started on port"+port);
});
