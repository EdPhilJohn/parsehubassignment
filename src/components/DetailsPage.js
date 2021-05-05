import {Link} from 'react-router-dom'
import 'bootswatch/dist/superhero/bootstrap.min.css';

const DetailsPage=({value,arrayData,finalArray,path,index,dt})=>{
   const send=index;
    const tempArr=[]
    for( let k=0;k<arrayData.length;k++){
      for(let j=0;j<finalArray.length;j++){
      
        if(arrayData[k] === finalArray[j].name){
          tempArr.push({p:finalArray[j].path,t:finalArray[j].data.type,j})

        }
      }
    }
    return(
      <div>
       
        <h4>You are at Directory {value} located at {path}</h4>
        <h2>The contents of this directory are</h2>
       
        
        {
          arrayData.map((value,index)=>{
            
            return(<div key={index}>
              <Link onClick={()=>dt.childSend(tempArr[index].j)} to={tempArr[index].p}><li style={{listStyle:"none"}}>{!tempArr[index].t?<h3>Directory - {value}</h3>:<h3>FileName - {value}</h3>}</li></Link>
  
            </div>)
          })
        }
      </div>
    )
  }
  export default DetailsPage
