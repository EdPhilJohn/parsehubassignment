const ip=require('./input')
const express = require("express");
const PORT =  5000;
const app = express();
const fileFolderBinaryArray=[]
const allFilesAndFolders=[]
const dataValue=[]
const finalArray=[]

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
  let temp=''
  var i=0
  var dict={}
  recursiveTest(ip)
  console.log(dataValue)
  allFilesAndFolders.forEach((value,index)=>{
    if(!fileFolderBinaryArray[index]){
      
      tempstring=tempstring+'/'+value
      dict={
       name:value,
       data:dataValue[i],
       type:false,
       path:tempstring 
     }
     finalArray.push(dict)
     i++
    }
    else{
      temp=''
     temp=tempstring+'/'+value
     dict={
      name:value,
      data:null,
      path:temp,
      type:true
     }
     finalArray.push(dict)
    }
  })
  console.log(finalArray)
  for(var i=0;i<finalArray.length;i++){
    if(finalArray[i].path === varTemp){
      
      if(!finalArray[i].type){
        console.log(finalArray[i].data)
       res.json({message:finalArray[i].data})
      }else{
        let arr=[`This is a file ${finalArray[i].name}`]
        res.json({message:arr})
      }
    }
  }
})

//server at localhost:5000
app.listen(PORT);