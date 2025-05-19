import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apis from '../context/Api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ParkCard from '../components/parks/ParkCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [featuredParks, setFeaturedParks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState({
        location: '',
        startTime: '',
        endTime: ''
    });
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchFeaturedParks = async () => {
            try {
                const response = await apis.get('/parks?limit=3');
                setFeaturedParks(response.data.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Error fetching featured parking locations');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedParks();
    }, []);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchQuery(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // In a real implementation, this would redirect to parks page with search params
        console.log('Search submitted:', searchQuery);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Parking Spot</h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Book secure parking spaces in advance and save time when you arrive at your destination.
                    </p>
                    
                    {/* Quick Search Form */}
                    <form onSubmit={handleSearchSubmit} className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 text-left mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={searchQuery.location}
                                    onChange={handleSearchChange}
                                    placeholder="Where are you going?"
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-left mb-2">From</label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={searchQuery.startTime}
                                    onChange={handleSearchChange}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-left mb-2">To</label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={searchQuery.endTime}
                                    onChange={handleSearchChange}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            className="mt-4 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                        >
                            Find Parking
                        </button>
                    </form>
                </div>
            </div>

            {/* Featured Parking Locations */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Parking Locations</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover some of our most popular and highly-rated parking spots in the city.
                    </p>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredParks.map(park => (
                            <ParkCard key={park._id} park={park} />
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link
                        to="/parks"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                    >
                        View All Parking Locations
                    </Link>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Parking with us is simple, convenient, and stress-free.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-blue-600 text-2xl font-bold">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Find Parking</h3>
                            <p className="text-gray-600">
                                Search for available parking spots near your destination.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-blue-600 text-2xl font-bold">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Book & Pay</h3>
                            <p className="text-gray-600">
                                Reserve your spot and pay securely online.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-blue-600 text-2xl font-bold">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Park Stress-Free</h3>
                            <p className="text-gray-600">
                                Arrive at your reserved spot and enjoy your time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            {!currentUser && (
                <div className="bg-blue-600 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Parking Spot?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Join thousands of happy customers who park with ease every day.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300"
                            >
                                Sign Up Now
                            </Link>
                            <Link
                                to="/parks"
                                className="bg-transparent border-2 border-white hover:bg-blue-700 font-bold py-3 px-8 rounded-lg transition duration-300"
                            >
                                Browse Parking
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;