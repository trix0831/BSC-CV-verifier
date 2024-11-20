// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Main from './components/Main';
import NFTUploadForm from './components/NFTuploadForm';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <HomePage/>} />
        <Route path="/main" element={<Main />} />
        <Route path="/upload" element={<NFTUploadForm />} />
      </Routes>
    </Router>
  );
}

export default App;
