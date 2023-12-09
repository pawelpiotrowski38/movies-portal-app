export function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (username.length === 0) {
        return 'Username field can\'t be empty';
    }
    if (username.length < 4 || username.length > 20) {
        return 'Username must be between 4 and 20 characters long';
    }
    if (!usernameRegex.test(username)) {
        return 'Username can contain only letters, numbers and underscores';
    }
    
    return '';
}

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length === 0) {
        return 'Email address field can\'t be empty';
    }
    if (!emailRegex.test(email)) {
        return 'Invalid email';
    }

    return ''
}

export function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/;

    if (password.length === 0) {
        return 'Password field can\'t be empty';
    }
    if (password.length < 8 || password.length > 20) {
        return 'Password must be between 8 and 20 characters long';
    }
    if (!passwordRegex.test(password)) {
        return 'Password must have at least one uppercase letter and one number';
    }

    return '';
}

export function validateConfirmPassword(password, confirmPassword) {
    if (confirmPassword.length === 0) {
        return 'Confirm password field can\'t be empty';
    }
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }

    return '';
}
