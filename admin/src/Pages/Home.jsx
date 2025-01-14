import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';

const Home = () => {
    const [lotteryData, setLotteryData] = useState([]);

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
            <h1 className="text-2xl font-bold text-center mb-4">Lottery Numbers</h1>
            <div className="mb-4 flex justify-end">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                    Select Winner
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-2 px-4">Lottery Number</th>
                            <th className="py-2 px-4">User Name</th>
                            <th className="py-2 px-4">Created At</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {lotteryData.map((entry, index) => (
                            <tr key={index} className={(index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100')}>
                                <td className="py-2 px-4">{entry.lotteryNumber}</td>
                                <td className="py-2 px-4">{entry.userName}</td>
                                <td className="py-2 px-4">{new Date(entry.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;
