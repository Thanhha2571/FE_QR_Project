import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { baseUrl } from "components/api/httpService";

const Login = () => {
    document.title = "Login";

    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const userRef = useRef();
    const errRef = useRef();

    const [name, setUser] = useState('');
    const [password, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // let baseApiUrl = "https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/auth/";
    const [selectedRole, setSelectedRole] = useState('admin');

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };



    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [name, password]);

    // Organize for clean code
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const loginUrl = `${baseUrl}/api/auth/manage-${selectedRole}/login-${selectedRole}`;
            const res = await axios.post(
                loginUrl, 
                JSON.stringify({ name, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }, 
            );
            // const accessToken = res?.accessToken;
            const role = res?.data?.details?.role;
            const userDetails = res?.data?.details;
            
            localStorage.setItem('user', JSON.stringify(userDetails));
            localStorage.setItem('token', res?.data?.token);
            setAuth({ name, password, role });
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            alert(err.response?.data?.message)
        }
    };

    return (
        <>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white flex flex-col justify-center min-h-screen overflow-hidden">
                <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
                    <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
                    Sign in
                    </h1>
                    <form className="mt-6">
                        <div className="mb-2">
                            <label
                                className="block text-sm font-semibold text-gray-800"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={name}
                                required
                                className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                className="block text-sm font-semibold text-gray-800"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={password}
                                required
                                className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>
                        <a
                            href="/submit-email"
                            target="blank"
                            className="text-xs text-purple-600 hover:underline"
                        >
                            Forget Password?
                        </a>
                        <div className="mb-2">
                            <input id="admin" name="role" value="admin"
                                type="radio" className="text-purple-500 m-2"
                                checked={selectedRole === 'admin'} 
                                onChange={handleRoleChange}
                            />
                            <label htmlFor="admin"
                                className="text-sm font-semibold text-gray-800"
                            >
                                Admin
                            </label>

                            <input id="inhaber" name="role" value="inhaber"
                                type="radio" className="text-purple-500 m-2" 
                                checked={selectedRole === 'inhaber'} 
                                onChange={handleRoleChange}
                            />
                            <label htmlFor="inhaber"
                                className="text-sm font-semibold text-gray-800"
                            >
                                Inhaber
                            </label>

                            <input id="manager" name="role" value="manager"
                                type="radio" className="text-purple-500 m-2" 
                                checked={selectedRole === 'manager'} 
                                onChange={handleRoleChange}
                            />
                            <label htmlFor="manager"
                                className="text-sm font-semibold text-gray-800"
                            >
                                Manager
                            </label>

                            {/* <input id="employee" name="role" value="employee"
                                type="radio" className="text-purple-500 m-2" 
                                checked={selectedRole === 'employee'} 
                                onChange={handleRoleChange}
                            /> */}
                            {/* <label htmlFor="employee"
                                className="text-sm font-semibold text-gray-800"
                            >
                                Employee
                            </label> */}
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={ handleLogin } 
                                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    {/* 
                    <p className="mt-8 text-xs font-light text-center text-gray-700">
                        {" "}
                        Don't have an account?{" "}
                        <a
                            href="#"
                            className="font-medium text-purple-600 hover:underline"
                        >
                            Sign up
                        </a>
                    </p> 
                    */}
                </div>
            </div>
        </>
    )
}

export default Login;
