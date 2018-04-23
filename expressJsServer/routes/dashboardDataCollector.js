const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs('CraftAir');

router.get('/dataForDashboard', function (req, res, next) {
    //console.log(req.params("limit"));
    console.log(req.query.limit);
    //var ns ="CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.CraftAirOrgLDAPSMTP";
    var ns= String(req.query.namespace);
    console.log("NS : "+ns);
    let temp={};
    try{
        if(String(req.query.limit)!="undefined")
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
        res.send(e);
    }
});

router.post('/dataForDashboard', function (req, res, next) {
    //console.log(req.params("limit"));
    console.log("In Express Post...")
    console.log(">>>>>>>>>>>>>>>>>>>>>>>");
    console.log(req.body);
    //var ns ="CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.CraftAirOrgLDAPSMTP";
    var ns= String(req.body.namespace);
    console.log("NS : "+ns);
    let dataQ={};
    dataQ = req.body.dataQuery;

    let temp={};
    try{
        if((String(req.body.start)!="undefined")&&(String(req.body.current)!="undefined"))
        {
            console.log("Start and End Found");
            let startDat = req.body.start;
            let endDat = req.body.current;
            innerDateRange={};
            innerDateRange["$gte"]=String(startDat);
            innerDateRange["$lte"]=String(endDat);
            dataQ["accessTime"]=innerDateRange;
            console.log("Query : ");
            console.log(dataQ);
            //db[ns].find({"accessTime":{'$gte':String(startDat),'$lte':String(endDat)}}).sort({"accessTime":-1},function(err,users){
            db[ns].find(dataQ).sort({"accessTime":-1},function(err,users){
                var temp = {};
                temp["data"] = users;
                if(err){
                    res.send(err);
                }
                res.json(temp);
            });
        }
        else if((String(req.body.limit)!="undefined")&&(Number(req.body.limit)>0))
        {   
            console.log("Query in limit: ");
            console.log(dataQ);
            db[ns].find(dataQ).limit(Number(req.body.limit)).sort({"date":-1},function(err,users){
                var temp = {};
                temp["data"] = users;
                if(err){
                    res.send(err);
                }
                //console.log(users);
                res.json(temp);
            });
        }
        else if(String(req.body.date)!="undefined")
        {
            console.log("In date");
            let dat = req.body.date;
            innerDateRange={};
            innerDateRange["$lt"]=String(dat);
            dataQ["date"]=innerDateRange;
            console.log("Query : ");
            console.log(dataQ);
            //db[ns].find({"date":{'$lt':String(dat)}}).sort({"date":-1},function(err,users){
            db[ns].find(dataQ).sort({"date":-1},function(err,users){
                var temp = {};
                console.log(users);
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
        res.send(e);
    }
});


module.exports = router;