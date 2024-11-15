// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Main from './Main';
import NFTUploadForm from './components/NFTuploadForm';
import HomePage from './components/HomePage';

const Home = () => (
  <div>
    <h1>Home Page</h1>
    <p>Welcome to the home page of your app!</p>
  </div>
);

const About = () => (
  <div>
    <h1>About Page</h1>
    <p>This is the about page.</p>
  </div>
);

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
