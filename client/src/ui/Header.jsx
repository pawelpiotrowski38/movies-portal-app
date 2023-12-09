import { useState } from 'react';
import Logo from './Logo';
import Navigation from './Navigation';
import ThemeSwitch from './ThemeSwitch';
import HamburgerButton from './HamburgerButton';
import Mask from './Mask';
import './header.scss';

export default function Header() {
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const [theme, setTheme] = useState('dark');

    const handleToggleNavigation = function() {
        setIsNavigationOpen((open) => !open);
    }

    const handleToggleTheme = function() {
        document.documentElement.classList.remove('light', 'dark');
        if (theme === 'light') {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.add('light');
        }
    }

    return (
        <header className='header'>
            <Logo />
            <Navigation
                isNavigationOpen={isNavigationOpen}
                onSetIsNavigationOpen={setIsNavigationOpen}
            />
            <div className='header__buttons'>
                <ThemeSwitch 
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                />
                <HamburgerButton
                    onToggleNavigation={handleToggleNavigation}
                />
            </div>
            <Mask
                isState={isNavigationOpen}
            />
        </header>
    )
}
