import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Wishlist from './pages/wishlist.jsx';
import Community from './pages/Community.jsx';
import HomePage from './pages/home.jsx';
import MovieDetails from './components/movieInfo/MovieDetails.jsx';
import AuthForm from './components/authForm/AuthForm.jsx';


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/community" element={<Community />} />
                <Route path="/login" element={<AuthForm />} />
                <Route path="/register" element={<AuthForm />} />
                <Route path="/movieInfo/:id" element={<MovieDetails />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);