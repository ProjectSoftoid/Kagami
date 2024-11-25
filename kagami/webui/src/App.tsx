import React from "react";
import { BrowserRouter as Router, Routes, Route } from"react-router-dom";
import Homepage from "./page/Homepage"
import Advertisementpage from "./page/Advertisement"
import Downloadpage from "./page/Download"
import Domainpage from "./page/Domain"
import Mirrorpage from "./page/Mirror"
import Statepage from "./page/State"


function App() {
  return (
    <Router>
     <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/announcement" element={<Advertisementpage />} />
      <Route path="/download" element={<Downloadpage />} />"
      <Route path="/domain" element={<Domainpage />} />
      <Route path="/mirror" element={<Mirrorpage />} />
      <Route path="/state" element={<Statepage />} />
      </Routes > 
    </Router>
  );
}

export default App;