/*this archive will be a module  of functions to allow acces to a mongo db and do CRUD Actions*/

/*
	dbUrl : is the database URL
	callback: is a function
	db: is the database
	coll: is the collection to be manipulated
	key: is an object {status:value} to find a doc to be manipulated
	doc: is a doc to be inserted
	projection: is a object {status1:0,status2:0...} to filter docs in the findDocuments method
	match: is an object to match docs {$match:{status:'value'}}
	group. is an object to operate docs matched {$group:{_id:'$status',total:{$operator: '$status'}}}
*/

var MongoClient = require('mongodb').MongoClient;
var connection= function(dbUrl,callback){
	MongoClient.connect(dbUrl,(err,db)=>{
	if(err) throw err;
	console.log('data base is conected ');
	callback(db);
	});
}
var findDocuments=function(db, coll,key,projection,callback){
	var collection=db.collection(coll);
	collection.find(key,projection).toArray(function(err,docs){
		if(err) throw err;
		console.log('findDocuments method has been called');
		callback(docs);
	});
}
var updateDocument=function(db,coll,key,newKey,callback){
	var collection=db.collection(coll);
	collection.updateOne(key,{$set:newKey},function(err,result){
		if(err) throw err;
		if(result.result.nModified===1){
			console.log('the doc was updated');
		}else if(result.result.nModified===0){
			console.log('the doc was not updated');
		}
		callback(result);
	});
}
var insertDocument=function(db,coll,doc,callback){
	var collection=db.collection(coll);
	collection.insertOne(doc,function(err,result){
		if(err) throw err;
		console.log('the doc was inserted');
		callback(result);
	});
}
var removeDocument=function(db,coll,key,callback){
	var collection=db.collection(coll);
	collection.deleteOne(key,function(err,result){
		if(err) throw err;
		console.log(result.result.n+ ' docs deleted');
		callback(result);
	});
}

var aggregateDocuments=function(db,coll,match,group,callback){
	var collection=db.collection(coll);
	collection.aggregate([match,group]).toArray(function(err,docs){
		if(err) throw err;
		console.log(docs);
		callback(docs);
	});
}
var countDocuments=function(db,coll,key,callback){
    var collection=db.collection(coll);
    collection.count(key,function(err,count){
        if(err) throw err;
        console.log(count);
        callback(count);
    });
}

module.exports={
	findDocuments,
 	removeDocument,
 	insertDocument,
 	updateDocument,
 	aggregateDocuments,
 	countDocuments,
 	connection
 };