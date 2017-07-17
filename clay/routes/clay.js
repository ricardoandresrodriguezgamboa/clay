var express = require('express');
var router = express.Router();
var config=require('../mod/config');
var crude=require('../mod/crude');
f = require('util').format;


var user = encodeURIComponent(config.dataBase.admin.user);
var password = encodeURIComponent(config.dataBase.admin.pwd);
var authMechanism = 'DEFAULT';
var dbName=config.dataBase.name;
var dbUrl = f('mongodb://%s:%s@localhost:27017/'+dbName+'?authMechanism=%s', user, password, authMechanism);
var collection='users';

router.get('/',(req,res)=>{
	if(req.session.userName==undefined){
		res.render('clayLogin');
	}else{
		res.render('clayPanel');
	}
}).post('/',(req,res)=>{
	crude.connection(dbUrl,(db)=>{
		crude.findDocuments(db,collection,{userName:req.body.username, password:req.body.password},{_id:0,password:0},(docs)=>{
			if(docs.length==0){
				res.render('clayLogin');
			}
			else{
				
				if(req.session){
					req.session.userName=docs[0].userName;
					res.render('clayPanel');
					console.log(req.session);
				}
				else{
					res.send('Pleas tray again later');
				}
			}
			
			db.close();
		});
	});
	
});

module.exports=router;