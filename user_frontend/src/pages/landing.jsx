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
        <div className="min-h-screen bg-white flex flex-col items-center">
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
            <div className="w-11/12 bg-[#273238] text-gray-900 p-6 mt-6 rounded-2xl shadow-lg">
                <h1 className="text-xl text-[#FBD78A] font-bold">Commercial Bank of Ethiopia</h1>
                <p className="text-sm text-[#FBD78A]">The Bank You Can Always Rely On!</p>
                <div className="mt-4">
                    <p className="text-lg font-semibold text-white flex items-center">
                        Balance <ChevronRight className="ml-1" />
                    </p>
                    <h2 className="text-4xl font-bold mt-2 text-white">{balance.toLocaleString()} Birr</h2>
                </div>
                <p className="text-sm text-[#FBD78A] mt-4">Saving - 10004561*****</p>
                <p className="text-sm text-white">14 Jan 2025 07:49:47 PM</p>
            </div>

            {/* Services Section */}
            <div className="mt-8 w-full flex flex-col items-center">
                <h2 className="text-lg font-bold text-[#8F23AA] mb-4">Services</h2>
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
                            className="flex flex-col items-center bg-white shadow-2xl border p-4 rounded-xl transition-transform transform hover:scale-105"
                            onClick={service.action}
                        >
                            <div className="text-purple-600">{service.icon}</div>
                            <span className="text-purple-600 mt-2 font-medium">{service.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Winner Popup */}
            {winnerData && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl text-gray-900 text-center border-4 border-yellow-500 relative">

                        <h2 className="text-3xl font-extrabold text-yellow-600">
                            🌟 Congratulations! 🌟
                        </h2>
                        <p className="mt-3 text-lg font-semibold text-gray-800">
                            You are this week's Commercial Bank of Ethiopia <br />
                            Grand Prize Winner!
                        </p>
                        <p className="mt-4 text-md text-gray-700 font-medium">
                            Lottery Number: <span className="font-bold text-purple-600">{winnerData.lotteryNumber}</span>
                        </p>
                        <p className="text-lg text-green-700 font-bold mt-2">
                            Reward: {winnerData.rewardAmount} Birr
                        </p>
                        <p className="mt-3 text-sm text-gray-600 italic">
                            Thank you for trusting us. We value your loyalty!
                        </p>
                        <button
                            onClick={() => setWinnerData(null)}
                            className="mt-6 px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg text-lg shadow-md hover:bg-yellow-600 transition duration-300"
                        >
                            Claim Your Prize
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <div className="w-full fixed bottom-0 bg-[#8F23AA] text-gray-800 flex justify-around py-3 shadow-lg">
                {["Home", "Accounts", "Recents"].map((label, index) => (
                    <button key={index} className="flex flex-col items-center text-white hover:text-gray-100">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <span className="text-sm mt-1 font-medium">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Landing;
