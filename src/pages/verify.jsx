import { useState, useEffect } from "react";
import { ref, set, onValue, update } from "firebase/database";
import db from "../firebase"; // Firebase Realtime Database instance
import { motion } from "framer-motion"; // For animations
import { AiFillCheckCircle } from "react-icons/ai";

const VerifyPage = () => {
    const [accessKey, setAccessKey] = useState("");
    const [isAccessGranted, setIsAccessGranted] = useState(false);
    const [userData, setUserData] = useState(null);
    const [status, setStatus] = useState("");
    const [entryVerified, setEntryVerified] = useState(false);
    const [foodVerified, setFoodVerified] = useState(false);

    // Check for stored access key on page load
    useEffect(() => {
        const storedKey = localStorage.getItem("verifyAccessKey");
        if (storedKey) {
            setIsAccessGranted(true);
        }
    }, []);

    // Handle access key submission
    const handleAccessKeySubmit = (e) => {
        e.preventDefault();
        const validAccessKey = "6295"; // Replace with a securely stored key

        if (accessKey === validAccessKey) {
            setIsAccessGranted(true);
            localStorage.setItem("verifyAccessKey", accessKey);
            setStatus("Access granted!");
        } else {
            setStatus("Invalid access key. Please try again.");
        }
    };

    // Fetch user data from Realtime Database
    const fetchUserData = (token) => {
        const userRef = ref(db, `users/${token}`);
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                setUserData(snapshot.val());
                setEntryVerified(snapshot.val().entryVerified || false);
                setFoodVerified(snapshot.val().foodVerified || false);
                setStatus("User data loaded successfully.");
            } else {
                setStatus("Invalid or expired QR code.");
                setUserData(null);
            }
        }, (error) => {
            console.error("Error fetching user data:", error);
            setStatus("Failed to fetch user data.");
        });
    };

    // Handle user verification
    const handleVerification = (type) => {
        if (!userData) return;

        const userRef = ref(db, `users/${userData.id}`);
        const updates = type === "entry"
            ? { entryVerified: true }
            : { foodVerified: true };

        update(userRef, updates)
            .then(() => {
                if (type === "entry") setEntryVerified(true);
                if (type === "food") setFoodVerified(true);
                setStatus(`${type === "entry" ? "Entry" : "Food"} verification successful.`);
            })
            .catch((error) => {
                console.error("Error updating verification status:", error);
                setStatus("Verification update failed.");
            });
    };

    // Decode token from URL and fetch user data
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = atob(urlParams.get("token") || "");
        if (token) {
            fetchUserData(token);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
            >
                <h1 className="text-2xl font-bold text-center mb-4">
                    <span className="text-indigo-400">QR Code</span> Verification
                </h1>

                {!isAccessGranted ? (
                    <form onSubmit={handleAccessKeySubmit} className="space-y-4">
                        <label className="block">
                            <span className="text-sm text-gray-400">Enter Access Key:</span>
                            <input
                                type="password"
                                value={accessKey}
                                onChange={(e) => setAccessKey(e.target.value)}
                                className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-indigo-400"
                                maxLength={6}
                                required
                            />
                        </label>
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-lg transition-all"
                        >
                            Submit
                        </button>
                        {status && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 text-sm"
                            >
                                {status}
                            </motion.p>
                        )}
                    </form>
                ) : (
                    <div>
                        {userData ? (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-6"
                                >
                                    <h2 className="text-xl font-semibold text-center mb-2">User Details</h2>
                                    <div className="bg-gray-700 p-4 rounded-lg space-y-2">
                                        <p>Name: {userData.name}</p>
                                        <p>Mobile: {userData.mobile}</p>
                                        <p>
                                            Entry Verified:{" "}
                                            <span className={entryVerified ? "text-green-400" : "text-red-400"}>
                                                {entryVerified ? "Yes" : "No"}
                                            </span>
                                        </p>
                                        <p>
                                            Food Verified:{" "}
                                            <span className={foodVerified ? "text-green-400" : "text-red-400"}>
                                                {foodVerified ? "Yes" : "No"}
                                            </span>
                                        </p>
                                    </div>
                                </motion.div>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => handleVerification("entry")}
                                        disabled={entryVerified}
                                        className={`w-full py-2 rounded-lg font-medium transition-all ${
                                            entryVerified
                                                ? "bg-gray-600 cursor-not-allowed"
                                                : "bg-green-500 hover:bg-green-600 text-white"
                                        }`}
                                    >
                                        {entryVerified ? (
                                            <span className="flex justify-center items-center">
                                                Verified <AiFillCheckCircle className="ml-2" />
                                            </span>
                                        ) : (
                                            "Verify Entry"
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleVerification("food")}
                                        disabled={foodVerified}
                                        className={`w-full py-2 rounded-lg font-medium transition-all ${
                                            foodVerified
                                                ? "bg-gray-600 cursor-not-allowed"
                                                : "bg-blue-500 hover:bg-blue-600 text-white"
                                        }`}
                                    >
                                        {foodVerified ? (
                                            <span className="flex justify-center items-center">
                                                Verified <AiFillCheckCircle className="ml-2" />
                                            </span>
                                        ) : (
                                            "Verify Food"
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="text-center">{status || "Waiting for QR code scan..."}</p>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyPage;
