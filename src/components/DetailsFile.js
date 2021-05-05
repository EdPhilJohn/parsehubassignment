
const DetailsFile=({value, path,dt,index})=>{
    return(
      <div>
         {dt.childSend(index)}
        <h4>This is a File : <h4 style={{color:"red"}} >{value}</h4> located at {path}</h4>
      </div>
    )
  }
export default DetailsFile
