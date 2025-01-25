import axios from "axios";
import { ChevronDown } from "lucide-react";
import React, { useContext, useState } from "react";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { Context } from "../context/context";

const TeleLogin = () => {
    const [currState, setCurrState] = useState("Login"); // Tracks current form state: Login or Sign Up
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

        const apiUrl =
            currState === "Login"
                ? backendUrl + "/api/user/login"
                : backendUrl + "/api/user/register";

        try {
            const response = await axios.post(apiUrl, data);

            if (response.data.success) {
                setMessage(`${currState} successful!`);
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="font-sans bg-[#f9f9f1] min-h-screen flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center p-4">
                <img
                    src={assets.teleLogo}
                    alt="Ethio Telecom"
                    className="h-10"
                />
                <div className="flex items-center text-gray-600 cursor-pointer">
                    English
                    <ChevronDown className="ml-1 h-4 w-4" />
                </div>
            </div>

            {/* Welcome Message */}
            <h2 className="text-blue-600 text-xl font-semibold mt-6">
                Welcome to telebirr SuperApp!
            </h2>
            <p className="text-gray-700 mt-2">All-in-One</p>

            {/* Login/Sign Up Section */}
            <h3 className="underline text-gray-800 text-lg font-medium mt-6">
                {currState === "Login" ? "Login" : "Sign Up"}
            </h3>

            <form
                onSubmit={onSubmitHandler}
                className="mt-6 w-full max-w-md px-4"
            >
                {currState === "Sign Up" && (
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            name="user_Name"
                            value={data.user_Name}
                            onChange={onChangeHandler}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                )}

                {currState === "Sign Up" && (
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="user_Email"
                            value={data.user_Email}
                            onChange={onChangeHandler}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-600 text-sm mb-2">
                        Phone
                    </label>
                    <input
                        type="text"
                        name="user_Phone"
                        value={data.user_Phone}
                        onChange={onChangeHandler}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-600 text-sm mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        name="user_Password"
                        value={data.user_Password}
                        onChange={onChangeHandler}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg py-2 px-6 rounded-md"
                    >
                        {currState === "Sign Up" ? "Sign Up" : "Login"}
                    </button>
                </div>

                {message && (
                    <p className="mt-4 text-center text-red-500 text-sm">{message}</p>
                )}
            </form>

            <p className="mt-6 text-center text-gray-600">
                {currState === "Login" ? (
                    <>
                        Don’t have an account?{' '}
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => setCurrState("Sign Up")}
                        >
                            Sign Up
                        </span>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => setCurrState("Login")}
                        >
                            Login
                        </span>
                    </>
                )}
            </p>

            {/* Footer */}
            <div className="mt-auto text-center text-sm text-gray-500 pb-4">
                <p>
                    <a href="/terms" className="text-green-600 hover:underline">
                        Terms and Conditions
                    </a>
                </p>
                <p>@2023 Ethio telecom. All rights reserved</p>
                <p>1.0.0 version</p>
            </div>
        </div>
    );
};

export default TeleLogin;
