import React from "react";
import { Link,useNavigate } from "react-router-dom";
import Firstsection from '../introduction_page/Firstsection';
import Secondsection from "../Domainpage/domainAnnounce";
import Thirdsection from "../introduction_page/Thirdsection";




const Domainpage=()=>{
 
return(
    <div className="Advertisementpage">
      <Firstsection />
      <Secondsection />
      <Thirdsection />
    </div>
)
}
export default Domainpage;