import axios from 'axios';
import { User } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';
import { Context } from '../context/context';

const TelePay = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [userTermStatus, setUserTermStatus] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState('');
    const { token } = useContext(Context);
    const navigate = useNavigate();

    // Check if the user has agreed to terms and conditions
    useEffect(() => {
        const checkUserTerms = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/user/check`, {
                    headers: { token },
                });
                if (response.data.success) {
                    setUserTermStatus(response.data.userTermStatus);
                }
            } catch (err) {
                console.error('Error checking user terms:', err);
            }
        };

        checkUserTerms();
    }, [backendUrl, token]);

    // Handle accepting terms
    const handleAcceptTerms = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/update-term`,
                { user_Term: true },
                { headers: { token } }
            );
            if (response.data.success) {
                setUserTermStatus(true);
                setShowPopup(false);
            }
        } catch (err) {
            console.error('Error accepting terms:', err);
        }
    };

    // Handle payment
    const handlePay = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/payment`,
                { mobileNumber, amount },
                { headers: { token } }
            );
            if (response.data.success) {
                alert(`Payment Successful! Your Lottery Number: ${response.data.lottery_number}`);
                navigate('/');
            } else {
                alert('Payment failed. Please try again.');
            }
        } catch (err) {
            console.error('Error processing payment:', err);
            alert('An error occurred during payment.');
        }
    };

    // Validate inputs and handle pay button click
    const handleContinue = () => {
        if (!mobileNumber || mobileNumber.length !== 10 || isNaN(mobileNumber)) {
            setError('Please enter a valid mobile number.');
        } else if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount.');
        } else {
            setError('');
            if (userTermStatus) {
                handlePay();
            } else {
                setShowPopup(true);
            }
        }
    };

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

            {/* Inputs */}
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
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                        />
                        <button className="text-green-500">
                            <User size={20} />
                        </button>
                    </div>
                    <label htmlFor="amount" className="block text-gray-600 mt-4 mb-2">Amount</label>
                    <input
                        id="amount"
                        type="text"
                        placeholder="Enter Amount"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <button
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
                        onClick={handleContinue}
                    >
                        Pay
                    </button>
                </div>
            </div>

            {/* Terms and Conditions Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Terms and Conditions</h2>
                        <p className="text-gray-700 mb-4">
                            Please review and accept the terms and conditions to proceed with the transaction.
                        </p>
                        <button
                            onClick={handleAcceptTerms}
                            className="block mx-auto mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Accept Terms and Conditions
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TelePay;
