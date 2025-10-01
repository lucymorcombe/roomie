import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useSession } from './components/SessionContext';
import LogoutButton from './components/LogoutButton';  // <-- import LogoutButton
import "./App.css";
import logo from "./assets/logo-pink-background-clipped.jpg";
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import RoomiePicks from './pages/RoomiePicks';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Likes from './pages/Likes';
import GetStarted from './pages/GetStarted';
import ProfileSetup from './pages/ProfileSetup';

function App() {
  const { session, setSession } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/session', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setSession(data);
      })
      .catch(err => {
        console.error('Failed to fetch session:', err);
      });
  }, [setSession]);

  if (session.loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <header>
        <nav className="navbar">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="'Roomie' written in pink" />
          </Link>

          {/* Hamburger button */}
          <button
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✖" : "☰"}
          </button>

          {session.loggedIn ? (
            <ul className={`navBarUl ${menuOpen ? "show" : ""}`}>
              <Link to="/about-us" onClick={() => setMenuOpen(false)}><li>About Us</li></Link>
              <Link to="/roomie-picks" onClick={() => setMenuOpen(false)}><li>Roomie Picks</li></Link>
              <Link to="/likes" onClick={() => setMenuOpen(false)}><li>Likes</li></Link>
              <Link to="/matches" onClick={() => setMenuOpen(false)}><li>Matches</li></Link>
              <Link to={`/profile/${session.userId}`} onClick={() => setMenuOpen(false)}><li>Profile</li></Link>
              <li><LogoutButton /></li>
            </ul>
          ) : (
            <ul className={`navBarUl ${menuOpen ? "show" : ""}`}>
              <Link to="/about-us" onClick={() => setMenuOpen(false)}><li>About Us</li></Link>
              <Link to="/get-started" onClick={() => setMenuOpen(false)}><li>Get Started</li></Link>
            </ul>
          )}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/roomie-picks" element={<RoomiePicks />} />
        <Route path="/likes" element={<Likes />} />
        <Route path="/matches" element={<Matches />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/profile/:userId" element={<Profile />} /> 
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
