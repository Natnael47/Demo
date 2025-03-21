import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';

const Home = () => {
    const [lotteryData, setLotteryData] = useState([]);
    const [winner, setWinner] = useState([]);

    // Handle selecting winner and refreshing page
    const chooseWinner = async () => {
        try {
            const response = await axios.post(
                backendUrl + "/api/user/choose-winner",
                { headers: {} }
            );
            if (response.data.success) {
                // Refresh the page
                window.location.reload();
            }
        } catch (error) {
            console.error("Error selecting winner:", error);
        }
    };

    useEffect(() => {
        const getLotteryData = async () => {
            try {
                const response = await axios.get(backendUrl + "/api/user/all-lottery-numbers", {
                    headers: {},
                });
                if (response.data.success) {
                    setLotteryData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching lottery data:", error);
            }
        };

        getLotteryData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-center mb-6">Lottery Numbers</h1>
            <div className="mb-6 flex justify-end">
                <button
                    className="bg-[#8EC641] hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                    onClick={chooseWinner}
                >
                    Select Winner
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-6 text-left">Lottery Number</th>
                            <th className="py-3 px-6 text-left">User Name</th>
                            <th className="py-3 px-6 text-left">Created At</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {lotteryData.map((entry, index) => (
                            <tr key={index} className={(index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100')}>
                                <td className="py-3 px-6">{entry.lotteryNumber}</td>
                                <td className="py-3 px-6">{entry.userName}</td>
                                <td className="py-3 px-6">{new Date(entry.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;
