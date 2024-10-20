import React from 'react';
import { motion } from 'framer-motion';

const agendaItems = [
    {
        time: '🕙 10:00 AM - 10:30 AM',
        title: 'Registration and Networking',
        description: 'Check in at the entrance, enjoy refreshments, and receive your welcome kit.',
        icon: '🎟️', // Ticket emoji
    },
    {
        time: '🎉 10:30 AM - 11:00 AM',
        title: 'Opening Ceremony',
        description: 'Join us for the inaugural address and welcome song.',
        icon: '📢', // Megaphone emoji
    },
    {
        time: '🎭 11:00 AM - 1:00 PM',
        title: 'Cultural Performances',
        description: 'Enjoy performances by talented students showcasing music, dance, and drama.',
        icon: '🎶', // Music note emoji
    },
    {
        time: '🍽️ 1:00 PM - 1:30 PM',
        title: 'Lunch Break',
        description: 'Take a break and enjoy a delicious lunch while mingling with friends.',
        icon: '🥗', // Salad emoji
    },
    {
        time: '🎲 1:30 PM - 2:30 PM',
        title: 'Extra Enjoyment',
        description: 'Participate in fun games and interactive activities with fellow students.',
        icon: '🏆', // Trophy emoji
    },
    {
        time: '🎤 2:30 PM - 3:00 PM',
        title: 'Photo Session',
        description: 'Catch your memories & meet your seniours, teachers',
        icon: '💬', // Speech balloon emoji
    },
    {
        time: '🎊 3:00 PM - 4:30 PM',
        title: 'Closing Ceremony & Random Group Dance',
        description: 'Wrap up the day with closing remarks, thank you notes, and final celebrations with mix group dance.',
        icon: '🎆', // Fireworks emoji
    },
];

const Agenda = () => {
    return (
        <section id='agenda' className="bg-gradient-to-b from-[#040024CC] to-[#0b0b22FD] py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white text-center">
                    Agenda
                </h2>
                <div className="relative">
                    {/* Vertical line for mobile */}
                    <div className="absolute left-6 top-0 w-0.5 h-full bg-yellow-400 sm:hidden"></div>
                    
                    {/* Vertical line for desktop */}
                    <div className="hidden sm:block absolute left-6 top-0 w-0.5 h-full bg-yellow-400"></div>

                    {agendaItems.map((item, index) => (
                        <motion.div
                            key={index}
                            className="flex gap-4 mb-8 relative"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            {/* Icon circle */}
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border-2 border-yellow-400">
                                    <span className="text-xl">{item.icon}</span>
                                </div>
                            </div>

                            {/* Content card */}
                            <div className="flex-1 bg-gray-800 rounded-lg p-4 shadow-lg border-l-2 border-yellow-400">
                                <div className="flex items-center gap-2 text-yellow-300 mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    <span className="font-semibold text-sm">{item.time}</span>
                                </div>
                                <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-300">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Agenda;