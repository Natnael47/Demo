import axios from "axios";
import React, { useContext, useState } from "react";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { Context } from "../context/context";

const Login = () => {
    const [currState, setCurrState] = useState("Login"); // Tracks current form state: Login or Sign Up
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        user_Name: "",
        user_Email: "",
        user_Phone: "",
        user_Password: "",
    });

    const [message, setMessage] = useState("");

    const { setToken } = useContext(Context);

    // Handles input changes
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    // Handles form submission
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const apiUrl =
            currState === "Login"
                ? backendUrl + "/api/user/login"
                : backendUrl + "/api/user/register";

        try {
            const response = await axios.post(apiUrl, data);

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                setMessage(`${currState} successful!`);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <form
                onSubmit={onSubmitHandler}
                className="w-full max-w-md p-8 bg-white shadow-lg border-t rounded-lg"
            >
                <img src={assets.logo} alt="" />
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {currState === "Login" ? "Welcome Back!" : "Create an Account"}
                </h2>

                {/* Name field only visible in Sign Up mode */}
                {currState === "Sign Up" && (
                    <div className="mb-4">
                        <label
                            htmlFor="user_Name"
                            className="block text-sm font-medium text-gray-600"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            name="user_Name"
                            id="user_Name"
                            value={data.user_Name}
                            onChange={onChangeHandler}
                            placeholder="Enter your name"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                )}

                {/* Email field only visible in Sign Up mode */}
                {currState === "Sign Up" && (
                    <div className="mb-4">
                        <label
                            htmlFor="user_Email"
                            className="block text-sm font-medium text-gray-600"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="user_Email"
                            id="user_Email"
                            value={data.user_Email}
                            onChange={onChangeHandler}
                            placeholder="Enter your email"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                )}

                {/* Phone field */}
                <div className="mb-4">
                    <label
                        htmlFor="user_Phone"
                        className="block text-sm font-medium text-gray-600"
                    >
                        Phone
                    </label>
                    <input
                        type="text"
                        name="user_Phone"
                        id="user_Phone"
                        value={data.user_Phone}
                        onChange={onChangeHandler}
                        placeholder="Enter your phone number"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Password field */}
                <div className="mb-4">
                    <label
                        htmlFor="user_Password"
                        className="block text-sm font-medium text-gray-600"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        name="user_Password"
                        id="user_Password"
                        value={data.user_Password}
                        onChange={onChangeHandler}
                        placeholder="Enter your password"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className={`w-full py-2 px-4 bg-[#FFCD5A] text-white font-semibold text-[16px] rounded-lg hover:bg-[#FFC341] active:bg-[#FFB829] transition duration-200 flex justify-center items-center ${isLoading ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                    disabled={isLoading}
                >

                    {isLoading ? (
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                    ) : (
                        currState === "Sign Up" ? "Sign Up" : "Login"
                    )}
                </button>

                {/* Message display */}
                {message && (
                    <p className="mt-4 text-center text-red-500 text-sm">{message}</p>
                )}

                {/* Toggle form state */}
                <p className="mt-6 text-center text-gray-600">
                    {currState === "Login" ? (
                        <>
                            Don’t have an account?{" "}
                            <span
                                className="text-blue-500 cursor-pointer hover:underline"
                                onClick={() => setCurrState("Sign Up")}
                            >
                                Sign Up
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <span
                                className="text-blue-500 cursor-pointer hover:underline"
                                onClick={() => setCurrState("Login")}
                            >
                                Login
                            </span>
                        </>
                    )}
                </p>

            </form>
        </div>
    );
};

export default Login;
