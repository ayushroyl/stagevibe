import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import databse from '../firebase'; // Your Firebase config

const QRScanner = () => {
    const [scannedData, setScannedData] = useState(null);
    const [status, setStatus] = useState("");

    const handleScan = async (data) => {
        if (data) {
            const parsedData = JSON.parse(data);
            setScannedData(parsedData);

            // Verify QR Data
            const userRef = doc(databse, "users", parsedData.id);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();

                if (userData.securityNo === parsedData.securityNo) {
                    setStatus("User verified. Proceed to mark entry or food.");
                } else {
                    setStatus("Invalid security number.");
                }
            } else {
                setStatus("User not found.");
            }
        }
    };

    const handleError = (err) => console.error(err);

    const handleMark = async (type) => {
        if (!scannedData) return;

        const userRef = doc(databse, "users", scannedData.id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();

            if (type === "entry" && !userData.entryVerified) {
                await updateDoc(userRef, { entryVerified: true });
                setStatus("Entry verified successfully.");
            } else if (type === "food" && !userData.foodVerified) {
                await updateDoc(userRef, { foodVerified: true });
                setStatus("Food verified successfully.");
            } else {
                setStatus(`${type} already verified.`);
            }
        }
    };

    return (
        <div>
            <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%" }}
            />
            <div className="mt-4">
                <p>Status: {status}</p>
                {scannedData && (
                    <div>
                        <button
                            onClick={() => handleMark("entry")}
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Verify Entry
                        </button>
                        <button
                            onClick={() => handleMark("food")}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Verify Food
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRScanner;