import React from "react";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import Registration from "./Pages/Register";
import Home from "./Pages/Home";
import Matricula from "./Pages/Tuition";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/tuition" element={<Matricula/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
