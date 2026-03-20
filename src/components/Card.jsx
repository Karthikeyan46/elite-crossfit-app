import React from 'react';
import './Card.css';

const Card = ({
    children,
    className = '',
    hoverEffect = true,
    glass = true,
    ...props
}) => {
    const classes = [
        'card',
        glass ? 'glass-panel' : '',
        hoverEffect ? 'hover-lift' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

export default Card;
