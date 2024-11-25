import React from "react";
import { Link,useNavigate } from "react-router-dom";
import Firstsection from '../introduction_page/Firstsection';
import AdSection from '../Adpage/announcement/index';
import Thirdsection from "../introduction_page/Thirdsection";




const Advertisementpage=()=>{
 
return(
    <div className="Advertisementpage">
      <Firstsection />
      <AdSection />
        <Thirdsection />
    </div>
)
}
export default Advertisementpage;