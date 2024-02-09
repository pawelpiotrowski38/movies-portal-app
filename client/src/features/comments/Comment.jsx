import './comment.scss';

export default function Comment({ comment }) {
    return (
        <article className='comment'>
            <div className='comment__header'>
                <div className='comment__avatar'></div>
                <div className='comment__info'>
                    <p className='comment__author'>
                        {comment.username}
                    </p>
                    <p className='comment__time'>
                        {new Date(comment.created_at).toLocaleString()}
                    </p>
                </div>
            </div>
            <div className='comment__content'>
                {comment.content}
            </div>
        </article>
    )
}