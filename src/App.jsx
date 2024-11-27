import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './Home';
import LandingPage from './Landing';
import Login from './Login';
import Signup from './Signup';
import Protected from './Protected';
import Bussiness from './Bussiness';
import Politics from './Politics';
import Entertainment from './Entertainment';
import Sports from './Sports';
import Technology from './Technology';
import Post from './Post';

import { Route, Routes, useLocation } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true);
  // const [showFooter, setShowFooter] = useState(false);
  const location = useLocation();
  
  // Simulate loading spinner
  useEffect(() => {
    const spinner = document.getElementById('spin');
    if (spinner) {
      setTimeout(() => {
        spinner.style.display = 'none'; // Hide spinner
        setLoading(false); // Set loading to false
      }, 1000);
    }
  }, []);

  // Determine if Navbar should be shown
  const noNavbarPaths = ['/', '/login', '/signup'];

  

  return (
    !loading && (
      <div className='mainbody' style={{ backgroundColor: 'beige', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Conditionally render Navbar based on current path */}
        {!noNavbarPaths.includes(location.pathname) && <Navbar />}
        
        <div style={{ flex: '1' }}> {/* This div takes up remaining space */}
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/home' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/protected' element={<Protected />} /> {/* Ensure this route is correct */}
            <Route path='/buss' element={<Bussiness />} />
            <Route path='/entertainment' element={<Entertainment />} />
            <Route path='/politics' element={<Politics />} />
            <Route path='/technology' element={<Technology />} />
            <Route path='/sports' element={<Sports />} />
            <Route path='/post' element={<Post />} />
          </Routes>
        </div>
      
        <Footer/>
      </div>
    )
  );
}

export default App;