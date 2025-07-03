import React, { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import "./App.css";
import logo from "./assets/roomieLogoShadow.jpg";
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import RoomiePicks from './pages/RoomiePicks';
import Matches from './pages/Matches';
import Profile from './pages/Profile';

function App() {
  return (
    <>
      <BrowserRouter>
        <header>
          <nav>
            <Link to="/">
                <img src={logo} alt="'Roomie' written in pink"/>
            </Link>
            <ul>
              <Link to="/about-us">
                <li>About Us</li>
              </Link>
              <Link to="/roomie-picks">
                <li>Roomie Picks</li>
              </Link>
              <Link to="/matches">
                <li>Matches</li>
              </Link>
              <Link to="/profile">
                <li>Profile</li>
              </Link>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/roomie-picks" element={<RoomiePicks />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;

// Below is what chatgpt gave me to test the set up, keeping for the json stuff
// function App() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetch('/db_test')
//       .then(response => response.json())
//       .then(json => setData(json))
//       .catch(err => console.error('Error fetching data:', err));
//   }, []);

//   return (
//     <div>
//       <h1>DB Test Data</h1>
//       <ul>
//         {data.map(item => (
//           <li key={item.id}>{item.name}: {item.value}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;



// The below is what comes up when you start a vite project, the react and vite images, just keeping in case i need it
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
