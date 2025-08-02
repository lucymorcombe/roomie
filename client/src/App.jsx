import React from 'react';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import "./App.css";
import logo from "./assets/roomieLogoShadow.jpg";
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import RoomiePicks from './pages/RoomiePicks';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Likes from './pages/Likes';

//import ProtectedRoute from './components/ProtectedRoute';  // import ProtectedRoute
import GetStarted from './pages/GetStarted';

function App() {
  return (
    <>
      <BrowserRouter>
        <header>
          <nav>
            <Link to="/">
                <img src={logo} alt="'Roomie' written in pink"/>
            </Link>
            <ul className='navBarUl'>
              <Link to="/about-us">
                <li>About Us</li>
              </Link>
              <Link to="/roomie-picks">
                <li>Roomie Picks</li>
              </Link>
              <Link to="/likes">
                <li>Likes</li>
              </Link>
              <Link to="/matches">
                <li>Matches</li>
              </Link>
              <Link to="/profile">
                <li>Profile</li>
              </Link>
              <Link to="/get-started">
                <li>Get Started</li>
              </Link>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/roomie-picks" element={<RoomiePicks />} />
          <Route path="/likes" element={<Likes />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/get-started" element={<GetStarted />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
