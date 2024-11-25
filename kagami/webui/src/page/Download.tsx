import React from "react";
import { Link,useNavigate } from "react-router-dom";
import Firstsection from '../introduction_page/Firstsection';
import Downsection from '../DownloadPage/Downloadwindow';





const Downloadpage=()=>{
 
return(
    <div className="Downloadpage">
      <Firstsection />
      <Downsection />

      
    </div>
)
}
export default Downloadpage;