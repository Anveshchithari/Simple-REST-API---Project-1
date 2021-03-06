var express= require('express');
var app=express();

let server=require('./server.js');
let middleware=require('./middleware.js');

const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

const MongoClient=require('mongodb').MongoClient;

const url='mongodb://127.0.0.1:27017';
const dbName='HospitalManagement'
let db
MongoClient.connect(url,{useUnifiedTopology: true},(err,client)=>{
    if (err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database: ${dbName}`)
});

//Read Hospital Details    //OK
app.get('/hospitaldetails',middleware.checkToken,function(req,res){
    console.log("Fetching data from Hospital Collection")
    var data=db.collection('Hospital').find().toArray().then(result=> res.json(result));
});

//Read ventilator Details   //OK
app.get('/ventilatordetails',middleware.checkToken,function(req,res){
    console.log("Reading data from Ventilator Collection");
    var data=db.collection('Ventilators').find().toArray().then(result=> res.json(result));
});

//Search Ventilator By Status   //OK
app.post('/searchventbystatus',middleware.checkToken,function(req,res){
    var Status=req.body.Status;
    console.log(Status);
    console.log("Searching Ventilators By Status");
    var data=db.collection('Ventilators').find({"Status": Status}).toArray().then(result=> res.json(result));

});

//Search Ventilator By HospitalName  //OK
app.post('/searchventbyhospname',middleware.checkToken,function(req,res){
    var name=req.body.name;
    console.log("Searching Ventilators By HospName");
    var data=db.collection('Ventilators').find({"name":new RegExp(name,'i')}).toArray().then(result=> res.json(result));
});

//Search Hospital By Name   //OK
app.post('/searchhospbyname',middleware.checkToken,function(req,res){
    var name=req.body.name;
    console.log("Searching Hospital By Name");
    var data=db.collection('Hospital').find({"name":new RegExp(name,'i')}).toArray().then(result=> res.json(result));
});

//Update Ventilator Details  //OK
app.put('/updateventilator',middleware.checkToken,(req,res)=>{
    var ventid={"VentilatorId":req.body.VentilatorId};
    console.log(ventid);
    var newvalue={$set:{"Status":req.body.Status}};
    console.log(newvalue);
    db.collection('Ventilators').updateOne(ventid,newvalue,function(err,result){
        res.json("Ventilator Updated");
        console.log("Updated")
        if(err) throw err;
    });
});

//Add Ventilator //OK
app.post('/addventilator',middleware.checkToken,function(req,res){
    var HId=req.body.hId;
    var VId=req.body.VentilatorId;
    var Status=req.body.Status;
    var Name=req.body.name;
    var item={hId:HId,VentilatorId:VId,Status:Status,name:Name};
    db.collection('Ventilators').insertOne(item,function(err,result){
        res.json('Item Inserted');
    });
});

//Delete Ventilator By Id //OK
app.delete('/deleteventbyid',middleware.checkToken,function(req,res){
    var Ventid=req.body.VentelatorId;
    console.log(Ventid);
    var VId={VId:Ventid}
    db.collection('Ventilators').deleteOne(VId,function(err,result){
        if(err) throw err;
        res.json("1 Ventilator Deleted");
     });
});
app.listen(1250);