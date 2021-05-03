
import {useState,useEffect} from 'react'
import 'bootswatch/dist/superhero/bootstrap.min.css';
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import DetailsPage from './components/DetailsPage'
import DetailsFile from './components/DetailsFile'
import Home from './components/Home'

function App() {
  const [dataInput, setDataInput] = useState(null);
  const [serverInput,setServerInput]=useState('')
  const [serverOutput,setServerOutput]=useState(['Response from server appears here ....'])
  const dataValue=[] 
  const allFilesAndFolders=[]
  const fileFolderBinaryArray=[]
  const finalArray=[]
  const filesonlyArray=[]
  const folderonlyArray=[]
  
  var tempstring='/path'
  var id=0;

  useEffect(() => {
   var getData=async()=>{
     try{
      const response=await fetch('/path')
      const data=await response.json()
      setDataInput(data.message)
     }
     catch(error){
       console.log(error)
     }
   }
   getData()
  },[])
  

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
        allFilesAndFolders.push({fname:key,fid:++id}) 
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
 
  allFilesAndFolders.push({fname:'root',fid:id})
  var temp=''
  var dict={}
  var i=0;
  recursiveTest(dataInput) //To Parse through the json input
 
  allFilesAndFolders.forEach((value,index)=>{
   if(!fileFolderBinaryArray[index]){
    
    tempstring=tempstring+'/'+value.fname
    dict={
      name:value.fname,
      id:value.fid,
      data:{
        value:dataValue[i],
        type:fileFolderBinaryArray[index]
      },
      path:tempstring,
      vis:true
     
    }
    finalArray.push(dict)
    folderonlyArray.push(dict)
    i++

   }
   else{
     temp=''
     temp=tempstring+'/'+value.fname
     dict={
      name:value.fname,
      id:value.fid,
      data:{
        value:null,
        type:fileFolderBinaryArray[index]
      },
      path:temp,
      vis:false
     
      
    }
    filesonlyArray.push(dict)
    finalArray.push(dict)


   }
   
 })
 


  const handleSubmit=(e)=>{
    e.preventDefault()
    var getServerData =async()=>{
     try{
      const response=await fetch(`/path/dre?url=${serverInput}`)
      const dataSer= await response.json()
      setServerOutput(dataSer.message)
     }
     catch(error){
       console.log(error)
     }
    }
    getServerData()
  }
 
  return (
  <Router>
  <Switch>
    <div> 
       {/* Breadcrumb to display the folders */}
       <ol className="breadcrumb">
       {
       finalArray.map((value,index)=>{
         return(<div key={index}>  
                {!value.data.type && 
                <Link to={value.path}> <button className="breadcrumb-item" style={{color:'black'}}  > <h1 style={{color:'black'}}>{value.name + '/'}</h1></button></Link>
       }</div>)})
                     
             
       }
      </ol>
      {/* All The Routes are being setup here*/}
      <div className="jumbotron">
      {
       finalArray.map((value,index)=>{
         
          return(<div key={index}>
              
                  
            { !value.data.type?<Route exact path={value.path}  render={(props) => <DetailsPage value={value.name} finalArray={finalArray} path={value.path} arrayData={value.data.value} {...props} /> }></Route>: <Route exact path={value.path}  render={(props) => <DetailsFile path={value.path} value={value.name} {...props} /> }></Route>}
                  
          </div>)
        })
      }
      </div>
      {/* For a Welcome Page*/}
      <Route exact path='/' component={Home}></Route>
      
      {/* Server data is displayed using code below */}
<h1>Server data</h1>
<form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
      <input className="form-control mr-sm-2" type="text" placeholder="Search the server for path" value={serverInput} onChange={(e)=>setServerInput(e.target.value)} ></input>
      <button className="btn btn-secondary my-2 my-sm-0" type="submit" >Search</button>
      <h3>(For Example use /root/home to get files and folders from that directory)</h3>
</form>
    {
      serverOutput.map((v,i)=>{
        return(
          <div key={i}>
              <h2>{v}</h2>
          </div>
        )
      })
    }

   </div>
   </Switch>
  </Router>);
}




export default App;
