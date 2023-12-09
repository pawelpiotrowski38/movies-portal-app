import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import App from './App.jsx';
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        
            <AuthProvider>
            <ThemeProvider>
                <App />
                </ThemeProvider>
            </AuthProvider>
        
    </React.StrictMode>,
)
