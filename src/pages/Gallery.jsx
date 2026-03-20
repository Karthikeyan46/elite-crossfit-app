import React, { useState } from 'react';
import { Image as ImageIcon, Video, Maximize2, Filter, PlayCircle } from 'lucide-react';
import { galleryItems } from '../data/gymData';
import MediaLightbox from '../components/MediaLightbox';
import './Gallery.css';

const Gallery = () => {
    const [filter, setFilter] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);
    
    const categories = ['All', 'Facility', 'Training', 'Success'];

    const filteredItems = filter === 'All' 
        ? galleryItems 
        : galleryItems.filter(item => item.category === filter);

    const openLightbox = (item) => setSelectedItem(item);
    const closeLightbox = () => setSelectedItem(null);

    return (
        <div className="gallery-page animate-fade-in">
            <header className="gallery-header container">
                <h1 className="text-gradient">Community <span style={{ color: 'var(--color-primary)' }}>Gallery</span></h1>
                <p className="text-dim">Witness the energy, progress, and transformations within the ELITE CROSS Fit Studio ecosystem.</p>
                
                <div className="filter-bar mt-8 flex flex-wrap justify-center gap-4">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            className={`filter-btn px-6 py-2 rounded-full border transition-all ${filter === cat ? 'bg-primary text-black border-primary' : 'border-white/10 hover:border-primary/50 text-dim'}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <div className="gallery-grid container">
                {filteredItems.map((item) => (
                    <div 
                        key={item.id} 
                        className="gallery-item glass-panel group cursor-pointer"
                        onClick={() => openLightbox(item)}
                    >
                        <div className="gallery-media-wrapper relative overflow-hidden aspect-video bg-secondary">
                            {item.type === 'video' ? (
                                <div className="video-container w-full h-full relative">
                                    <video 
                                        src={item.url} 
                                        className="gallery-img w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                    />
                                </div>
                            ) : (
                                <img src={item.url} alt={item.title} className="gallery-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            )}
                            
                            <div className="gallery-overlay absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="expand-btn absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-primary hover:text-black transition-colors">
                                    <Maximize2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="gallery-info p-4">
                            <h3 className="gallery-title text-xl font-bold">{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <MediaLightbox item={selectedItem} onClose={closeLightbox} />

            <section className="gallery-cta container glass-panel text-center py-16 mt-12">
                <h2 className="text-3xl font-bold mb-4">Share Your Journey</h2>
                <p className="text-dim mb-8 max-w-2xl mx-auto">Are you an ELITE CROSS Fit Studio athlete? Tag us in your workouts to get featured in our community gallery.</p>
                <button className="primary-button px-8 py-3">Submit Your Content</button>
            </section>
        </div>
    );
};

export default Gallery;
