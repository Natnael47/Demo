import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';
import { Context } from '../context/context';

const MyNumber = () => {
    const [lotteryNumbers, setLotteryNumbers] = useState([]); // Updated: Initialize as an array
    const { token } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const getLotteryNumber = async () => {
            try {
                const response = await axios.get(backendUrl + "/api/user/lottery-numbers", {
                    headers: { token },
                });
                if (response.data.success) {
                    setLotteryNumbers(response.data.lotteryNumbers);
                    //console.log(response.data.lotteryNumbers);
                }
            } catch (error) {
                console.error("Error updating terms status:", error);
            }
        };
        getLotteryNumber();
    }, [token]);

    return (
        <div className="h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 shadow-md">
                <button onClick={() => navigate(-1)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-purple-600"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </button>
                <h1 className="text-lg font-bold text-purple-600">
                    Lottery Numbers
                </h1>
                <div className="text-purple-600 text-xl font-semibold">ሆም</div>
            </div>

            {/* Lottery Number List */}
            <div className="px-4 mt-6 space-y-4">
                {lotteryNumbers.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        {/* Icon */}
                        <div className="bg-purple-600 p-3 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5"
                                />
                            </svg>
                        </div>

                        {/* Lottery Number Details */}
                        <div>
                            <h2 className="text-lg font-bold text-purple-600">
                                Lottery Number: {item.lotteryNumber}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Date: {new Date(item.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyNumber;
