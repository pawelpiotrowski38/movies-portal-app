import { useState } from "react";
import { validateEmail } from "../../utils/validateFormFields";
import Form from "../../ui/Form";
import FormItem from "../../ui/FormItem";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = function() {
        const emailMessage = validateEmail(email);

        setEmailError(emailMessage);

        return !emailMessage;
    }

    const handleSubmit = function(e) {
        e.preventDefault();
        
        setIsLoading(true);
        validateForm();
        // setIsLoading(false);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Heading size='1.375rem'>
                Send reset password link to your email
            </Heading>
            <FormItem
                id='email'
                label='Email address'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter email address'
                maxLength='50'
                error={emailError}
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
                    'Send reset link'
                )}
            </Button>
        </Form>
    )
}