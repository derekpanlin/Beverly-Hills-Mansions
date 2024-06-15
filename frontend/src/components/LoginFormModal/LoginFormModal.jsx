import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    const handleDemoLogin = (credential, password) => {
        dispatch(sessionActions.login({ credential, password }))
        closeModal();
    }



    useEffect(() => {
        const errors = {};

        if (credential.length < 4) {
            errors.login = "Credential must be more than 4 characters"
        }

        if (password.length < 6) {
            errors.password = "Password must be more than 6 characters"
        }

        setErrors(errors)
    }, [credential, password]);

    return (
        <div className="login-form-container">
            <div className="login-roof"></div>
            <div className="login-form">
                <h1>Log In</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Username or Email
                        <input
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            required
                        />
                    </label>
                    {errors.credential && <p className="error">{errors.credential}</p>}
                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button disabled={Object.values(errors).length > 0} type="submit">Log In</button>
                </form>
                <button className='demo-user-button' onClick={() => handleDemoLogin("demouser", "password4")}>Demo User</button>
            </div>
        </div>
    );
}

export default LoginFormModal;
