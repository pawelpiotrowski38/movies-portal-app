import { useAuth } from '../context/AuthContext';
import { useClickOutside } from '../hooks/useClickOutside';
import NavigationItem from './NavigationItem';
import CloseButton from './CloseButton';
import Button from './Button';
import './navigation.scss';

export default function Navigation({ isNavigationOpen, onSetIsNavigationOpen }) {
    const { isLoggedIn, handleLogout } = useAuth();

    const navigationRef = useClickOutside(() => {
        onSetIsNavigationOpen(false);
    });

    const handleButtonClick = function() {
        handleLogout();
        onSetIsNavigationOpen(false);
    }
    
    return (
        <nav
            ref={navigationRef} 
            className={`navigation ${isNavigationOpen ? 'navigation--visible' : ''}`}
        >
            <div className='navigation__close-button-container'>
                <CloseButton
                    onCloseHandler={() => onSetIsNavigationOpen(false)}
                />
            </div>
            <ul className='navigation__list'>
                <NavigationItem>
                    Home
                </NavigationItem>
                <NavigationItem>
                    Movies
                </NavigationItem>
                <NavigationItem>
                    Actors
                </NavigationItem>
            </ul>
            <div className='navigation__buttons'>
                {!isLoggedIn ? (
                    <Button
                        linkTo='/login'
                        onClick={() => onSetIsNavigationOpen(false)}
                    >
                        Log in
                    </Button>
                ) : (
                    <Button
                        onClick={handleButtonClick}
                    >
                        Log out
                    </Button>
                )}
                
                    {/* { authContext.isLoggedIn ? (
                        <div className='navbar-account-icon'>
                            <div ref={accountIconRef} className='account-icon' onClick={handleAccountPanelOpen}>
                                <img src='/images/user-icon.png' alt='user' />
                            </div> 
                            <div ref={accountPanelRef} className={`account-panel ${accountPanelOpen ? 'account-panel--visible' : ''}`}>
                                <div className='account-panel-item'>
                                    <Link to={`/users/details/${authContext.username}`} onClick={handleAccountPanelOpen}>
                                        {translations.accountPanel.profile[language]}
                                    </Link>
                                </div>
                                <div className='account-panel-item'>
                                    <Link to={'/users/notifications'} onClick={handleAccountPanelOpen}>
                                        {translations.accountPanel.notifications[language]}
                                        {notificationsNumber > 0 && ` (${notificationsNumber})`}
                                    </Link>
                                </div>
                                {authContext.role === 'mod' && (
                                    <div className='account-panel-item'>
                                        <Link to={'/users/mod-panel'} onClick={handleAccountPanelOpen}>
                                            {translations.accountPanel.modPanel[language]}
                                        </Link>
                                    </div>
                                )}
                                <div className='account-panel-item'>
                                    <Link to={'/users/settings'} onClick={handleAccountPanelOpen}>
                                        {translations.accountPanel.settings[language]}
                                    </Link>
                                </div>
                                <div className='account-panel-item'>
                                    <button className='account-panel-button' onClick={handleLogout}>{translations.accountPanel.logOut[language]}</button>
                                </div>
                            </div>
                            {notificationsNumber > 0 && (
                                <div className='account-notifications'>{notificationsNumber}</div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <Button />
                        </div>
                    )}
                </div>
                 */}
            </div>
        </nav>
    )
}