import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';
import { Context } from '../context/context';

const MyNumber = () => {
    const [lotteryNumbers, setLotteryNumbers] = useState([]);
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
                }
            } catch (error) {
                console.error("Error fetching lottery numbers:", error);
            }
        };
        getLotteryNumber();
    }, [token]);

    return (
        <div className="h-screen bg-white flex flex-col text-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 shadow-2xl border-spacing-1 bg-purple-800">
                <button onClick={() => navigate(-1)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold">Lottery Numbers</h1>
                <div className="text-lg font-semibold">ሆም</div>
            </div>

            {/* Lottery Number List */}
            <div className="px-6 mt-6 space-y-4 overflow-auto flex-1">
                {lotteryNumbers.length > 0 ? (
                    lotteryNumbers.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-lg">
                            {/* Icon */}
                            <div className="bg-purple-700 p-3 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5" />
                                </svg>
                            </div>

                            {/* Lottery Number Details */}
                            <div>
                                <h2 className="text-lg font-bold text-purple-700">Lottery Number: {item.lotteryNumber}</h2>
                                <p className="text-gray-600 text-sm">Date: {new Date(item.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-lg font-semibold mt-10">No lottery numbers found.</p>
                )}
            </div>
        </div>
    );
};

export default MyNumber;
