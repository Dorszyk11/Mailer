import './Login.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();

    const loginFn = async (e) => {
        const form = e.target.parentNode;
        const email = form[0].value;
        const password = form[1].value;
        
        if (email && password) {
            const credencials = { email, password };

            const response = await axios.post('/api/admin/login', credencials);
            const data = response.data;

            if (data.success && data.token) {
                sessionStorage.setItem('token', data.token);
                navigate('/dashboard');
            }
        }
    }

    return(
        <div className="login-container">
            <div className="form">
                <h2>Admin</h2>
                <form>
                    <input type="text" placeholder="Login" />
                    <input type="password" placeholder="Hasło" />
                    <button type="button" onClick={(e) => loginFn(e)}>Zaloguj</button>
                </form>
            </div>
        </div>
    )
}

export default Login;