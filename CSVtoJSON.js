var fs = require("fs");
var flag=0;
var headers=[];
var obj = {};
var reader = function(fileName,output) {
 var inStream=fs.createReadStream(fileName);
 var wstream = fs.createWriteStream(output+'.txt');
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
       var last=cline[cline.length-1];
       obj[headers[cline.length-1]]=last.substring(1,last.length-1);
       wstream.write(JSON.stringify(obj));
       wstream.write(",");
   }
 });
 inStream.on("end", function(){
   wstream.write("]");
 });
};
reader("crimes2001onwards.csv","result_CSVtoJSON");
