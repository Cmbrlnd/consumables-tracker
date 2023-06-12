import classes from './Card.module.css';
import { useState, useEffect } from 'react';

const Card = ({ height, width, isMinWidth, children }) => {
    const [minWidth, setMinWidth] = useState(isMinWidth ? '375px' : 'unset');

    useEffect(() => {
        // Define a function to handle the resize event
        const handleResize = () => {
            if (isMinWidth) {
                // Check if the current window width is less than 450px
                // If true, set a new minimum width value of '300px'
                // Otherwise, set it to '375px'
                const newMinWidth = window.innerWidth < 450 ? '300px' : '375px'; // Change the value here
                setMinWidth(newMinWidth);
            }
        };

        // Call the function initially
        handleResize();

        // Add an event listener for the resize event
        // The handleResize function will be called whenever the window is resized
        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component is unmounted or the dependency changes
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isMinWidth]);

    return (
        <div className={classes.card} style={{ height, width, minWidth }}>
            {children}
        </div>
    )
}

export default Card;