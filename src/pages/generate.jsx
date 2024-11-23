import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import QRious from "qrious";
import Img1 from "../assets/img.png"; // Ensure this path is correct

const GenerateCard = () => {
    const location = useLocation();
    const { user } = location.state || {}; // Retrieve user data from navigation state
    const canvasRef = useRef(null);

    if (!user) {
        return <p>No user data provided.</p>;
    }

    // Create a URL with the token as a query parameter
    const qrUrl = `${window.location.origin}/verify?token=${btoa(user.id)}`;

    const generateCard = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const username = `${user.roll}${user.class}`;
        const password = `${user.seatNo}@${user.mobile}`;

        // Load background image
        const backgroundImg = new Image();
        backgroundImg.src = Img1; // Adjust to your image path
        backgroundImg.onload = () => {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background image
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

            // Add personalized text
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 30px Arial";
            ctx.textAlign = "center";
            ctx.fillText(user.name, canvas.width / 1.8, 170);

            ctx.font = "bold 16px Arial";
            ctx.fillText(username, canvas.width / 1.4, 310);
            ctx.fillText(password, canvas.width / 1.36, 338);

            ctx.font = "bold 42px Arial";
            ctx.fillText(user.seatNo, canvas.width / 1.79, 550);

            // Generate QR code and draw it on the canvas
            const qr = new QRious({
                value: qrUrl,
                size: 150, // QR code size
                level: "H", // Error correction level
            });

            const qrImage = new Image();
            qrImage.src = qr.toDataURL(); // Generate QR code image
            qrImage.onload = () => {
                ctx.drawImage(qrImage, canvas.width - 290, canvas.height - 240, 200, 200);
            };
        };
    };

    const downloadAndShareCard = () => {
        const canvas = canvasRef.current;
        const imageUrl = canvas.toDataURL(); // Convert canvas content to image data URL

        // Download the card
        const link = document.createElement("a");
        link.download = `${user.name}_invitation.png`;
        link.href = imageUrl;
        link.click();

        // Share the card on WhatsApp
        const whatsappMessage = `Hello ${user.name},\n\nHere is your invitation card & e-ticket for Fresher's Party 2024.\n\nRate the Performers:-\nhttps://stagevibe.vercel.app/rating`;
        const whatsappUrl = `https://wa.me/91${user.mobile}?text=${encodeURIComponent(
            whatsappMessage
        )}`;
        window.open(whatsappUrl, "_blank"); // Open WhatsApp in a new tab
    };

    // Automatically generate card on component load
    useEffect(() => {
        generateCard();
    }, []);

    return (
        <div className="bg-gradient-to-r from-[#040024] to-[#0b0b22] text-center p-5">
            <h1 className="mb-5 text-2xl font-bold">
                Generate Invitation Card
            </h1>
            <canvas
                ref={canvasRef}
                width="1200"
                height="675"
                className="border border-gray-300 my-5 mx-auto block max-w-full"
            ></canvas>
            <div className="mt-5">
                <button
                    onClick={generateCard}
                    className="mx-2 py-2 px-4 text-lg bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600"
                >
                    Regenerate Card
                </button>
                <button
                    onClick={downloadAndShareCard}
                    className="mx-2 mt-4 py-2 px-4 text-lg bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
                >
                    Download and Share Card
                </button>
            </div>
        </div>
    );    
};

export default GenerateCard;