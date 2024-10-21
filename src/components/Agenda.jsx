import React from 'react';
import { Clock } from 'lucide-react';

const agendaItems = [
    {
        time: '🕙 10:00 AM - 10:30 AM',
        title: 'Registration and Networking',
        description: 'Check in at the entrance, enjoy refreshments, and pick up your welcome kit.',
        icon: '🎟️',
    },
    {
        time: '🎉 10:30 AM - 11:00 AM',
        title: 'Opening Ceremony',
        description: 'Join us for the inaugural address and welcome song.',
        icon: '📢',
    },
    {
        time: '🎭 11:00 AM - 1:00 PM',
        title: 'Cultural Performances',
        description: 'Enjoy performances by talented students showcasing music, dance, and drama.',
        icon: '🎭',
    },
    {
        time: '🍽️ 1:00 PM - 1:30 PM',
        title: 'Lunch Break',
        description: 'Take a break and enjoy a delicious lunch while mingling with friends.',
        icon: '🥗',
    },
    {
        time: '🎲 1:30 PM - 2:30 PM',
        title: 'Extra Enjoyment',
        description: 'Join fun games and interactive activities with fellow students.',
        icon: '🏆',
    },
    {
        time: '🎤 2:30 PM - 3:00 PM',
        title: 'Photo Session',
        description: 'Capture memories and meet your seniors and teachers.',
        icon: '📸',
    },
    {
        time: '🎊 3:00 PM - 4:30 PM',
        title: 'Closing Ceremony & Group Dance',
        description: 'Wrap up the day with closing remarks, thank-you notes, and a final group dance celebration.',
        icon: '🎆',
    },
];

const Agenda = () => {
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
                <h2 id="agenda" className="text-4xl sm:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
                    Event Timeline
                </h2>

                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-pink-500 to-purple-600 opacity-50" style={{ height: `calc(100% - 12%)` }}></div>

                        {agendaItems.map((item, index) => (
                            <div key={index} className="flex gap-6 mb-8 relative group">
                                {/* Icon circle */}
                                <div className="relative z-10 flex-shrink-0">
                                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-2xl">{item.icon}</span>
                                    </div>
                                </div>

                                {/* Content card */}
                                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-xl transform group-hover:translate-x-2 transition-transform duration-300">
                                    <div className="flex items-center gap-2 text-pink-300 mb-2">
                                        <Clock className="w-4 h-4" />
                                        <span className="font-semibold">{item.time}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-indigo-100">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Agenda;