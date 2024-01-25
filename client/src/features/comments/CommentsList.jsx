import Comment from "./Comment";
import './commentsList.scss';

export default function CommentsList({ comments }) {
    return (
        <ul className='comments-list'>
            {comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </ul>     
    )
}