/**
 * Created by rajith on 2/25/17.
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
var request = require("request");
const User = require('../models/users');
const SM = require('../models/socialmedia');
const config = require('../config/database');


//register

router.post('/register',function (req,res) {
    var newUser = new User({
        name : req.body.name,
        email : req.body.email,
        username : req.body.username,
        password : req.body.password

    });
    
    User.addUser(newUser,function (err,user) {
        if (err){
            res.json({success:false,msg:"Failed to register User"});
        }else{
            res.json({success:true,msg:"Successfully registered User"});
        }
    })

});

//authenticate
router.post('/authenticate',function (req,res) {

    const  email = req.body.email;
    const  password = req.body.password;


    User.getUserByemail(email,function (err,user) {
        if(err) throw err;

        if(!user){
            res.json({success:false,msg:"No User Found"});
        }

        User.comparePassword(password,user.password,function (err,isMatch) {

            if (err) throw err;
            if(isMatch){
                const token = jwt.sign(user,config.secret,{
                    expiresIn:604800
                });
                res.json({
                    success:true,
                    token:"JWT "+ token,
                    user:{
                        id:user._id,
                        name:user.name,
                        email:user.email,
                        username:user.username
                    }});

            }else{
                res.json({success:false,msg:"Password Does not match"});

            }
        })

    })

});



router.post('/checkid',function (req,res) {

    console.log(req.body.userid);
    SM.checkId(req.body.id,req.body.provider,function (err,match) {
        if (err) throw err;
        if (match){

            var params = { method: 'POST',
                url: 'https://travelwithme.auth0.com/oauth/token',
                headers: { 'content-type': 'application/json' },
                body:
                    { client_id: 'iYgyLbUZs2bJVVwmq8AyTH2pau2ob7fU',
                        client_secret: 'AhATNg_4YF1_VXEyBsYpClA7jYoK6Aj_sgx7xio0mHP3Ul0QpBJVvJyCKRrevZNZ',
                        audience: 'https://travelwithme.auth0.com/api/v2/',
                        grant_type: 'client_credentials' },
                json: true };

            request(params, function(error, response, body) {
                //this is your Auth0 access_token

                const actoken = body.access_token;
                const type = body.token_type;


                const opts= {
                    method: 'GET',
                        url: 'https://travelwithme.auth0.com/api/v2/users/'+req.body.userid,
                        headers: {Authorization:type+" "+actoken

                        }
                };

                request(opts, function(error, response, body){
                    //this is the access_token necesarry to use the external API
                    console.log(body);

            });


        });



        }

    })

});




//profile
router.get('/profile',passport.authenticate('jwt',{session:false}),function (req,res) {
    res.json({user:req.user});

});

//validate
router.get('/validate',function (req,res) {

    res.send('validate');

});

module.exports = router;