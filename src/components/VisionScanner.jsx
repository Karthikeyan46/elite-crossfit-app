import React, { useState } from 'react';
import { Camera, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import './VisionScanner.css';
import { analyzeFoodImage } from '../lib/gemini';

const VisionScanner = ({ onResult }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const scanFood = async () => {
        setLoading(true);
        setError(null);

        try {
            // Convert file to base64 for gemini utility
            const base64Data = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(image);
            });

            const data = await analyzeFoodImage(base64Data);
            
            // Map 'name' from gemini.js to 'itemName' if components expect it, 
            // but better to fix components to use 'name'.
            // For now, let's provide both to be safe.
            const result = {
                ...data,
                itemName: data.name
            };

            onResult(result);
        } catch (err) {
            console.error('AI Scan Error:', err);
            setError(`AI Error: ${err.message || 'Failed to analyze image'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vision-scanner glass-panel">
            <div className="upload-section">
                {!preview ? (
                    <label className="upload-placeholder">
                        <Camera size={48} className="primary" />
                        <p>Upload or Take a Photo</p>
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                    </label>
                ) : (
                    <div className="preview-container">
                        <img src={preview} alt="Meal preview" className="meal-preview" />
                        {!loading && (
                            <button className="change-btn" onClick={() => { setImage(null); setPreview(null); }}>
                                Change Photo
                            </button>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className="error-box">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {image && !loading && !error && (
                <button className="primary-button scan-btn" onClick={scanFood}>
                    Analyze Meal
                </button>
            )}

            {loading && (
                <div className="loading-box">
                    <Loader2 size={32} className="animate-spin primary" />
                    <p>AI is analyzing your plate...</p>
                </div>
            )}
        </div>
    );
};

export default VisionScanner;
