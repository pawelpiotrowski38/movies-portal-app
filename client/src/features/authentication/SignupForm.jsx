import { useState } from "react";
import { Link } from "react-router-dom";
import { validateUsername, validateEmail, validatePassword, validateConfirmPassword } from "../../utils/validateFormFields";
import api from "../../api/api";
import Form from "../../ui/Form";
import FormItem from "../../ui/FormItem";
import FormSpecial from "../../ui/FormSpecial";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";

export default function SignupForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [formErrors, setFormErrors] = useState({
        usernameError: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = function(e) {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value,
        }));
    }

    const validateForm = () => {
        const usernameMessage = validateUsername(formData.username);
        const emailMessage = validateEmail(formData.email);
        const passwordMessage = validatePassword(formData.password);
        const confirmPasswordMessage = validateConfirmPassword(formData.password, formData.confirmPassword);

        setFormErrors({
            usernameError: usernameMessage,
            emailError: emailMessage,
            passwordError: passwordMessage,
            confirmPasswordError: confirmPasswordMessage,
        })

        return !usernameMessage && !emailMessage && !passwordMessage && !confirmPasswordMessage;
    };

    const handleSubmit = async function(e) {
        e.preventDefault();
        
        setIsLoading(true);

        if (validateForm()) {
            try {    
                const response = await api.post('/authentication/signup', {
                    emailAddress: formData.email,
                    username: formData.username,
                    password: formData.password,
                });

                console.log(response.data.message);
            } catch (error) {
                if (error.response.data.message === 'Email address already in use') {
                    setFormErrors(prevFormErrors => ({
                        ...prevFormErrors,
                        emailError: 'Email address already in use',
                    }))
                }

                if (error.response.data.message === 'Username already in use') {
                    setFormErrors(prevFormErrors => ({
                        ...prevFormErrors,
                        usernameError: 'Username already in use',
                    }))
                }

                if (error.response.data.message === 'User is logged in') {
                    console.log('User is logged in');
                }

                return;
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }

    return (
        <Form
            maxWidth={'40em'}
            padding={'1.875rem'}
            onSubmit={handleSubmit}
        >
            <Heading size='1.375rem'>
                Create your new account
            </Heading>
            <FormItem
                id='username'
                label='Username'
                type='text'
                value={formData.username}
                onChange={handleInputChange}
                placeholder='Enter username'
                maxLength='30'
                error={formErrors.usernameError}
            />
            <FormItem
                id='email'
                label='Email address'
                type='text'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Enter email address'
                maxLength='50'
                error={formErrors.emailError}
            />
            <FormItem
                id='password'
                label='Password'
                type='password'
                value={formData.password}
                onChange={handleInputChange}
                placeholder='Enter password'
                maxLength='30'
                error={formErrors.passwordError}
            />
            <FormItem
                id='confirmPassword'
                label='Confirm password'
                type='password'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder='Enter password'
                maxLength='30'
                error={formErrors.confirmPasswordError}
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
                    'Sign up'
                )}
            </Button>
            <FormSpecial>
                {`Already have an account? `}
                <Link to={'/login'}>Log in here</Link>
            </FormSpecial>
            <FormSpecial>
                {`By clicking Sign up, you agree to our `}
                <Link to={'/signup'}>Terms of Service</Link>
                {` and you confirm that you have read our `}
                <Link to={'/signup'}>Privacy Policy</Link>
            </FormSpecial>
        </Form>
    )
}