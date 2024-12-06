// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import YourToken from './components/YourToken';
import NFTUploadForm from './components/NFTuploadForm';
import HomePage from './components/HomePage';
import Compare from './components/Compare';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <HomePage/>} />
        <Route path="/yourtoken" element={<YourToken />} />
        <Route path="/upload" element={<NFTUploadForm />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="*" element={<h1 style={{color : "white"}}>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
