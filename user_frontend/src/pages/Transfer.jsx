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
                    if (!response.data.userTermStatus) {
                        setShowPopup(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching user terms status:", error);
            }
        };

        checkUserTerms();
    }, [token]);

    const handleAcceptTerms = async () => {
        try {
            const response = await axios.post(
                backendUrl + "/api/user/update-term",
                { user_Term: true },
                { headers: { token } }
            );
            if (response.data.success) {
                setUserTermStatus(true);
                setShowPopup(false);
            }
        } catch (error) {
            console.error("Error updating terms status:", error);
        }
    };

    const handlePay = async () => {
        try {
            const response = await axios.post(
                backendUrl + "/api/user/payment",
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                alert(`Payment Successful! Your Lottery Number: ${response.data.lottery_number}`);
                navigate('/');
            } else {
                alert("Payment Failed! Please try again.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("An error occurred during payment.");
        }
    };

    const handleContinue = () => {
        if (accountNo.length !== 13) {
            setError('Wrong Account Number. It should be 13 digits.');
        } else if (parseFloat(amount) > 25000) {
            setError('Maximum amount to transfer is 25,000.');
        } else if (!remark.trim()) {
            setError('Add remark.');
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
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 overflow-y-auto max-h-[80vh]">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Terms and Conditions</h2>
                        <p className="text-gray-700 mb-4">Please accept the terms and conditions to proceed.</p>
                        <button
                            onClick={handleAcceptTerms}
                            className="block mx-auto mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Transfer;