import React, { useState } from 'react';
import './login.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    const loginFn = async (e) => {
        const form = e.target.parentNode;
        const email = form[0].value;
        const password = form[1].value;

        if (email && password) {
            const credentials = { email, password };

            try {
                const response = await axios.post('/api/admin/login', credentials);
                const data = response.data;

                if (data.success && data.token) {
                    sessionStorage.setItem('token', data.token);
                    navigate('/dashboard');
                } else {
                    setShowPopup(true);
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="form">
                <h2>Logowanie</h2>
                <form>
                    <input type="text" placeholder="Login" />
                    <input type="password" placeholder="Hasło" />
                    <button type="button" onClick={loginFn}>
                        Zaloguj
                    </button>
                </form>
                {showPopup && (
                    <div className="wrongLogin">
                        <span>zły login albo hasło</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
