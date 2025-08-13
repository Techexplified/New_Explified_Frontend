import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LiftingCircles = () => {
    const [circles, setCircles] = useState([]);

    useEffect(() => {
        const generateCircles = () => {
            return Array.from({ length: 5 }, (_, i) => ({
                id: i,
                x: Math.random() * 80 + 20,  // Random X position (0-100%)
                y: Math.random() * 80 + 20,  // Random Y position (0-100%)
                size: 30 + Math.random() * 50,  // Random size
                duration: 3 + Math.random() * 3,  // Random animation duration
                delay: Math.random() * 2,  // Random delay
            }));
        };

        setCircles(generateCircles());
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {circles.map((circle) => (
                <motion.div
                    key={circle.id}
                    className="absolute rounded-full"
                    initial={{
                        x: `${circle.x}%`,  // Random x position
                        y: `${circle.y}%`,  // Random y position
                        opacity: 0.5,
                    }}
                    animate={{
                        y: ['100%', '-30%', '100%'],  // Vertical floating motion
                        opacity: [0.5, 1, 0.5],  // Fade in and out
                        scale: [1, 1.2, 1],  // Scaling effect
                    }}
                    transition={{
                        duration: circle.duration,
                        repeat: Infinity,
                        delay: circle.delay,
                        ease: "easeInOut",
                    }}
                    style={{
                        width: circle.size,
                        height: circle.size,
                        backgroundColor: `rgba(96, 165, 250, 0.6)`,
                        filter: 'blur(5px)',
                    }}
                />
            ))}
        </div>
    );
};

export default LiftingCircles;
