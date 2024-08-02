import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import LikeButton from "../../ui/LikeButton";
import Spinner from "../../ui/Spinner";
import './commentLike.scss';

export default function CommentLike({ comment, onHandleLikeComment }) {
    const { isLoggedIn } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLiked(false);
    }, [isLoggedIn]);

    useEffect(() => {
        if (comment.liked_by_user) { 
            setIsLiked(true);
        } else {
            setIsLiked(false);
        }
    }, [comment.liked_by_user]);

    const handleLike = async function(operationType) {
        setIsLoading(true);
        try {
            if (operationType === 'add') {
                const response = await api.post(`/comments/likes`, {
                    commentId: comment.comment_id,
                });

                onHandleLikeComment(1);
                console.log(response.data.message);
            } else if (operationType === 'delete') {
                const response = await api.delete(`/comments/${comment.comment_id}/likes`);

                onHandleLikeComment(-1);
                console.log(response.data.message);
            } else {
                return;
            }

            setIsLiked((isLiked => !isLiked));
        } catch (error) {
            console.log(error.response);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='comment-like'>
            <span className='comment-like__likes-number'>{comment.number_of_likes}</span>
            <div className='comment-like__button-container'>
                {!comment.deleted && (
                    (isLoading ? (
                        <Spinner
                            primaryColor={'var(--primary-text-color'}
                            secondaryColor={'var(--button-background-color'}
                            duration={'1s'}
                            size={'1.375rem'}
                        />
                    ) : (
                        <LikeButton
                            isFilled={isLiked ? true : false}
                            clickHandler={() => handleLike(comment.liked_by_user ? 'delete' : 'add')}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
