import "./header.styles.css";
export default function Header() {
  return (
    <nav className="header">
      <span> Logo</span>
      <ul className="header__navbar">
        <li>Brain</li>
        <li>Footprint</li>
      </ul>
    </nav>
  );
}
