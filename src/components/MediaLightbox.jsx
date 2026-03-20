import React from 'react';
import { X } from 'lucide-react';

const MediaLightbox = ({ item, onClose }) => {
    if (!item) return null;

    return (
        <div className="lightbox-modal fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
            <button className="close-lightbox absolute top-8 right-8 text-white hover:text-primary transition-colors" onClick={onClose}>
                <X size={32} />
            </button>
            
            <div className="lightbox-content max-w-5xl w-full" onClick={e => e.stopPropagation()}>
                {item.type === 'video' || item.url.endsWith('.mp4') ? (
                    <video 
                        src={item.url} 
                        controls 
                        autoPlay 
                        className="w-full max-h-[80vh] rounded-lg shadow-2xl"
                    />
                ) : (
                    <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" 
                    />
                )}
                <div className="mt-6 text-center">
                    {item.category && <span className="text-primary text-xs font-bold uppercase tracking-wider">{item.category}</span>}
                    <h2 className="text-2xl font-bold mt-2 text-white">{item.title}</h2>
                </div>
            </div>
        </div>
    );
};

export default MediaLightbox;
