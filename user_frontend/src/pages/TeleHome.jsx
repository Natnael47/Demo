import { Bell, CreditCard, Eye, EyeOff, Grid, Home, MessageCircle, Search, User } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const TeleHome = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload(); // Refresh to remove token and re-render the page
    };
    return (
        <div className="font-sans bg-green-200 min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between bg-green-500 px-4 py-2">
                <img
                    src={assets.teleLogo}
                    alt="Ethio Telecom"
                    className="h-10"
                />
                <div className="flex space-x-4 text-white">
                    <Search className="w-5 h-5" />
                    <div className="relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            10
                        </span>
                    </div>
                </div>
            </div>

            {/* Balance Section */}
            <div className="bg-green-500 text-white py-4 px-6">
                <div className="flex items-center space-x-4">
                    <div className="bg-white rounded-full p-2">
                        <img
                            src="/path-to-user-icon.png"
                            alt="User"
                            className="h-8 w-8"
                        />
                    </div>
                    <div>
                        <p className="text-sm">Selam, Natnael</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 text-center mt-4">
                    <div>
                        <p>Balance (ETB)</p>
                        <p className="font-bold">***** <Eye className="inline w-4 h-4" /></p>
                    </div>
                    <div>
                        <p>Endekise (ETB)</p>
                        <p className="font-bold">***** <EyeOff className="inline w-4 h-4" /></p>
                    </div>
                    <div>
                        <p>Reward (ETB)</p>
                        <p className="font-bold">***** <EyeOff className="inline w-4 h-4" /></p>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="py-4 bg-green-100">
                <p className="text-center text-yellow-500 font-bold">FOR YOUR NEEDS!</p>
                <div className="grid grid-cols-4 gap-4 px-6 mt-4">
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-3 rounded-full">
                            <Home className="w-6 h-6 text-green-500" onClick={() => navigate("/tele-pay")} />
                        </div>
                        <p className="text-sm mt-2">Send Money</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-3 rounded-full">
                            <CreditCard className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-sm mt-2">Cash In/Out</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-3 rounded-full">
                            <Grid className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-sm mt-2">Airtime/Buy Package</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-3 rounded-full">
                            <MessageCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-sm mt-2">130 Gaming</p>
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-around bg-green-500 text-white py-2">
                <div className="flex flex-col items-center">
                    <Home className="w-5 h-5" />
                    <p className="text-xs">Home</p>
                </div>
                <div className="flex flex-col items-center">
                    <CreditCard className="w-5 h-5" />
                    <p className="text-xs">Payment</p>
                </div>
                <div className="flex flex-col items-center">
                    <Grid className="w-5 h-5" />
                    <p className="text-xs">Apps</p>
                </div>
                <div className="flex flex-col items-center cursor-pointer">
                    <MessageCircle className="w-5 h-5" onClick={handleLogout} />
                    <p className="text-xs">Logout</p>
                </div>
                <div className="flex flex-col items-center">
                    <User className="w-5 h-5" />
                    <p className="text-xs">Account</p>
                </div>
            </div>
        </div>
    );
};

export default TeleHome;
