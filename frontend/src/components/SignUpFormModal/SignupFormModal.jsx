import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupFormModal.css';


function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    useEffect(() => {
        const newErrors = {};
        if (email.length === 0) {
            newErrors.email = "Email is required";
        }
        if (username.length < 4) {
            newErrors.username = "Username must be at least 4 characters long";
        }
        if (firstName.length === 0) {
            newErrors.firstName = "First Name is required";
        }
        if (lastName.length === 0) {
            newErrors.lastName = "Last Name is required";
        }
        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Confirm Password field must be the same as the Password field";
        }

        setErrors(newErrors);
    }, [email, username, firstName, lastName, password, confirmPassword]);

    // Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data?.errors) {
                        setErrors(data.errors);
                    }
                });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };


    const disableSubmit = () => {
        return Object.keys(errors).some(error => error);
    }

    return (
        <div className="signup-container">
            <div className='signup-roof'></div>
            <div className="signup-form">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    {errors.email && <p>{errors.email}</p>}
                    <label>
                        Username
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    {errors.username && <p>{errors.username}</p>}
                    <label>
                        First Name
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </label>
                    {errors.firstName && <p>{errors.firstName}</p>}
                    <label>
                        Last Name
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </label>
                    {errors.lastName && <p>{errors.lastName}</p>}
                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    {errors.password && <p>{errors.password}</p>}
                    <label>
                        Confirm Password
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </label>
                    {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                    <button className="submit-button" disabled={disableSubmit()} type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
}

export default SignupFormModal;
