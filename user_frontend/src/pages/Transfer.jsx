import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';
import { Context } from '../context/context';

const Transfer = () => {
    const [accountNo, setAccountNo] = useState('');
    const [amount, setAmount] = useState('');
    const [remark, setRemark] = useState('');
    const [error, setError] = useState('');
    const [userTermStatus, setUserTermStatus] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [lotteryPopup, setLotteryPopup] = useState(false);
    const [lotteryNumber, setLotteryNumber] = useState('');
    const { token } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserTerms = async () => {
            try {
                const response = await axios.get(backendUrl + "/api/user/check", {
                    headers: { token },
                });
                if (response.data.success) {
                    setUserTermStatus(response.data.userTermStatus);
                }
            } catch (error) {
                console.error("Error fetching user terms status:", error);
            }
        };
        checkUserTerms();
    }, [token]);

    const handlePay = async () => {
        try {
            const response = await axios.post(
                backendUrl + "/api/user/payment",
                { accountNo, amount, remark },
                { headers: { token } }
            );
            if (response.data.success) {
                setLotteryNumber(response.data.lottery_number);
                setLotteryPopup(true);
            } else {
                alert("Payment Failed! Please try again.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("An error occurred during payment.");
        }
    };

    const handleContinue = () => {
        if (accountNo.length <= 8) {
            setError('Account Number must be more than 8 digits.');
        } else if (isNaN(amount) || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount.');
        } else if (parseFloat(amount) > 25000) {
            setError('Maximum transfer amount is 25,000.');
        } else if (!remark.trim()) {
            setError('Please add a remark.');
        } else {
            setError('');
            handlePay();
        }
    };

    const handleCloseLotteryPopup = () => {
        setLotteryPopup(false);
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <div className="text-purple-700 text-lg font-bold mb-4">Saving - ETB - 4**2</div>
            <input
                type="text"
                placeholder="Account No"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                className="border-2 border-purple-500 rounded-lg p-2 w-4/5 mb-4"
            />
            <input
                type="text"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border-2 border-purple-500 rounded-lg p-2 w-4/5 mb-4"
            />
            <input
                type="text"
                placeholder="Remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="border-2 border-purple-500 rounded-lg p-2 w-4/5 mb-4"
            />
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <button
                onClick={handleContinue}
                className="bg-purple-700 text-white rounded-lg p-2 w-4/5"
            >
                CONTINUE
            </button>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Terms and Conditions</h2>
                        <p className="text-gray-700 mb-4">
                            Please review and accept the terms and conditions to proceed with the transaction.
                        </p>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="mt-6 bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition duration-300"
                        >
                            Accept Terms and Conditions
                        </button>
                    </div>
                </div>
            )}

            {lotteryPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4">
                        <div className="bg-green-500 text-white text-lg font-bold p-3 rounded-t-lg flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="white" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L9 9.172 7.707 7.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" clipRule="evenodd"></path>
                            </svg>
                            <span>Thank you</span>
                        </div>
                        <div className="p-4 text-gray-800">
                            <p className="text-lg font-bold mb-2">Message</p>
                            <p className="text-sm">
                                ETB {amount} debited from your account on {new Date().toLocaleDateString()} with transaction ID: <span className="font-bold">{accountNo}</span>.
                            </p>
                            <p className="mt-2 font-semibold">Your Lottery Number:</p>
                            <div className="text-2xl font-bold text-purple-700 mt-2">{lotteryNumber}</div>
                            <div className="flex justify-center mt-4">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${Math.random()}`} alt="QR Code" className="w-24 h-24" />
                            </div>
                        </div>
                        <div className="p-4 text-center border-t">
                            <button
                                onClick={handleCloseLotteryPopup}
                                className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition duration-300"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transfer;
