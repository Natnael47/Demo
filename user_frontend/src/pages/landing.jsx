import { ChevronRight, DollarSign, Droplet, Landmark, Lightbulb, Phone, Send } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center p-4 bg-white shadow-md">
                <div className="text-lg font-bold">19:52</div>
                <div className="text-purple-600 flex items-center space-x-4">
                    <span>አማ</span>
                    <button>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Balance Card */}
            <div className="w-11/12 bg-gray-800 text-white p-6 mt-6 rounded-lg shadow-md">
                <h1 className="text-xl font-bold">Commercial Bank of Ethiopia</h1>
                <p className="text-sm mt-1">The Bank You Can Always Rely On!</p>
                <div className="mt-4">
                    <p className="text-lg">
                        Balance <ChevronRight className="inline" />
                    </p>
                    <h2 className="text-4xl font-bold mt-2">23,000.46 Birr</h2>
                </div>
                <p className="text-sm mt-4">Saving - 10004561*****</p>
                <p className="text-sm">14 Jan 2025 07:49:47 PM</p>
            </div>

            {/* Services Section */}
            <div className="mt-8 w-full flex flex-col items-center">
                <h2 className="text-lg font-bold text-purple-600 mb-4">Services</h2>
                <div className="grid grid-cols-2 gap-4 w-11/12">
                    {/* Service Buttons */}
                    <button className="flex flex-col items-center bg-white shadow-md p-4 rounded-lg">
                        <Phone size={30} className="text-purple-600" />
                        <span className="text-purple-600 mt-2">Top Up</span>
                    </button>
                    <button
                        className="flex flex-col items-center bg-white shadow-md p-4 rounded-lg"
                        onClick={() => navigate("/transfer")}
                    >
                        <Send size={30} className="text-purple-600" />
                        <span className="text-purple-600 mt-2">Transfer</span>
                    </button>
                    <button className="flex flex-col items-center bg-white shadow-md p-4 rounded-lg">
                        <Landmark size={30} className="text-purple-600" />
                        <span className="text-purple-600 mt-2">Banking</span>
                    </button>
                    <button className="flex flex-col items-center bg-white shadow-md p-4 rounded-lg">
                        <Lightbulb size={30} className="text-purple-600" />
                        <span className="text-purple-600 mt-2">Utilities</span>
                    </button>
                    <button className="flex flex-col items-center bg-white shadow-md p-4 rounded-lg">
                        <DollarSign size={30} className="text-purple-600" />
                        <span className="text-purple-600 mt-2">Pay for</span>
                    </button>
                    <button className="flex flex-col items-center bg-white shadow-md p-4 rounded-lg">
                        <Droplet size={30} className="text-purple-600" />
                        <span className="text-purple-600 mt-2">Utility</span>
                    </button>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="w-full fixed bottom-0 bg-purple-600 text-white flex justify-around py-2">
                <button className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-white rounded"></div>
                    <span className="text-sm mt-1">Home</span>
                </button>
                <button className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-white rounded"></div>
                    <span className="text-sm mt-1">Accounts</span>
                </button>
                <button className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-white rounded"></div>
                    <span className="text-sm mt-1">Recents</span>
                </button>
            </div>
        </div>
    );
};

export default Landing;
