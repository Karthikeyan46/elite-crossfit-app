import React from 'react';
import { Dumbbell, Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <Dumbbell className="logo-icon text-gradient" size={28} />
                        <span className="logo-text text-gradient">Elite <span style={{ color: 'var(--color-primary)' }}>CrossFit</span> Udumalapet</span>
                    </div>
                    <p className="footer-description">
                        Forging strength and character. Join us today to transform your body and mind in the most energetic environment.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-icon hover-scale"><Facebook size={20} /></a>
                        <a href="#" className="social-icon hover-scale"><Twitter size={20} /></a>
                        <a href="https://www.instagram.com/elite_crossfit_studio_udt/" target="_blank" rel="noopener noreferrer" className="social-icon hover-scale"><Instagram size={20} /></a>
                    </div>
                </div>

                <div className="footer-links-group">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/" className="footer-link">Home</a></li>
                        <li><a href="/blog" className="footer-link">Blog</a></li>
                        <li><a href="/gallery" className="footer-link">Gallery</a></li>
                        <li><a href="/testimonials" className="footer-link">Testimonials</a></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h4>Contact Us</h4>
                    <ul>
                        <li>
                            <MapPin size={18} className="contact-icon" />
                            <span>129, Palani Rd, near 5K Car Care, Udumalaipettai, Tamil Nadu 642126</span>
                        </li>
                        <li>
                            <Phone size={18} className="contact-icon" />
                            <span>063830 30651</span>
                        </li>
                        <li>
                            <Mail size={18} className="contact-icon" />
                            <span>info@elitecrossfit.com</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Elite CrossFit Udumalapet. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
