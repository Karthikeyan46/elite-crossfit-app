import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Menu, X } from 'lucide-react';
import './Navbar.css'; // I will create this or use styled components or inline

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  const handleNavClick = (e, targetId) => {
    closeMenu();
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on the home page, navigate to the home page and then scroll
      // This requires a bit more complex state management or a useEffect in the Home component
      // For simplicity, we'll just navigate to the home page for now.
      // A more robust solution would involve passing state to the home page to trigger scroll.
      navigate(`/#${targetId}`);
    }
  };

  return (
    <header className="navbar glass-panel">
      <div className="container navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <Dumbbell className="logo-icon text-gradient" size={32} />
          <span className="logo-text text-gradient">ELITE <span style={{ color: 'var(--color-primary)' }}>CROSS</span> Fit Studio</span>
        </NavLink>

        <nav className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Gallery</NavLink>
          <a href="/#features" className="nav-link" onClick={(e) => handleNavClick(e, 'features')}>Features</a>
          <a href="/#pricing" className="nav-link" onClick={(e) => handleNavClick(e, 'pricing')}>Pricing</a>
          <NavLink
            to={localStorage.getItem('isTrainer') === 'true' ? "/trainer-dashboard" : "/dashboard"}
            className={({ isActive }) => isActive ? 'nav-link active client-portal-link' : 'nav-link client-portal-link'}
            onClick={closeMenu}
          >
            {localStorage.getItem('isClientLoggedIn') ? "Dashboard" : "Client Portal"}
          </NavLink>
        </nav>

        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
