// import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

import AppLayout from './ui/AppLayout';

import Home from './pages/Home';
import MovieDetails from "./pages/MovieDetails";
// import Movies from './movies';
// import MovieDetails from './movieDetails';
// import Actors from './actors';
// import Profile from './profile';
import Login from './pages/Login';
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";


// import SignUp from './signUp';
// import Activate from './activate';
// import ConfirmEmailAddress from './confirmEmailAddress';
// import ForgotPassword from './forgotPassword';
// import ResetPassword from './resetPassword';
// import ResendActivationLink from './resendActivationLink';
// import Enable2FA from './enable2FA';
// import Authenticate from './authenticate';
// import ProfileModPanel from './profileModPanel';
// import ProfileSettings from './profileSettings';
// import NotFound from './notFound';
// import ActorDetails from './actorDetails';
// import SearchResults from './searchResults';
// import Regulations from './regulations';
// import ServerError from './serverError';

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
                    <Route path = "/movie/:movieParams" element = {<MovieDetails/>} />
                    <Route path = "/login" element = {<Login />} />
                    <Route path = "/signup" element = {<Signup />} />
                    <Route path = "/forgotpassword" element = {<ForgotPassword />} />
                    <Route path = "/not-found" element = {<NotFound />} />
                    <Route path = "*" element = {<NotFound />} />
                    {/* <Route path = "/movies" element = {<Movies/>} />
                    <Route path = "/movies/details/:id" element = {<MovieDetails/>} />
                    <Route path = "/actors" element = {<Actors/>} />
                    <Route path = "/actors/details/:id" element = {<ActorDetails/>} />
                    <Route path = "/users/sign-in" element = {<SignIn/>} />
                    <Route path = "/users/sign-up" element = {<SignUp/>} />
                    <Route path = "/users/activate" element = {<Activate/>} />
                    <Route path = "/users/confirm-new-email-address" element = {<ConfirmEmailAddress/>} />
                    <Route path = "/users/forgot-password" element = {<ForgotPassword/>} />
                    <Route path = "/users/reset-password" element = {<ResetPassword/>} />
                    <Route path = "/users/resend-activation-link" element = {<ResendActivationLink/>} />
                    <Route path = "/users/enable-2fa" element = {<Enable2FA/>} />
                    <Route path = "/users/authenticate" element = {<Authenticate/>} />
                    <Route path = "/users/settings" element = {<ProfileSettings/>} />
                    <Route path = "/users/mod-panel" element = {<ProfileModPanel/>} />
                    <Route path = "/users/details/:username" element = {<Profile/>} />
                    <Route path = "/search" element = {<SearchResults/>} />
                    <Route path = "/regulations" element = {<Regulations/>} />
                    <Route path = "/server-error" element = {<ServerError/>} />
                    <Route path = "*" element = {<NotFound />} /> */}
                </Route>
            </Routes> 
        </BrowserRouter>
    );
}
