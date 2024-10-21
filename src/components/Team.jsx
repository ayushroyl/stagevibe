import React from 'react';
import { Github, Linkedin, Instagram, Twitter } from 'lucide-react';
import ayush from '../assets/team/ayush.png';
import shiva from '../assets/team/shiva.png';
import rahul from '../assets/team/rahul.png';

const teamMembers = [
    {
        name: 'Ayush Roy',
        role: 'Technical Lead & Full Stack Developer',
        image: ayush,
        social: {
            instagram: 'https://instagram.com/ayushroyl',
            linkedin: 'https://www.linkedin.com/in/ayushroyl',
            github: 'https://github.com/ayushroyl',
            twitter: 'https://twitter.com/ayushroyl'
        }
    },
    {
        name: 'Shiva',
        role: 'Backend Developer',
        image: shiva,
        social: {
            instagram: 'https://instagram.com/shivamsinghamrajput',
            linkedin: 'https://www.linkedin.com/in/shivadhruva',
            github: 'https://github.com/shivaarajput',
            twitter: 'https://twitter.com/shivamsinghamrajput'
        }
    },
    {
        name: 'Rahul Kumar',
        role: 'Frontend Developer',
        image: rahul,
        social: {
            instagram: 'https://www.instagram.com/therahulkumar9',
            linkedin: 'https://www.linkedin.com/in/therahulkumar9',
            github: 'https://github.com/therahulkumar9',
            twitter: 'https://x.com/therahulkumar9'
        }
    }
];

const SocialIcon = ({ href, icon: Icon, hoverColor }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`transform hover:scale-110 transition-transform ${hoverColor}`}
    >
        <Icon className="w-5 h-5" />
    </a>
);

const Team = () => {
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
                <h2 id="team" className="text-4xl sm:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
                    Our Technical Team
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="group relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <div className="relative mb-6">
                                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-purple-500/50">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-40 h-1.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-75"></div> */}
                            </div>

                            <div className="text-center">
                                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-2">
                                    {member.name}
                                </h3>
                                <p className="text-indigo-100 mb-4">{member.role}</p>

                                <div className="flex justify-center space-x-4 text-white/80">
                                    <SocialIcon
                                        href={member.social.github}
                                        icon={Github}
                                        hoverColor="hover:text-white"
                                    />
                                    <SocialIcon
                                        href={member.social.linkedin}
                                        icon={Linkedin}
                                        hoverColor="hover:text-blue-400"
                                    />
                                    <SocialIcon
                                        href={member.social.instagram}
                                        icon={Instagram}
                                        hoverColor="hover:text-pink-400"
                                    />
                                    <SocialIcon
                                        href={member.social.twitter}
                                        icon={Twitter}
                                        hoverColor="hover:text-blue-400"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;