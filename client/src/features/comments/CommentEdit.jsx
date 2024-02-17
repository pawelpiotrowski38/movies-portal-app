import { useState } from "react";
import Button from "../../ui/Button";
import './commentEdit.scss';
import { validateComment } from "../../utils/validateFormFields";
import api from "../../api/api";
import Spinner from "../../ui/Spinner";

export default function CommentEdit({ comment, onSetEditOpen, onHandleEditComment }) {
    const [commentEdit, setCommentEdit] = useState(comment.content);
    const [commentError, setCommentError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = function() {
        const commentMessage = validateComment(commentEdit);

        setCommentError(commentMessage);

        return !commentMessage;
    }

    const handleAccept = async function() {
        setIsLoading(true);
        if (validateForm()) {
            try {
                if (commentEdit === comment.content) {
                    setCommentError('Comment has not been updated as no changes were made.');
                    return;
                }
                const response = await api.patch('/comments', {
                    commentId: comment.comment_id,
                    content: commentEdit,
                });

                onHandleEditComment(commentEdit);
                onSetEditOpen(false);
                console.log(response.data.message);
            } catch (error) {
                console.log(error.response);
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }

    return (
        <div className='comment-edit'>
            <textarea
                className={`comment-edit__input ${commentError ? 'comment-edit__input--error' : ''}`}
                type={'text'}
                id={'edit'}
                value={commentEdit}
                onChange={(e) => setCommentEdit(e.target.value)}
                rows={3}
                maxLength={200}
            />
            <div className='comment-edit__error'>
                {commentError}
            </div>
            <div className='comment-edit__buttons-container'>
                <Button
                    width={'5.25rem'}
                    padding={'0.1875rem'}
                    fontSize={'0.875rem'}
                    onClick={handleAccept}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Spinner
                            primaryColor={'var(--primary-text-color'}
                            secondaryColor={'var(--button-background-color'}
                            duration={'1s'}
                            size={'1.3125rem'}
                        />
                    ) : (
                        'Accept'
                    )}
                </Button>
                <Button
                    width={'5.25rem'}
                    padding={'0.1875rem'}
                    fontSize={'0.875rem'}
                    onClick={() => onSetEditOpen(false)}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}