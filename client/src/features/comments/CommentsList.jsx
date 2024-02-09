import Comment from "./Comment";
import './commentsList.scss';

export default function CommentsList({ comments }) {
    return (
        <ul className='comments-list'>
            {comments.map((comment) => (
                <Comment key={comment.comment_id} comment={comment} />
            ))}
        </ul>     
    )
}