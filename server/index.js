const ip=require('./input')
const express = require("express");
const PORT =  5000;
const app = express();
const fileFolderArray=[]
const fileFolderBinaryArray=[]
const allFilesAndFolders=[]
const dataValue=[]
const finalArray=[]
const currentDirectory=[]
var tempstring=''
var recursiveTest = (obj)=>{  
  let tempArray=[]
  for(var key in obj){
    if(key==='type'){
      if(obj[key]==='file'){
        fileFolderBinaryArray.push(true)
   
      }
      else if(obj[key]==='dir'){
        fileFolderBinaryArray.push(false) 
         
      }
      else{
        window.alert('Unknown data type detected, check if its a file or dir')
      }
    }
    
   else{
     if(key!=='children'){
      allFilesAndFolders.push(key) 
     }
     if(key==='children'){
       
      for(var k in obj[key]){
        tempArray.push(k)
      }
      dataValue.push(tempArray)
     }

       recursiveTest(obj[key])
    }
   
  }
 
}

//For First Fetch of input data
app.get("/path", (req, res) => {
  res.json({ message: ip});
});

//For other request about files and folders
app.get("/path/dre",(req,res)=>{
  allFilesAndFolders.push('root')
  let varTemp=req.query.url
  recursiveTest(ip)
  allFilesAndFolders.forEach((value,index)=>{
    if(!fileFolderBinaryArray[index]){
      currentDirectory.push(value)
    }
  })
   for(var i=0;i<currentDirectory.length;i++){
     tempstring=tempstring+'/'+currentDirectory[i]
     var dict={
       name:currentDirectory[i],
       data:dataValue[i],
       path:tempstring 
     }
     finalArray.push(dict)
   }
  
  for(var i=0;i<finalArray.length;i++){
    if(finalArray[i].path === varTemp){
      res.json({message:finalArray[i].data})
    }
  }
})

//server at localhost:5000
app.listen(PORT);