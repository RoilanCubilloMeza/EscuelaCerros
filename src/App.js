import React from 'react';
import Navbar from './components/Navbar';
import Login from './Pages/Login';
import Registration from './Pages/Register';
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
    <Route path="/login" element={<Login/>} />
    <Route path="/register" element={<Registration/>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
