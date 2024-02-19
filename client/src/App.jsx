// import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

import AppLayout from './ui/AppLayout';

import Home from './pages/Home';
import MovieDetails from "./pages/MovieDetails";
import Login from './pages/Login';
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

export default function App() {
    const { checkLoggedIn } = useAuth();
    
    useEffect(() => {      
        checkLoggedIn();
    }, [checkLoggedIn]);

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path = "/" element = {<Home/>} />
                    <Route path = "/movies/:movieParams" element = {<MovieDetails/>} />
                    <Route path = "/login" element = {<Login />} />
                    <Route path = "/signup" element = {<Signup />} />
                    <Route path = "/forgot-password" element = {<ForgotPassword />} />
                    <Route path = "/not-found" element = {<NotFound />} />
                    <Route path = "*" element = {<NotFound />} />
                </Route>
            </Routes> 
        </BrowserRouter>
    );
}
