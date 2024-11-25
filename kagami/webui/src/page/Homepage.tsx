import React from "react";
import { Link,useNavigate } from "react-router-dom";
import Firstsection from '../introduction_page/Firstsection';
import Secondsection from '../introduction_page/Secondsection';
import Thirdsection from '../introduction_page/Thirdsection';
const Homepage = () => {
 const navigate= useNavigate();

   return(
    <div className="Homepage">
    <Firstsection />
    <Secondsection />
    <Thirdsection />
    </div>
   );
};

export default Homepage;
