
export class DashBoardDataParser
{

    constructor() {
        
    }
    getDataForMultiLineChart(rawData:any,key:string,seriesXvalue:string,seriesYvalue:string):any {
        /*console.log("Raw Data...");
        console.log(rawData);
        console.log(key);
        console.log(seriesXvalue);
        console.log(seriesYvalue);*/
        var parsedData = rawData.reduce(function(buckets,item){
                    var yVal = seriesYvalue;
                    var dataSubObjPaths = yVal.split(".");
                    var currYval:any = item[String(dataSubObjPaths[0])];
                    for(let i=1;i<dataSubObjPaths.length;i++)
                    {
                        currYval = currYval[dataSubObjPaths[i]];
                    }

                    /*console.log("yValue");
                    console.log(currYval);*/
                    if(String(buckets[item[key]]) =="undefined")
                    {
                        var temp=[];
                        //console.log(item[seriesXvalue]);
                        temp.push({"name":new Date(String(item[seriesXvalue])),"value":Number(currYval)});
                        buckets[item[key]]=temp;
                    }
                    else
                    {

                        buckets[item[key]].push({"name":new Date(item[seriesXvalue]),"value":Number(currYval)});
                    }
                return buckets;
            },{});
        /*console.log("Final DAta...");
        console.log(parsedData);*/
        var temp=[];
        var keys = Object.keys(parsedData);
			for(var len=0;len<keys.length;len++)
			{
                temp.push({"name":keys[len],"series":parsedData[keys[len]]})
            }
        //console.log(temp);
        return temp;
    }

}