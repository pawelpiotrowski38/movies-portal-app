import { useState } from "react";
import { validateComment } from "../../utils/validateFormFields";
import Form from "../../ui/Form";
import FormItem from "../../ui/FormItem";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";
import api from "../../api/api";

export default function CommentForm({ movieId, onSetComments, numberOfComments, onSetAllCommentsCount }) {
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = function() {
        const commentMessage = validateComment(comment);

        setCommentError(commentMessage);

        return !commentMessage;
    }

    const handleSubmit = async function(e) {
        e.preventDefault();
        
        setIsLoading(true);
        if (validateForm()) {
            try {
                const response = await api.post('/comments/add', {
                    movieId: movieId,
                    content: comment,
                });
                const newComment = response.data.newComment;
                onSetComments((prevComments) => [newComment, ...prevComments])
                onSetAllCommentsCount((prevCount) => parseInt(prevCount) + 1);
                setComment('');
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
        <Form
            maxWidth={'100%'}
            padding={'0'}
            onSubmit={handleSubmit}
        >
            <Heading
                type={'h3'}
                size='1.25rem'
                alignment={'left'}
            >
                {`Comments (${numberOfComments})`}
            </Heading>
            <FormItem
                id='comment'
                label='Add a comment:'
                type='text'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Type your comment here'
                rows={3}
                maxLength='200'
                error={commentError}
            />
            <Button
                width='100%'
                fontSize={'0.9375rem'}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Spinner 
                        primaryColor={'var(--primary-text-color'}
                        secondaryColor={'var(--button-background-color'}
                        duration={'1s'}
                    />
                ) : (
                    'Add a comment'
                )}
            </Button>
        </Form>
    )
}