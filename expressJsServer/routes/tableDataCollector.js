const express = require('express');
const router = express.Router();
const configParam = require("../../configParams1");
const mongojs = require('mongojs');
const db = mongojs('mongodb://'+originIP+'/CraftAir');
var multer = require('multer');
const configParam = require("../../configParams1");



/*var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/CraftAir');
var conn = mongoose.connection;*/
/*var mongo = require('mongodb');
var db1 = new mongo.Db('CraftAir', new mongo.Server("127.0.0.1", 27017));
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
Grid.mongo = mongo;//mongoose.mongo;
var gfs = Grid(db1,mongo);*/
var mongoose = require('mongoose');
mongoose.connect('mongodb://'+originIP+'/CraftAir');
var conn = mongoose.connection;
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);




console.log("DB");
console.log(db);

function validateOrigin(url){
    try{
    url = url.substring(url.indexOf("//")+2);
    if(url.lastIndexOf(":")>=0)
        url = url.substring(0,url.lastIndexOf(":"));

    var originIP = configParam.PARAMS.serverIP;
    //var originDevPort = configParam.PARAMS.angularDevPort;
    //var originProdPort = configParam.PARAMS.angularProductionPort;
    /*if(String(url).indexOf("localhost")>0)
        originIP="localhost";*/
    var currentDevURL = originIP;//+":"+originDevPort;
    var currentProdURL = originIP;//+":"+originProdPort;
    /*console.log("Dev : ",currentDevURL);
    console.log("Prod : ",currentProdURL);
    console.log("URL : ",url);*/
    if((url.indexOf(currentDevURL)>=0)||(url.indexOf(currentProdURL)>=0))
        return true;
    else
        return false;
    }
    catch(e)
    {
        return false;
    }
}



var storage_disk = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        console.log("IN desst diskstorage");
        cb(null, './temp/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        console.log("IN filename diskstorage");
        console.log(JSON.stringify(file));
        //cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        cb(null, file.originalname);
    }
});


/*var storage_gfs = GridFsStorage({
    gfs : gfs,
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    },
    /** With gridfs we can store aditional meta-data along with the file **
    metadata: function(req, file, cb) {
        cb(null, { originalname: file.originalname });
    },
    root: 'ctFiles' //root name for collection to store files into
});*/
const storage_gfs = new GridFsStorage({
    url: 'mongodb://127.0.0.1:27017/CraftAir',
    file: (req, file) => {
      /*if (file.mimetype === 'image/jpeg') {
        return {
          bucketName: 'photos'
        };
      } else {
        return null;
      }*/
      var fileExt = file.originalname.split('.')[file.originalname.split('.').length -1];
      var fileNameWithNS = file.originalname.substring(0,file.originalname.lastIndexOf('.'))
      //var fileNameWithNS = file.originalname.split('.')[file.originalname.split('.').length -2];
      console.log("LEN : ",fileNameWithNS.split('_').length);
      var fileOriginalName = fileNameWithNS.substring(0,fileNameWithNS.split('_').length -2);//fileNameWithNS.split("_")[0];
      fileOriginalName = fileNameWithNS.split('_')[0];
      for(let i=1;i<fileNameWithNS.split('_').length -2;i++)
      {
          fileOriginalName = fileOriginalName+"_"+fileNameWithNS.split('_')[i];
      }
      var prodMgr = fileNameWithNS.split('_')[fileNameWithNS.split('_').length -2];//fileNameWithNS.split("_")[1];
      var orgID = fileNameWithNS.split('_')[fileNameWithNS.split('_').length -1];//fileNameWithNS.split("_")[2];
      console.log(fileOriginalName);
      var bucketName = prodMgr+"."+orgID+".uploads";
      console.log("prodMgr NAME ",prodMgr);
      console.log("orgID NAME ",orgID);
      console.log("BUCKET NAME ",bucketName);
      req.on('close', function (err){
        console.log("CLOSING REQZ");
      });
      return {
        filename: fileOriginalName+"."+fileExt, //'file_' + Date.now(),
        bucketName: bucketName //'uploads'
      };
    }
  });

var upload = multer({ //multer settings
    storage: storage_gfs,
    /*fileFilter: function (req, file, cb) {
        req.on('close', function (err){
            console.log("CLOSING MUL");
         });    
    }*/
}).single('file');

router.post('/upload', function(req, res) {
    //console.log(req);
    req.on('close', function (err){
        console.log("CLOSING REQ");
     });
    upload(req,res,function(err){
        console.log("FILE");
        console.log(req.file);
        req.on('close', function (err){
            console.log("CLOSING REQ1");
         });
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json(req.file);
    });
});

router.post('/deleteUploaded', function(req, res) {
    console.log(req.body);
    console.log(" DELETING ",req.body.fileID);
    console.log("NS",req.body.namespace);
    var options={//filename:req.body.filename,
        //_id:req.body.fileID,
        filename:req.body.filename,
    root: req.body.namespace,//'uploads',
    mode: 'w'};
    console.log("BEFORE");
    //console.log(gfs.collection('uploads'));
    console.log("AFTER");
    gfs.exist(options, function (err, found) {
        if (err) return handleError(err);
        found ? console.log('File exists') : console.log('File does not exist');
    });
                /*gfs.files.find(options).toArray(function(err, files){
                    if(!files || files.length === 0){
                        return res.status(404).json({
                            responseCode: 1,
                            responseMessage: "error"
                        });
                    }
                    /** create read stream *
                    var readstream = gfs.createReadStream({
                        filename: "file_1509457788981",
                        root: "uploads"
                    });
                    /** set the proper content type *
                    res.set('Content-Type', files[0].contentType)
                    /** return response *
                    return readstream.pipe(res);
                });*/

    gfs.remove(options, function (err, gridStore) {
        if (err) {
            console.log(err);
            return handleError(err);}
        console.log('success');
        res.json({error_code:0,err_desc:null})
    });
});

router.post('/readUploadedImageFile', function(req, res) {
    //console.log("IN READ UPLOADED FILE...");
    //console.log(req);
    let collNS= req.body.namespace;
    let fileName= req.body.filename;
        /*gfs.files.find(options).toArray(function(err, files){
            if(!files || files.length === 0){
                return res.status(404).json({
                    responseCode: 1,
                    responseMessage: "error"
                });
            }*/
            ///////////////////////////////////////////////////////////////////////////
                        /** create read stream */
                        /*var readstream = gfs.createReadStream({
                            filename: "middle_east_business_news_media.jpg",
                            root: "CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.uploads"
                        });8
                        /** set the proper content type *
                        res.set('Content-Type', files[0].contentType)
                        /** return response *
                        return readstream.pipe(res);*/
            ///////////////////////////////////////////////////////////////////////////
            var readstream = gfs.createReadStream({
                filename: fileName,
                root: collNS
            })
            const bufs = [];
            readstream.on('data', function (chunk) {
                bufs.push(chunk);
              });
            readstream.on('end', function () {
            const fbuf = Buffer.concat(bufs);
            const base64 = fbuf.toString('base64');
            //console.log(base64);
            res.send('data:image/png;base64,'+base64);
            });
            //return readstream.pipe(res);
            //res.send(bufs);
        //});
});

router.get('/dataForCollectionTable', function (req, res, next) {
    //console.log(req.params("limit"));
    //console.log(">>>>>>>>>>>>>>>>>>>>>>>");
    //console.log(req.query.limit);
    //var ns ="CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.CraftAirOrgLDAPSMTP";
    var ns= String(req.query.namespace);
    //console.log("NS : "+ns);
    let temp={};
    try{
        if((String(req.query.start)!="undefined")&&(String(req.query.current)!="undefined"))
        {
           // console.log("Start and End Found");
            let startDat = req.query.start;
            let endDat = req.query.current;
            db[ns].find({"accessTime":{'$gte':String(startDat),'$lte':String(endDat)}}).sort({"accessTime":-1},function(err,users){
                var temp = {};
                temp["data"] = users;
                if(err){
                    res.send(err);
                }
                res.json(temp);
            });
        }
        else if((String(req.query.limit)!="undefined")&&(Number(req.query.limit)>0))
        {   
            db[ns].find().limit(Number(req.query.limit)).sort({"date":-1},function(err,users){
                var temp = {};
                temp["data"] = users;
                if(err){
                    res.send(err);
                }
                //console.log(users);
                res.json(temp);
            });
        }
        else if(String(req.query.date)!="undefined")
        {
            let dat = req.query.date;
            db[ns].find({"date":{'$lt':String(dat)}}).sort({"date":-1},function(err,users){
                var temp = {};
                temp["data"] = users;
                temp["fromDate"] = dat;
                if(err){
                    res.send(err);
                }
                //console.log(users);
                res.json(temp);
            });
        }
    }
    catch(e)
    {
        //res.send(e);
        console.log("Exception in GET dataForCollectionTable...");
        console.log(e);
    }
});

router.post('/dataForCollectionTable', function (req, res, next) {
    //console.log(req.params("limit"));
    console.log("Origin : ",req.get("origin"));
    var result =validateOrigin(req.get("origin"))
    console.log("Origin Allowed : ",result);
    if(result)
    {
    //console.log("host : ",req.get("host")," ",req.socket.remoteAddress," ",req.socket.remotePort);
    //console.log("In Express Post...")
    //console.log(">>>>>>>>>>>>>>>>>>>>>>>");
    //console.log(req.body);
    //var ns ="CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.CraftAirOrgLDAPSMTP";
    var ns= String(req.body.namespace);
    //console.log("NS : "+ns);
    let projection = {};
    if(String(req.body.projectQuery)!="undefined")
        projection = req.body.projectQuery;
    let dataQ={};
    dataQ = req.body.dataQuery;

    let temp={};
    try{
        
        if(String(req.body.date)!="undefined")
        {
            //console.log("In date");
            let dat = req.body.date;
            innerDateRange={};
            innerDateRange["$lt"]=String(dat);
            dataQ["date"]=innerDateRange;
            //console.log("Query : ");
            //console.log(dataQ);
            //db[ns].find({"date":{'$lt':String(dat)}}).sort({"date":-1},function(err,users){
            if((String(ns)!="")&&(String(ns)!="undefined")&&(String(ns)!="null"))
            {
            db[ns].find(dataQ,projection).sort({"date":-1},function(err,users){
                var temp = {};
                //console.log(users);
                temp["data"] = users;
                temp["fromDate"] = dat;
                if(err){
                    res.send(err);
                }
                //console.log(temp);
                res.json(temp);
            });
            }
        }
        else //if((String(req.body.limit)!="undefined")&&(Number(req.body.limit)>0))
        {   
            //console.log("Query in limit: ");
            //console.log(dataQ);
            let limit = 10000;
            if((String(req.body.limit)!="undefined")&&(Number(req.body.limit)>0))
                limit = req.body.limit
            let startDat = "";
            innerDateRange={};
            if(String(req.body.start)!="undefined")
            {
                startDat = req.body.start;
                innerDateRange["$gte"]=String(startDat);
            }
            let endDat = "";
            if(String(req.body.current)!="undefined")
            {
                endDat = req.body.current;
                innerDateRange["$lte"]=String(endDat);
            }
            if((startDat!="")||(endDat!=""))
            {
                dataQ["accessTime"]=innerDateRange;
            }
            if((String(ns)!="")&&(String(ns)!="undefined")&&(String(ns)!="null"))
            {
            db[ns].find(dataQ,projection).limit(Number(limit)).sort({"date":-1},function(err,users){
                var temp = {};
                temp["data"] = users;
                if(err){
                    res.send(err);
                }
                //console.log(users);
                res.json(temp);
            });
            }
        }
    }
    catch(e)
    {
        //res.send(e);
        console.log("Exception in Post dataForCollectionTable...");
        console.log(e);
    }
}
});



router.post('/dataForApStats', function (req, res, next) {
    //console.log(req.params("limit"));
    console.log("Origin : ",req.get("origin"));
    var result =validateOrigin(req.get("origin"))
    console.log("Origin Allowed : ",result);
    if(result)
    {
    //console.log("host : ",req.get("host")," ",req.socket.remoteAddress," ",req.socket.remotePort);
    //console.log("In Express Post...")
    //console.log(">>>>>>>>>>>>>>>>>>>>>>>");
    //console.log(req.body);
    //var ns ="CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.CraftAirOrgLDAPSMTP";
    var ns= String(req.body.namespace);
    console.log("NS : "+ns);
    let projection = {};
    if(String(req.body.projectQuery)!="undefined")
        projection = req.body.projectQuery;
    let dataQ={};
    dataQ = req.body.dataQuery;

    let temp={};
    try{
        
            //console.log("Query in limit: ");
            //console.log(dataQ);
            let limit = 10000;
            if((String(req.body.limit)!="undefined")&&(Number(req.body.limit)>0))
                limit = req.body.limit
            let startDat = "";
            innerDateRange={};
            if(String(req.body.start)!="undefined")
            {
                startDat = req.body.start;
                let tempNum = new Date(startDat).getTime();

                innerDateRange["$gte"]=String(new Date(tempNum-5000).toISOString());
            }
            let endDat = "";
            if(String(req.body.current)!="undefined")
            {
                endDat = req.body.current;
                innerDateRange["$lte"]=String(endDat);
            }
            if((startDat!="")||(endDat!=""))
            {
                dataQ["date"]=innerDateRange;
            }
            if((String(ns)!="")&&(String(ns)!="undefined")&&(String(ns)!="null"))
            {
                console.log("dataQ");
                console.log(dataQ);
            db[ns].find(dataQ,projection).limit(Number(limit)).sort({"date":-1},function(err,users){
                var temp = {};
                temp["data"] = users;
                if(err){
                    res.send(err);
                }
                //console.log(users);
                res.json(temp);
            });
            }
        
    }
    catch(e)
    {
        //res.send(e);
        console.log("Exception in Post dataForCollectionTable...");
        console.log(e);
    }
}
});

router.post('/getCount', function (req, res, next) {
    //console.log("in getUserCount...");
    //console.log(req.body);
    console.log("Origin : ",req.get("origin"));
 var result =validateOrigin(req.get("origin"))
    console.log("Origin Allowed : ",result);
    if(result)
    {   
let temp={};
    try{
        var ns= String(req.body.namespace);
        //console.log("NS : "+ns);
        let dataQ={};
        dataQ = req.body.dataQuery;
        let key = req.body.distinctKey;
            let startDat = "";
            innerDateRange={};
            if(String(req.body.start)!="undefined")
                startDat = req.body.start;
            let endDat = "";
            if(String(req.body.current)!="undefined")
                endDat = req.body.current;
            if((startDat!="")&&(endDat!=""))
            {
                innerDateRange["$gte"]=String(startDat);
                innerDateRange["$lte"]=String(endDat);
                dataQ["accessTime"]=innerDateRange;
            }
            //console.log("Query : ");
            //console.log(dataQ);
            //db[ns].find({"accessTime":{'$gte':String(startDat),'$lte':String(endDat)}}).sort({"accessTime":-1},function(err,users){
            if((String(ns)!="")&&(String(ns)!="undefined")&&(String(ns)!="null"))
            {
            db[ns].distinct(key,dataQ,function(err,users){
                var temp = {};
                temp["data"] = users;
                //console.log(temp);
                if(err){
                    res.send(err);
                }
                res.json(temp);
            });
            }
        
    }
    catch(e)
    {
        console.log("Exception in getUserCount...");
        console.log(e);
    }
}
});

router.post('/getUsedData', function (req, res, next) {
    console.log("in getUsedData...");
    console.log(req.body);
    console.log("Origin : ",req.get("origin"));
 var result =validateOrigin(req.get("origin"))
    console.log("Origin Allowed : ",result);
    if(result)
    {   
let temp={};
    try{
        var ns= String(req.body.namespace);
        console.log("NS : "+ns);
        let dataQ={};
        dataQ = req.body.dataQuery;
            let startDat = "";
            innerDateRange={};
            if(String(req.body.start)!="undefined")
                startDat = req.body.start;
            let endDat = "";
            if(String(req.body.current)!="undefined")
                endDat = req.body.current;
            if((startDat!="")&&(endDat!=""))
            {
                innerDateRange["$gte"]=String(startDat);
                innerDateRange["$lte"]=String(endDat);
                dataQ["lastUpdateTime"]=innerDateRange;
            }

            console.log("Query : ");
            console.log(dataQ);
            if((String(ns)!="")&&(String(ns)!="undefined")&&(String(ns)!="null"))
            {
            db[ns].aggregate([
                {"$match":dataQ},
                { 
                    "$group" : {
                        "_id" : { "sessionID" : "$sessionID" }, 
                        "value" : {
                            "$max" : { "$divide" : [ { "$add" : [ "$inputOctets", "$outputOctets" ] }, 1048576 ] } 
                            } 
                        } 
                }
            ],{allowDiskUse: true},function(err,output){
                if(err){
                    res.send(err);
                }
                res.json(output);
            });
            }
        
    }
    catch(e)
    {
        console.log("Exception in getUsedData...");
        console.log(e);
    }
}
});

router.post('/getAggregatedData', function (req, res, next) {
    console.log("in getAggregatedData...");
    console.log(req.body);
    console.log("Origin : ",req.get("origin"));
var result =validateOrigin(req.get("origin"))
    console.log("Origin Allowed : ",result);
    if(result)
    {    
let temp={};
    try{
        var ns= String(req.body.namespace);
        console.log("NS : "+ns);
        let dataQ={};
        dataQ = req.body.dataQuery;
            
            if((String(ns)!="")&&(String(ns)!="undefined")&&(String(ns)!="null"))
            {
                /*let temp = dataQ[0];
                let orgID="b9a49492204411e79954b4b52f34dbc7";
                if(String(temp["$match"])!="undefined")
                {
                    if(ns.indexOf(orgID)!=-1)
                    delete dataQ[0]["$match"]["date"];
                }*/
                console.log("Query : ");
                console.log(dataQ);
                console.log(JSON.stringify(dataQ));
            db[ns].aggregate(dataQ,{allowDiskUse: true},function(err,output){
                var temp = {};

                ///IF WE DO THIS THING AT BROWSER SIDE IT MAY HANG FOR LARGER AMOUNT OF DATA
                output.forEach(function(element) {
                    if(element.series!=undefined)
                    {
                        if(req.body.filter==undefined)
                        {
                            if(Array.isArray(element.series))
                            {
                                //console.log("ROUNDING.....");
                                element.series.forEach(function(inner){
                                ///ROUNDING OF DATE TO NEAREST 1 MINUTE
                                var coeff = 1000 * 60 * 1;
                                var date = new Date(inner.name);  //or use any other date
                                var rounded = new Date(Math.round(date.getTime() / coeff) * coeff)
                                inner["name"]=rounded;
                                if(inner.value==undefined || inner.value=="")
                                inner["value"]=0;
                                },this);
                            }
                        }
                    }
                }, this);
                //console.log(JSON.stringify(output));
                temp["data"] = output;
                if(err){
                    res.send(err);
                }
                res.json(temp);
            });
            }
    }
    catch(e)
    {
        console.log("Exception in getUsedData...");
        console.log(e);
    }
}
});

router.post('/getAggregatedDataForUpTime', function (req, res, next) {
    console.log("in getAggregatedDataForUpTime...");
    console.log(req.body);
    console.log("Origin : ",req.get("origin"));
var result =validateOrigin(req.get("origin"))
    console.log("Origin Allowed : ",result);
    if(result)
    {    
let temp={};
    try{
        var ns= String(req.body.namespace);
        console.log("NS : "+ns);
        let dataQ={};
        dataQ = req.body.dataQuery;
        startDate = req.body.startDate;
        endDate = req.body.endDate;
            
            if((String(ns)!="")&&(String(ns)!="undefined")&&(String(ns)!="null"))
            {
                /*let temp = dataQ[0];
                let orgID="b9a49492204411e79954b4b52f34dbc7";
                if(String(temp["$match"])!="undefined")
                {
                    if(ns.indexOf(orgID)!=-1)
                    delete dataQ[0]["$match"]["date"];
                }*/
                console.log("Query : ");
                console.log(dataQ);
                console.log(JSON.stringify(dataQ));
            db[ns].aggregate(dataQ,{allowDiskUse: true},function(err,output){
                var temp = {};
                ///IF WE DO THIS THING AT BROWSER SIDE IT MAY HANG FOR LARGER AMOUNT OF DATA
                let objStore={};
                let currObj={};
                output.forEach(function(element) {
                    currObj=element;
                    if(element.series!=undefined)
                    {
                        if(Array.isArray(element.series))
                        {
                            element.series.forEach(function(inner){
                            var date = new Date(inner);
                            let time = String(date.getFullYear())+String(date.getMonth())+String(date.getDate())+String(date.getHours())+String(date.getMinutes());
                            //console.log(time);
                            //console.log(objStore);
                            if(objStore==undefined)
                                objStore={};
                            objStore[time]=1;
                            },this);
                            
                        }
                    }
                },this);


                let uptimeData=[];
                console.log(new Date());
                  let num =Number(new Date(endDate).getTime())-Number(new Date(startDate).getTime());
                  num= Math.floor(num/(1000*60)); ///Mintues
                  console.log(num);
                  let inc=300000; //5 Mins
                  if(num<=1440)///For a Day
                  {
                    //inc=60000;
                    ///for each minute
                  }
                  else
                  {
                    inc=900000;///15 Mins
                    //for each 3 mitues
                  }
                  let startTime = Number(new Date(startDate).getTime());
                  let endTime= Number(new Date(endDate).getTime());
                  let tempSeries=[];
                  while(startTime<endTime)
                  {
                    let date = new Date(startTime);
                    let time = String(date.getFullYear())+String(date.getMonth())+String(date.getDate())+String(date.getHours());
                    let min = Number(date.getMinutes());
                    if((objStore[time+String(min)]==undefined)&&
                        (objStore[time+String(min-1)]==undefined)&&
                        (objStore[time+String(min+1)]==undefined)&&
                        (objStore[time+String(min-2)]==undefined)&&
                        (objStore[time+String(min+2)]==undefined))
                    {
                      tempSeries.push({
                        "name":new Date(startTime).toISOString(),
                        "value":0
                      });
                    }
                    else
                    {
                      tempSeries.push({
                        "name":new Date(startTime).toISOString(),
                        "value":1
                      });
                    }
                    startTime = startTime+inc;
                  }
                  if(Object.keys(currObj).length>0)
                  {
                    currObj["series"]=tempSeries;
                    uptimeData=[currObj];
                  }
                  else
                  {
                    currObj["name"]="unknown";
                    currObj["series"]=tempSeries;
                    uptimeData=[currObj];
                    //uptimeData=[];
                  }


                //console.log(JSON.stringify(output));
                temp["data"] = uptimeData;
                if(err){
                    res.send(err);
                }
                res.json(temp);
            });
            }
    }
    catch(e)
    {
        console.log("Exception in getUsedData...");
        console.log(e);
    }
}
});

router.post('/createView', function (req, res, next) {
    
    let temp={};
    let collName="CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.DashboardAssetData";
    let viewName="CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.dashboardApSnrView";
    try{ 
        
        /*db.runCommand( { create: viewName, viewOn: collName, pipeline: [] },function(err,output){
                if(err){
                    console.log("In createView err ... ");
                    res.send(err);
                }
                console.log("In createView ouput ...");
                res.json(output);
            } );*/
        
    }
    catch(e)
    {
        //res.send(e);
        console.log("Exception in Post dataForCollectionTable...");
        console.log(e);
    }
});

module.exports = router;
