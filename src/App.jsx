import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Rating from './pages/Rating';
import About from './components/About';
import Agenda from './components/Agenda';
import Photos from './components/Photos';
import Team from './components/Team';
import FAQ from './components/Faq';
import Footer from './components/Footer';
import './App.css';
import Login from './pages/login';
import Superadmin from './pages/superadmin';
import Admin from './pages/admin';
import SAdminlogin from './pages/sadminlogin';
import AdminLogin from './pages/adminlogin';
import SetSuperAdminPassword from './pages/SetSuperAdminPassword';
import Payment from './pages/Payment';
import GenerateQRCode from './pages/generate';
import Verify from './pages/verify';
import NewVoter from './pages/newvoter';
import Leaderboard from './pages/leaderboard';

const NotFound = () => <h1 style={{ fontSize: "1.5rem", color: "green" }}>Wait few minutes we'll back soon..</h1>;

const App = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<><Home /> <About /> <Agenda /> <Photos /> <Team /> <FAQ /> </>} />
        <Route path='/rating' element={<Rating />} />
        {/* <Route path='/booking' element={<Booking />} /> */}
        <Route path='/login' element={<Login />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/superadmin' element={<Superadmin />} />
        <Route path='/adminlogin' element={<AdminLogin />} />
        <Route path='/sadminlogin' element={<SAdminlogin />} />
        <Route path='/SetSuperAdminPassword' element={<SetSuperAdminPassword />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/generate' element={<GenerateQRCode />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/newvoter' element={<NewVoter />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
