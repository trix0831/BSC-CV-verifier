import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="flex gap-8 px-6 py-3 text-sm font-semibold" style={{ background: "#333" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
      <Link to="/gallery" style={{ color: "white", textDecoration: "none" }}>NFT Gallery</Link>
      <Link to="/issue" style={{ color: "white", textDecoration: "none" }}>Issue NFT</Link>
      <Link to="/compare" style={{ color: "white", textDecoration: "none" }}>Compare</Link>
    </nav>
  );
}

export default NavBar;
