
import {useState,useEffect} from 'react'
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import DetailsPage from './components/DetailsPage'
import DetailsFile from './components/DetailsFile'
import Home from './components/Home'


function App() {
  const [dataInput, setDataInput] = useState(null);
  const [serverInput,setServerInput]=useState('')
  const [serverOutput,setServerOutput]=useState(['Response from server appears here ....'])
  const [dta,setDta]=useState(0)
  const dataValue=[] 
  const allFilesAndFolders=[]
  const fileFolderBinaryArray=[]
  const finalArray=[]
  const filesonlyArray=[]
  const folderonlyArray=[]
  var tempstring='/path'
  var id=0;
  var temp=''
  var dict={}
  var i=0;
  const test=[]
  const breadString=[]
  const breadPathString=[]
  const pat=[]
  const inc=[]

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
  recursiveTest(dataInput) //To Parse through the json input
  allFilesAndFolders.forEach((value,index)=>{
   if(!fileFolderBinaryArray[index]){
    breadString.push(value.fname) 
    tempstring=tempstring+'/'+value.fname
    breadPathString.push(tempstring)
    dict={
      name:value.fname,
      id:value.fid,
      data:{
        value:dataValue[i],
        type:fileFolderBinaryArray[index]
      },
      path:tempstring,
      vis:true,
      breadPath:{
        breadData:[...breadString],
        realPath:[...breadPathString]
      }
    }
    finalArray.push(dict)
    folderonlyArray.push(dict)
    i++
    inc.push(index)
    pat.push(fileFolderBinaryArray[index])
    test.push({nm:dict.name,dat:dict.breadPath.breadData,pat:dict.breadPath.realPath,tpe:[...pat],inc:[...inc]})
   }
   else{
     let tempArray=[...breadString];
     let tempInc=[...inc]
     tempInc.push(index)
     tempArray.push(value.fname)
     temp=''
     temp=tempstring+'/'+value.fname
     breadPathString.push(temp)
     dict={
      name:value.fname,
      id:value.fid,
      data:{
        value:null,
        type:fileFolderBinaryArray[index]
      },
      path:temp,
      vis:false,
      breadPath:{
        breadData:[...tempArray],
        realPath:[...breadPathString]
      }
      
    }
    filesonlyArray.push(dict)
    finalArray.push(dict)
    breadPathString.pop()
    tempArray.length=0;

    pat.push(fileFolderBinaryArray[index])
    test.push({nm:dict.name,dat:dict.breadPath.breadData,pat:dict.breadPath.realPath,tpe:[...pat],inc:[...tempInc]})
    tempInc.length=0;
   }
   if(fileFolderBinaryArray[index]){
     pat.pop()
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
function childSend(i){
  setDta(i)
}


 test.forEach(e=>console.log(e.inc + '' +e.nm))
  return (
  <Router>
  <Switch>
    <div> 

       {/* Breadcrumb to display the folders */}
       {
                    <div>
                        <ol className="breadcrumb">
                        {
                          test[dta].dat.map((v,i)=>{
                           
                            return(!test[dta].tpe[i]?
                              <Link onClick={()=>setDta(test[dta].inc[i])} to={test[dta].pat[i]}> <button className="breadcrumb-item" style={{color:'black'}}  > <h1 style={{color:'black'}}>{v+ '/'}</h1></button></Link>:
                              <Link onClick={()=>window.alert("This is a File and you are viewing its content, choose a folder to see others")} to={test[dta].pat[i]}> <button className="breadcrumb-item" style={{color:'black'}}  > <h1 style={{color:'black'}}>{v}</h1></button></Link>
                              
                            )
                          })}
                         
                        </ol>
                          
                      </div>

                  }

      {/* All The Routes are being setup here*/}
      <div className="jumbotron">
      {
       finalArray.map((value,index)=>{
         
          return(<div key={index}>
              
                  
            { !value.data.type?<Route exact path={value.path}  render={(props) => <DetailsPage value={value.name} dt={{dta,childSend}} finalArray={finalArray} path={value.path}  index={index} arrayData={value.data.value} {...props} /> }></Route>: <Route exact path={value.path}  render={(props) => <DetailsFile path={value.path} value={value.name} index={index} dt={{dta,childSend}} {...props} /> }></Route>}
                  
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
