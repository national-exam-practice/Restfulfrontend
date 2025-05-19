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
                        <h3 className="text-xl font-bold mb-4">ParkEasy</h3>
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
                            <li><Link to="/services/valet" className="hover:text-blue-400 transition">Valet Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" />
                                <span>123 Parking Street, Cityville, ST 12345</span>
                            </li>
                            <li className="flex items-center">
                                <FaPhone className="mr-3" />
                                <span>(123) 456-7890</span>
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="mr-3" />
                                <span>info@parkeasy.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Subscription */}
                <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h4>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                            type="email" 
                            placeholder="Your email address" 
                            className="flex-grow p-3 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition">
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Copyright and Legal */}
                <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} ParkEasy. All rights reserved.
                    </div>
                    <div className="flex space-x-6">
                        <Link to="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-blue-400 transition">Terms of Service</Link>
                        <Link to="/cookies" className="hover:text-blue-400 transition">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;