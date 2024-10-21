import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="mb-4 backdrop-blur-sm bg-black/30 rounded-xl border border-pink-500/10 overflow-hidden"
      initial={false}
      animate={{ backgroundColor: isOpen ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.3)" }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        className="w-full text-left p-4 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-indigo-100">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="text-pink-300" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 pt-0 text-indigo-200">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const faqItems = [
    {
        question: 'What is StageVibe?',
        answer: 'StageVibe is a platform for online seat booking overall managing any party rating performances during college events, fostering community engagement and feedback.',
    },
    {
        question: 'How can I register for an event?',
        answer: 'You can register by clicking the "Book Seat" button on our website.',
    },
    {
        question: 'Is there an age limit for participants?',
        answer: 'No, there is no age limit. Everyone is welcome to participate in our events.',
    },
    {
        question: 'How do I contact the organizers?',
        answer: 'You can contact us directly in college. Otherwise connect us on social media',
    },
    {
        question: 'Where can I find the event photos?',
        answer: 'Event photos can be found in the "Photos" section of our website, or maybe will uploaded on google drive after party and sent link on whatsapp group.',
    }
  ];

  return (
    <section
      ref={ref}
      className="relative py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Effects */}
      <div id="faq" className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full filter blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          className="max-w-3xl mx-auto space-y-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <FAQItem question={item.question} answer={item.answer} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-indigo-300/20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 30 - 15],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <HelpCircle size={12 + Math.random() * 20} />
        </motion.div>
      ))}
    </section>
  );
};

export default FAQ;