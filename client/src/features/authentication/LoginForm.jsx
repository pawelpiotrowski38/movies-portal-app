import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { validatePassword, validateUsername } from "../../utils/validateFormFields";
import api from "../../api/api";
import Form from "../../ui/Form";
import FormItem from "../../ui/FormItem";
import FormSpecial from "../../ui/FormSpecial";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";

export default function LoginForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { handleLogin } = useAuth();
    const { changeTheme } = useTheme();

    const validateForm = () => {
        const usernameMessage = validateUsername(username);
        const passwordMessage = validatePassword(password);

        setUsernameError(usernameMessage);
        setPasswordError(passwordMessage);

        return !usernameMessage && !passwordMessage;
    };

    const handleSubmit = async function(e) {
        e.preventDefault();

        setIsLoading(true);

        if (validateForm()) {
            try {    
                const response = await api.post('/auth', {
                    username,
                    password,
                });

                handleLogin(username);
                changeTheme(response.data.theme);
                navigate('/');
            } catch (error) {
                if (error.response.data.message === 'User not found') {
                    setUsernameError('User doesn\'t exist');
                }

                if (error.response.data.message === 'Invalid password') {
                    setPasswordError('Invalid password');
                }

                if (error.response.data.message === 'User is logged in') {
                    console.log('User is logged in');
                    navigate('/');
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
                Log in to your account
            </Heading>
            <FormItem
                id='username'
                label='Username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Enter username'
                maxLength='30'
                error={usernameError}
            />
            <FormItem
                id='password'
                label='Password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter password'
                maxLength='30'
                error={passwordError}
            />
            <FormSpecial
                alignment={'right'}
                margin={'0.125rem'}
            >
                <Link to={'/forgot-password'}>Forgot password?</Link>
            </FormSpecial>
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
                    'Log in'
                )}
            </Button>
            <FormSpecial
                alignment={'center'}
            >
                {`Don't have an account? `}
                <Link to={'/signup'}>Sign up here</Link>
            </FormSpecial>
        </Form>
    )
}