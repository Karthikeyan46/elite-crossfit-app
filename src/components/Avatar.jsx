import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({ url, name, size = 'md', className = '' }) => {
    const sizeMap = {
        sm: { width: '32px', height: '32px', iconSize: 16 },
        md: { width: '48px', height: '48px', iconSize: 24 },
        lg: { width: '80px', height: '80px', iconSize: 40 },
        xl: { width: '120px', height: '120px', iconSize: 60 }
    };

    const currentSize = sizeMap[size] || sizeMap.md;

    const style = {
        width: currentSize.width,
        height: currentSize.height,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '2px solid var(--primary)',
        flexShrink: 0
    };

    if (url) {
        return (
            <div style={style} className={className} title={name}>
                <img
                    src={url}
                    alt={`${name}'s avatar`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                        e.target.onerror = null; // prevents looping
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={currentSize.iconSize} color="var(--primary)" />
                </div>
            </div>
        );
    }

    return (
        <div style={style} className={className} title={name}>
            <User size={currentSize.iconSize} color="var(--primary)" />
        </div>
    );
};

export default Avatar;
