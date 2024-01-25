import { useState } from "react";
import { validateComment } from "../../utils/validateFormFields";
import Form from "../../ui/Form";
import FormItem from "../../ui/FormItem";
import Button from "../../ui/Button";
// import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";

export default function CommentForm() {
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = function() {
        const commentMessage = validateComment(comment);

        setCommentError(commentMessage);

        return !commentMessage;
    }

    const handleSubmit = function(e) {
        e.preventDefault();
        
        setIsLoading(true);
        validateForm();
        setIsLoading(false);
    }

    return (
        <Form
            maxWidth={'100%'}
            padding={'0'}
            onSubmit={handleSubmit}
        >
            <Heading
                type={'h3'}
                size='1.375rem'
                alignment={'left'}
            >
                Comments
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