import React, { useState } from 'react';
import { X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Button from './Button';
import './FreeTrialModal.css';

const FreeTrialModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_mobile: formData.mobile,
                    from_email: formData.email,
                    reply_to: formData.email,
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ name: '', mobile: '', email: '' });
                onClose();
            }, 4000);
        } catch (error) {
            console.error('EmailJS Error:', error);
            const errorMessage = error?.text || error?.message || 'Check your EmailJS configuration.';
            alert(`Failed to send: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel animate-fade-in">
                <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                    <X size={24} />
                </button>

                <div className="modal-header">
                    <h2>Claim Your Free Trial</h2>
                    <p>Experience the Elite CrossFit difference. Fill out the form below to get started.</p>
                </div>

                {!isSubmitted ? (
                    <form className="free-trial-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mobile">Mobile Number</label>
                            <input
                                type="tel"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="Enter your mobile number"
                                pattern="[0-9]{10}"
                                title="Please enter a valid 10-digit mobile number"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
                        <Button type="submit" variant="primary" className="submit-btn" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Claim 7-Day Pass'}
                        </Button>
                    </form>
                ) : (
                    <div className="success-message animate-fade-in">
                        <div className="success-icon">✓</div>
                        <h3>You're All Set!</h3>
                        <p>We'll be in touch shortly to schedule your first visit.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreeTrialModal;
