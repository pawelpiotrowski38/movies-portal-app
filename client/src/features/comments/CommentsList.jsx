import './commentsList.scss';

export default function CommentsList({ children }) {
    return (
        <ul className='comments-list'>
            {children}
        </ul>     
    )
}