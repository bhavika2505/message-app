import React from 'react';
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from './components/login/login';
import Register from './components/register/register';
import ChatComponent from './components/chatComponents/chatComponent';
import Dashboard from './components/dashboard/dashboard';

function App() {
 
  return (
    <>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<ChatComponent/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
     
    </>
  )
}

export default App
