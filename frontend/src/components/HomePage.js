import './css/HomePage.css';
import { useNavigate } from 'react-router-dom';
import UploadCV from './svgs/UploadCV';

function HomePage() {
  const navigate = useNavigate(); // Hook for navigation

  const NavUpload = () => {
    navigate('/upload'); // Navigate to /upload
  };

  const NavCompare = () => {
    navigate('/compare'); // Navigate to /compare
  }

  const NavYourToken = () => {
    navigate('/yourtoken'); // Navigate to /yourtoken
  }

  return (
    <div className="homepage">
      <header className="header">
        <h1 className="title">CV Verifier</h1>
        <p className="subtitle">Experience the Future of Decentralization.</p>
      </header>

      <div className="card-container">
        <div className="card" onClick={NavUpload} style={{ cursor: 'pointer' }}>
          <div className="card-content">
            <UploadCV/>
            <p className="card-title">Add Your First CV NFT</p>
            <p className="card-para">Just a single click to be your own verifier</p>
          </div>
        </div>
      </div>

      <div 
          className="description grid grid-cols-2" 
          style={{  
            width: "60%",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "1rem",
          }}
      >
        <div
          className="description grid grid-cols-1"
          style={{
            border: "2px solid #6EACDA",
            borderRadius: "1rem",
            marginLeft: "1.8rem",
            // marginRight: "auto",
            transition: "transform 0.3s ease",
          }}
        >
          <p
            style={{
              color: "#c9c9c9", 
              fontSize: "1rem",
              margin: "1rem",
            }}
          >
            CV Verifier is a decentralized application that allows you to create your own CV NFTs. 
            Add your CV to the blockchain.
            This way, you can prove the authenticity of your CV and make it tamper-proof.
          </p>
        </div>

        <div
          className="grid grid-cols-1"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
          }}
        >
          <button class="button w-64" onClick={NavUpload}>
            <span class="button-content">Upload</span>
          </button>

          <button class="button mt-2 w-64" onClick={NavYourToken}>
            <span class="button-content">View Your CV</span>
          </button>
        
          <button class="button mt-2 w-64" onClick={NavCompare}>
            <span class="button-content">Compare</span>
          </button>
        </div>
      </div>

      <footer className="footer" style={{ position: 'fixed', bottom: 0, width: '100%' }}>
        <p>trix hahaha FOR Taipei blockchain week</p>
      </footer>
    </div>
  );
}

export default HomePage;
