import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../navbar/Navbar.jsx";

const AuthForm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        setIsLogin(location.pathname === "/login");
        setFormData({ username: "", email: "", password: "" });
    }, [location]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, email, password } = formData;
        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        const endpoint = isLogin ? "/login" : "/register";
        const bodyData = isLogin ? { username, password } : { username, email, password };

        try {
            const response = await fetch(`http://localhost:5173${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Server error response:", errorText);
                alert(`Error: ${errorText || "Something went wrong on the server."}`);
                return;
            }

            const data = await response.json();

            alert(data.message);
            if (isLogin) {
                localStorage.setItem("activeNavigation", "navigation2");
                localStorage.setItem("username", data.user.username);
                navigate("/");
            } else {
                alert("Registration successful! Please log in.");
                setIsLogin(true);
            }
        } catch (err) {
            console.error("Request failed:", err);
            alert("Network error, CORS issue, or invalid server response. Check console for details.");
        }
    };

    return (
        <div>
            <Nav />
            <div className="bg-white p-8 rounded-lg shadow-md w-4/5 max-w-lg mx-auto mt-20 text-center">
                <h2 className="text-2xl font-bold mb-6">
                    {isLogin ? "Sign In" : "Register"}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="username" className="block text-left font-medium">
                            {isLogin ? "Username or Email" : "Username"}
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder={isLogin ? "Username or Email" : "Username123"}
                            required
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md text-black"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label htmlFor="email" className="block text-left font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="YourEmail123@example.com"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md text-black"
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="password" className="block text-left font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="YourPassword123"
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md text-black"
                        />
                    </div>

                    <a href="#" className="text-blue-500 text-sm self-start hover:underline">
                        Forgot Password?
                    </a>

                    <button
                        type="submit"
                        className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900"
                    >
                        {isLogin ? "Sign In" : "Register"}
                    </button>
                </form>

                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="mt-4 text-blue-500 hover:underline"
                >
                    {isLogin
                        ? "Don't have an account? Register here"
                        : "Already have an account? Sign in here"}
                </button>
            </div>
        </div>
    );
};

export default AuthForm;
