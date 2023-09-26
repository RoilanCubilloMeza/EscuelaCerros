import React from "react";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import Registration from "./Pages/Register";
import Home from "./Pages/Home";
import Matricula from "./Pages/Tuition";
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/Theme";
function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Navbar/>  
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Registration />} />
        <Route path="/" element={<Home/>} /> 
        <Route path="/tuition" element={<Matricula/>}/>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
