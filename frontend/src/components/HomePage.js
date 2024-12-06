import './css/HomePage.css';
import { useNavigate } from 'react-router-dom';
import UploadCV from './svgs/UploadCV';

function HomePage() {
  const navigate = useNavigate(); // Hook for navigation

  const handleCardClick = () => {
    navigate('/upload'); // Navigate to /upload
  };

  return (
    <div className="homepage">
      <header className="header">
        <h1 className="title">CV Verifier</h1>
        <p className="subtitle">Experience the Future of Decentralization.</p>
      </header>

      <div className="card-container">
        <div className="card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          <div className="card-content">
            <UploadCV/>
            <p className="card-title">Add Your First CV NFT</p>
            <p className="card-para">Just a single click to be your own verifier</p>
          </div>
        </div>
      </div>

      <div className="description" 
          style={{  
            color: "#c9c9c9", 
            fontSize: "1rem",
            width: "60%",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "1rem",
          }}
      >
        <p>
          CV Verifier is a decentralized application that allows you to create your own CV NFTs. 
          You can add your CV to the blockchain and share it with others. 
          This way, you can prove the authenticity of your CV and make it tamper-proof.
        </p>
      </div>

      <footer className="footer" style={{ position: 'fixed', bottom: 0, width: '100%' }}>
        <p>trix hahaha FOR Taipei blockchain week</p>
      </footer>
    </div>
  );
}

export default HomePage;
