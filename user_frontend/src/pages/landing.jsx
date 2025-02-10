import axios from "axios";
import { ChevronRight, DollarSign, Droplet, Landmark, Lightbulb, Phone, Send } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import { Context } from "../context/context";

const Landing = () => {
    const { token } = useContext(Context);
    const navigate = useNavigate();
    const [userStatus, setUserStatus] = useState(null);
    const [balance, setBalance] = useState(23000.46);
    const [winnerData, setWinnerData] = useState(null);

    useEffect(() => {
        const checkUserWinStatus = async () => {
            try {
                const response = await axios.get(backendUrl + "/api/user/notify-winner", {
                    headers: { token },
                });

                console.log("Response received:", response.data); // Log API response

                if (response.data.success && response.data.isWinner) {
                    setWinnerData(response.data.winnerDetails);
                    setBalance(prevBalance => prevBalance + response.data.winnerDetails.rewardAmount);
                } else {
                    console.log("User is not a winner."); // Debug log
                }
            } catch (error) {
                console.error("Error fetching user win status:", error);
            }
        };

        if (token) {
            checkUserWinStatus();
        }
    }, [token]); // Runs every time `token` changes

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 flex flex-col items-center text-white">
            {/* Winner Popup */}
            {winnerData && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-gray-900 text-center">
                        <h2 className="text-2xl font-bold text-green-600">Congratulations!</h2>
                        <p className="mt-2 text-lg">You are a winner!</p>
                        <p className="mt-4 text-sm text-gray-700">Lottery Number: {winnerData.lotteryNumber}</p>
                        <p className="text-sm text-gray-700">Reward: {winnerData.rewardAmount} Birr</p>
                        <button onClick={() => setWinnerData(null)} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md">OK</button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="w-full flex justify-between items-center p-4 bg-white text-gray-800 shadow-md">
                <div className="text-lg font-bold">19:52</div>
                <div className="flex items-center space-x-4">
                    <span className="font-semibold">Logout</span>
                    <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Balance Card */}
            <div className="w-11/12 bg-white text-gray-900 p-6 mt-6 rounded-2xl shadow-lg">
                <h1 className="text-xl font-bold">Commercial Bank of Ethiopia</h1>
                <p className="text-sm text-gray-500">The Bank You Can Always Rely On!</p>
                <div className="mt-4">
                    <p className="text-lg font-semibold text-gray-700 flex items-center">
                        Balance <ChevronRight className="ml-1" />
                    </p>
                    <h2 className="text-4xl font-bold mt-2 text-purple-600">{balance.toLocaleString()} Birr</h2>
                </div>
                <p className="text-sm text-gray-500 mt-4">Saving - 10004561*****</p>
                <p className="text-sm text-gray-500">14 Jan 2025 07:49:47 PM</p>
            </div>

            {/* Services Section */}
            <div className="mt-8 w-full flex flex-col items-center">
                <h2 className="text-lg font-bold text-white mb-4">Services</h2>
                <div className="grid grid-cols-3 gap-4 w-11/12">
                    {[
                        { icon: <Phone size={30} />, label: "Top Up" },
                        { icon: <Send size={30} />, label: "Transfer", action: () => navigate("/transfer") },
                        { icon: <Landmark size={30} />, label: "Banking" },
                        { icon: <Lightbulb size={30} />, label: "My Lottery Numbers", action: () => navigate("/lotteryNum") },
                        { icon: <DollarSign size={30} />, label: "Pay for" },
                        { icon: <Droplet size={30} />, label: "Utility" }
                    ].map((service, index) => (
                        <button
                            key={index}
                            className="flex flex-col items-center bg-white shadow-md p-4 rounded-xl transition-transform transform hover:scale-105"
                            onClick={service.action}
                        >
                            <div className="text-purple-600">{service.icon}</div>
                            <span className="text-purple-600 mt-2 font-medium">{service.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="w-full fixed bottom-0 bg-white text-gray-800 flex justify-around py-3 shadow-lg rounded-t-2xl">
                {["Home", "Accounts", "Recents"].map((label, index) => (
                    <button key={index} className="flex flex-col items-center text-gray-600 hover:text-purple-600">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <span className="text-sm mt-1 font-medium">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Landing;
