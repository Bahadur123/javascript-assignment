var fs = require("fs");
var flag=0;
var headers=[];
var obj = {};
var start=2001;
var end=2016;
var arr=[];
var reader = function(start,end,fileName,output) {
 for(var k=start;k<=end;k++){
   arr[k]={
     year:k,
     Arrested:0,
     NotArrested:0
   };
 }
 var inStream=fs.createReadStream(fileName);
 var wstream = fs.createWriteStream(output+'.JSON');
 wstream.write("[");
 var lineRead=require("readline").createInterface({
   input:inStream
 });
 lineRead.on("line", function (line) {
    var data = line.toString();
    if(flag==0){
      headers = data.split(",");
      flag=1;
    }
    else{
      var cline=data.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
     for (var i = 0; i < cline.length; i++) {
         obj[headers[i]] = cline[i];
       }
       for(var j=start;j<=end;j++){
         if(obj["Year"]==arr[j].year){
           if (obj["Arrest"]=="true") {
             arr[j].Arrested=arr[j].Arrested+1;
           }
           else{
             arr[j].NotArrested=arr[j].NotArrested+1;
           }
         }
       }
     }
 });
 inStream.on("end", function(){
   for(var i=start;i<end;i++){
     wstream.write(JSON.stringify(arr[i]));
     wstream.write(",");
   }
   wstream.write(JSON.stringify(arr[end]));
   wstream.write("]");
 });
};
reader(start,end,"crimes2001onwards.csv","result_multiserieslinechart");
