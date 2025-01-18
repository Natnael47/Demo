import { Phone, User } from 'lucide-react';
import React from 'react';

const TelePay = () => {
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-white shadow">
                <button className="text-gray-700">
                    <span className="material-icons">arrow_back</span>
                </button>
                <h1 className="text-lg font-semibold">Send Money to Individual</h1>
                <div></div>
            </div>

            {/* Banner */}
            <div className="p-4">
                <div className="relative h-24 rounded-lg overflow-hidden">
                    <img
                        src="https://via.placeholder.com/600x200"
                        alt="Banner"
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
                        <p className="text-white text-sm font-medium">Pay your taxes on telebirr<br /> Anytime from anywhere</p>
                    </div>
                </div>
            </div>

            {/* Mobile Number Input */}
            <div className="p-4">
                <div className="bg-white shadow rounded-lg p-4">
                    <label htmlFor="mobile-number" className="block text-gray-600 mb-2">Mobile Number</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                        <span className="text-gray-600">+251</span>
                        <input
                            id="mobile-number"
                            type="text"
                            placeholder="Enter Mobile Number"
                            className="flex-1 outline-none px-2"
                        />
                        <button className="text-green-500">
                            <User size={20} />
                        </button>
                    </div>
                    <button
                        className="mt-4 w-full bg-gray-300 text-gray-500 py-2 rounded-lg"
                        disabled
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Recent Section */}
            <div className="p-4">
                <h2 className="text-gray-600 text-lg mb-2">Recent</h2>
                <div className="flex flex-col items-center bg-white shadow rounded-lg p-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
                        <Phone size={24} className="text-green-500" />
                    </div>
                    <p className="text-gray-500">No recent receiver</p>
                </div>
            </div>
        </div>
    );
};

export default TelePay;
