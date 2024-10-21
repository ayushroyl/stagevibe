import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import img1 from '../assets/pictures/event1.jpg'; 
import img2 from '../assets/pictures/event2.jpg';
import img3 from '../assets/pictures/event3.jpg';
import img4 from '../assets/pictures/event4.jpg';
import img5 from '../assets/pictures/event5.jpg';
import img6 from '../assets/pictures/event6.jpg';

const Photos = () => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const eventPhotos = [
        { src: img1, alt: "Farewell Party Banner" },
        { src: img2, alt: "Audience Seating" },
        { src: img3, alt: "Group Photo on Stage" },
        { src: img4, alt: "Group Activities" },
        { src: img5, alt: "Lamp Lighting Ceremony" },
        { src: img6, alt: "Anchoring" }
    ];

    const closeModal = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            setSelectedPhoto(null);
        }
    };

    useEffect(() => {
        if (selectedPhoto) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        };
    }, [selectedPhoto]);

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
            {/* Dynamic Background with Stars */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-twinkle"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: '2px',
                            height: '2px',
                            backgroundColor: '#fff',
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16">
                <h2 id="photos" className="text-4xl sm:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
                    Event Gallery
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {eventPhotos.map((photo, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-lg cursor-pointer"
                            onClick={() => setSelectedPhoto(photo)}
                        >
                            <div className="aspect-w-4 aspect-h-3">
                                <img
                                    src={photo.src}
                                    alt={photo.alt}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-semibold text-lg">{photo.alt}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedPhoto && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 modal-overlay" 
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute -top-12 right-0 text-white hover:text-pink-300 transition-colors"
                            aria-label="Close photo"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <img
                            src={selectedPhoto.src}
                            alt={selectedPhoto.alt}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default Photos;