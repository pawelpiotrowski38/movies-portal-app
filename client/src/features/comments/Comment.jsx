import { useState } from 'react';
import api from '../../api/api';
import Button from '../../ui/Button';
import CommentEdit from './CommentEdit';
import Spinner from '../../ui/Spinner';
import './comment.scss';

export default function Comment({ comment, username }) {
    const [commentObj, setCommentObj] = useState(comment);
    const [editOpen, setEditOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEditComment = function(newContent) {
        setCommentObj(prevComment => ({
            ...prevComment,
            content: newContent,
        }));
        setEditOpen(false);
    };

    const handleDeleteComment = async function() {
        setIsLoading(true);
        try {
            const response = await api.delete(`/comments/${comment.comment_id}`);
            setCommentObj(prevComment => ({
                ...prevComment,
                deleted: true,
            }));
            console.log(response.data.message);
        } catch (error) {
            console.log(error.response);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <article className='comment'>
            <div className='comment__header'>
                <div className='comment__avatar'></div>
                <div className='comment__info'>
                    <p className='comment__author'>
                        {commentObj.username}
                    </p>
                    <p className='comment__time'>
                        {new Date(commentObj.created_at).toLocaleString()}
                    </p>
                </div>
            </div>
            {!editOpen ? (
                <>
                    <div className='comment__content'>
                        {commentObj.deleted ? (
                            <p className='comment__deleted'>
                                <i>This comment has been deleted</i>
                            </p>
                        ) : (
                            commentObj.content
                        )}
                    </div>
                    {username === commentObj.username && !commentObj.deleted && (
                        <div className='comment__buttons-container'>
                            <Button
                                width={'5.25rem'}
                                padding={'0.1875rem'}
                                fontSize={'0.875rem'}
                                disabled={isLoading}
                                onClick={() => setEditOpen(!editOpen)}
                            >
                                Edit
                            </Button>
                            <Button
                                width={'5.25rem'}
                                padding={'0.1875rem'}
                                fontSize={'0.875rem'}
                                disabled={isLoading}
                                onClick={handleDeleteComment}
                            >
                                {isLoading ? (
                                    <Spinner
                                        size={'1.3125rem'}
                                    />
                                ) : (
                                    'Delete'
                                )}
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <CommentEdit
                    comment={commentObj}
                    onSetEditOpen={setEditOpen}
                    onHandleEditComment={handleEditComment}
                />
            )}
            {username === comment.username && (
                <div className='comment__owner-border'></div>
            )}
        </article>
    )
}