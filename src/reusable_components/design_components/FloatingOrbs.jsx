import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FloatingOrbs = () => {
    const [orbs, setOrbs] = useState([]);

    useEffect(() => {
        // Generate random positions for orbs
        const generateOrbs = () => {
            return Array.from({ length: 8 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,  // Random X position (0-100%)
                y: Math.random() * 100,  // Random Y position (0-100%)
                size: 20 + Math.random() * 60,  // Random size
                duration: 15 + Math.random() * 20,  // Random animation duration
                delay: Math.random() * 5,  // Random delay
            }));
        };

        setOrbs(generateOrbs());
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {orbs.map((orb) => (
                <motion.div
                    key={orb.id}
                    className="absolute rounded-full blur-xl"
                    initial={{
                        x: `${orb.x}%`,
                        y: `${orb.y}%`,  // Use random y position
                        opacity: 0,
                    }}
                    animate={{
                        x: [`${orb.x}%`, `${orb.x + Math.random() * 20 - 10}%`],  // Random horizontal movement
                        y: [`${orb.y}%`, `${orb.y + Math.random() * 20 - 10}%`],  // Random vertical movement
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: orb.duration,
                        repeat: Infinity,
                        delay: orb.delay,
                        ease: "linear",
                    }}
                    style={{
                        width: orb.size,
                        height: orb.size,
                        background: `radial-gradient(circle at center, rgba(96, 165, 250, 0.4), rgba(192, 132, 252, 0.1))`,
                        filter: 'blur(8px)',
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingOrbs;
