import './movieCardPanel.scss';

export default function MovieCardPanel({ children }) {
    return (
        <div className='movie-card-panel'>
            {children}
        </div>
    )
}