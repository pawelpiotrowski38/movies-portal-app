import { createContext, useContext, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    const checkLoggedIn = async function() {
        try {
            const response = await api.get('/users');
            setUsername(response.data.username);
            setIsLoggedIn(true);
        } catch (error) {
            console.log('User is not logged in');
        }
    };

    // login
    const handleLogin = function(username) {
        setIsLoggedIn(true);
        setUsername(username);
    };
    
    // logout
    const handleLogout = async () => {
        try {
            const response = await api.delete('/auth');
            console.log(response.data);
            setIsLoggedIn(false);
            setUsername('');
        } catch (error) {
            console.error(error);
        } 
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, checkLoggedIn, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('AuthContext was used outside of AuthProvider');
    }

    return context;
}

export { AuthProvider, useAuth };
