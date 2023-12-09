import './hamburgerButton.scss';

export default function HamburgerButton({ onToggleNavigation }) {
    return (
        <div className='hamburger-button' onClick={onToggleNavigation}>
            <span className='hamburger-button__bar'></span>
            <span className='hamburger-button__bar'></span>
            <span className='hamburger-button__bar'></span>
        </div>
    )
}