const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
var jwt = require('jsonwebtoken');
const auth = mongojs('userManagement',['credentials']);

router.post('/', function (req, res, next) {
    auth.credentials.findOne({userId:req.body.userId,password:req.body.password},function(err,credentials){
     if (err){
          return res.status(500).json({
              title: 'An error occured ',
              error: err
          });
      }
    if(!credentials){
        return res.status(500).json({
            title: 'Login failed',
            error:{message:'Invalid login credentials'}
        });
     }
    
var token = jwt.sign({credentials:credentials},'secret',{expiresIn:7200});
res.status(200).json({
    message: 'Successfully logged in',
    token:token,
    CredentialsId:credentials._id
});
});
});

module.exports = router;
