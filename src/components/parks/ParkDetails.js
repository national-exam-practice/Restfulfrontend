import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apis from '../../context/Api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import RequestForm from '../requests/RequestForm';

const ParkDetails = () => {
    const { id } = useParams();
    const [park, setPark] = useState(null);
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [availableSpotsCount, setAvailableSpotsCount] = useState(0);

    useEffect(() => {
        const fetchParkDetails = async () => {
            try {
                const [parkResponse, spotsResponse] = await Promise.all([
                    apis.get(`/parks/${id}`),
                    apis.get(`/spots/park/${id}`)
                ]);

                setPark(parkResponse.data.data);
                setSpots(spotsResponse.data.data || []);
                
                // Calculate available spots
                const availableCount = spotsResponse.data.data 
                    ? spotsResponse.data.data.filter(spot => !spot.isOccupied).length 
                    : 0;
                setAvailableSpotsCount(availableCount);
                
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch park details');
            } finally {
                setLoading(false);
            }
        };

        fetchParkDetails();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!park) return <p className="text-gray-500 text-center py-8">Park not found.</p>;

    const isFullyBooked = availableSpotsCount === 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Park Header with Image */}
             <div className="h-48 bg-gray-200 flex items-center justify-center">
    {park.image_url ? (
        <img 
            src={park.image_url.startsWith('/uploads') 
                ? `http://localhost:5000${park.image_url}`
                : park.image_url
            }
            alt={park.name}
            className="h-full w-full object-cover"
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x200?text=No+Image+Available';
            }}
        />
    ) : (
        <div className="text-gray-500">
            No image available
        </div>
    )}
</div>
                
                {/* Park Details */}
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{park.name}</h1>
                            <p className="text-gray-600">{park.address}</p>
                        </div>
                        <span className={`text-sm font-medium px-2.5 py-0.5 rounded ${
                            isFullyBooked 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                        }`}>
                            {isFullyBooked 
                                ? 'Fully booked' 
                                : `${availableSpotsCount} of ${park.totalSpots} spots available`
                            }
                        </span>
                    </div>
                    
                    {/* Key Information Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Hourly Rate</p>
                            <p className="font-semibold">${park.hourlyRate.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Capacity</p>
                            <p className="font-semibold">{park.totalSpots} spots</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="font-semibold">{park.type || 'Standard'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Rating</p>
                            <p className="font-semibold">{park.rating || 'N/A'}</p>
                        </div>
                    </div>
                    
                    {/* Description */}
                    {park.description && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">About this parking</h3>
                            <p className="text-gray-600 whitespace-pre-line">{park.description}</p>
                        </div>
                    )}
                    
                    {/* Amenities */}
                    {park.amenities && park.amenities.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {park.amenities.map((amenity, index) => (
                                    <span 
                                        key={index} 
                                        className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Request Form */}
                    {showRequestForm && !isFullyBooked && (
                        <div className="mb-6 transition-all duration-300 ease-in-out">
                            <RequestForm 
                                parkId={id} 
                                spots={spots.filter(spot => !spot.isOccupied)} 
                                onRequestSubmitted={() => {
                                    setShowRequestForm(false);
                                    // Refresh available spots count after submission
                                    const newAvailableCount = spots.filter(spot => !spot.isOccupied).length - 1;
                                    setAvailableSpotsCount(newAvailableCount);
                                }} 
                            />
                        </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                            onClick={() => setShowRequestForm(!showRequestForm)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                !isFullyBooked 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                            disabled={isFullyBooked}
                        >
                            {!isFullyBooked 
                                ? (showRequestForm ? 'Cancel Booking' : 'Book Parking Spot')
                                : 'No Available Spots'
                            }
                        </button>
                        
                        <button 
                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(park.address)}`;
                                window.open(mapsUrl, '_blank');
                            }}
                        >
                            Get Directions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParkDetails;