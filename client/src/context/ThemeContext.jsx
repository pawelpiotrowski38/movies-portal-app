import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const [theme, setTheme] = useLocalStorageState('dark', 'theme');

    useEffect(function() {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = function() {
        if (theme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    }

    const changeTheme = function(theme) {
        setTheme(theme);
    }

    return (
        <ThemeContext.Provider value={{ theme, changeTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

function useTheme() {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('ThemeContext was used outside of ThemeProvider');
    }

    return context;
}

export { ThemeProvider, useTheme };
