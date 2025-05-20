import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">PARKINGA</h3>
                        <p className="mb-4">
                            Making parking simple, convenient, and stress-free for everyone.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-blue-400 transition"><FaFacebook size={20} /></a>
                            <a href="#" className="hover:text-blue-400 transition"><FaTwitter size={20} /></a>
                            <a href="#" className="hover:text-blue-400 transition"><FaInstagram size={20} /></a>
                            <a href="#" className="hover:text-blue-400 transition"><FaLinkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
                            <li><Link to="/parks" className="hover:text-blue-400 transition">Find Parking</Link></li>
                            <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-400 transition">Contact</Link></li>
                            <li><Link to="/faq" className="hover:text-blue-400 transition">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Services</h4>
                        <ul className="space-y-2">
                            <li><Link to="/services/hourly" className="hover:text-blue-400 transition">Hourly Parking</Link></li>
                            <li><Link to="/services/daily" className="hover:text-blue-400 transition">Daily Parking</Link></li>
                            <li><Link to="/services/monthly" className="hover:text-blue-400 transition">Monthly Parking</Link></li>
                            <li><Link to="/services/events" className="hover:text-blue-400 transition">Event Parking</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" />
                                <span>Parking Street, Kigali, Rwanda</span>
                            </li>
                            <li className="flex items-center">
                                <FaPhone className="mr-3" />
                                <span>(+250) 791726280</span>
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="mr-3" />
                                <span>sibomanaedouard@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;