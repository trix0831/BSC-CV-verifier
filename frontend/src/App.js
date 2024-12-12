// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import YourToken from './components/YourToken';
import NFTUploadForm from './components/NFTuploadForm';
import HomePage from './components/HomePage';
import Compare from './components/Compare';
import './App.css';
import NavBar from "./components/NavBar";

function App() {
  return (
    <Router>
      <NavBar
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
        }}
      />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<YourToken />} />
          <Route path="/issue" element={<NFTUploadForm />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="*" element={<h1 style={{ color: "white" }}>Not Found</h1>} />
        </Routes>
    </Router>
  );
}

export default App;
