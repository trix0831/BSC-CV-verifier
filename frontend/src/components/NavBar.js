import { Link } from "react-router-dom";
import './css/NavBar.css'; // Import the CSS file

function NavBar() {
  return (
    <nav
      className="flex gap-8 px-6 py-3 text-sm font-semibold fixed top-0 w-full z-1000 bg-[#333]"
      style={{
        zIndex: 1000,
      }}
    >
      <Link
        to="/"
        className="nav-link"
      >
        Home
      </Link>
      <Link
        to="/gallery"
        className="nav-link"
      >
        NFT Gallery
      </Link>
      <Link
        to="/issue"
        className="nav-link"
      >
        Issue NFT
      </Link>
      <Link
        to="/compare"
        className="nav-link"
      >
        Compare
      </Link>
    </nav>
  );
}

export default NavBar;