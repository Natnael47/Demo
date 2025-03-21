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
                const response = await axios.get(backendUrl + "/api/user/check-User-Term", {
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

    const handleAcceptTerms = async () => {
        try {
            const response = await axios.put(
                `${backendUrl}/api/user/update-term`,
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
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6">
                        {/* Header */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-5">
                            Terms and Conditions
                        </h2>

                        {/* Content */}
                        <div className="text-gray-700 space-y-5 overflow-y-auto max-h-[55vh] sm:max-h-[65vh]">
                            {/* Section 1 */}
                            <div>
                                <h3 className="font-semibold text-base sm:text-lg mb-1.5">1. Service Fee & Lottery Participation</h3>
                                <ul className="list-disc list-inside text-sm sm:text-sm space-y-1.5">
                                    <li>A <strong>1 Birr</strong> service fee will be charged for each transfer.</li>
                                    <li>Each transaction earns a <strong>lottery number</strong> for a chance to win cash prizes.</li>
                                    <li>Prizes include up to <strong>100,000 Birr daily</strong> and <strong>1,000,000 Birr monthly</strong>.</li>
                                </ul>
                            </div>

                            {/* Section 2 */}
                            <div>
                                <h3 className="font-semibold text-base sm:text-lg mb-1.5">2. Unsubscribing</h3>
                                <p className="text-sm sm:text-sm">
                                    - You may opt out of the lottery anytime through app settings or by contacting support.
                                    Opting out stops future participation but does not affect past entries.
                                </p>
                            </div>

                            {/* Section 3 */}
                            <div>
                                <h3 className="font-semibold text-base sm:text-lg mb-1.5">3. Claiming Prizes</h3>
                                <ul className="list-disc list-inside text-sm sm:text-sm space-y-1.5">
                                    <li>Winners will be notified via the app and registered contact details.</li>
                                    <li>Prizes must be claimed within <strong>30 days</strong> of notification.</li>
                                    <li>Identification and proof of transaction may be required.</li>
                                </ul>
                            </div>

                            {/* Section 4 */}
                            <div>
                                <h3 className="font-semibold text-base sm:text-lg mb-1.5">4. Customer Support</h3>
                                <p className="text-sm sm:text-sm">
                                    For inquiries, unsubscribing, or complaints, contact us at
                                    <a href="tel:+2519112****" className="text-purple-600 font-medium hover:underline ml-1">
                                        +2519112****
                                    </a>.
                                </p>
                            </div>

                            {/* Section 5 */}
                            <div>
                                <h3 className="font-semibold text-base sm:text-lg mb-1.5">5. Agreement</h3>
                                <p className="text-sm sm:text-sm">
                                    By clicking "Accept", you agree to these terms for every transaction. The bank reserves the
                                    right to update terms with prior notice.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-5 flex justify-center">
                            <button
                                onClick={handleAcceptTerms}
                                className="bg-purple-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-400 transition duration-300"
                            >
                                Accept Terms and Conditions
                            </button>
                        </div>
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
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transfer;
