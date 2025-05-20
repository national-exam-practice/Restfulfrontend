import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ParkCard = ({ park }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleViewDetails = (e) => {
        if (!currentUser) {
            e.preventDefault(); 
            navigate('/login', { 
                state: { 
                    from: `/parks/${park.id}`,
                    message: 'Please login to view park details' 
                } 
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{park.name}</h3>
                <p className="text-gray-600 mb-2">{park.address}</p>
                <p className="text-gray-600 mb-2">Hourly Rate: ${park.hourlyRate}</p>
                <p className="text-gray-600 mb-4">Available Spots: {park.availableSpots}/{park.totalSpots}</p>
                <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-sm ${
                        park.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        park.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {park.status}
                    </span>
                    
                    {currentUser ? (
                        <Link 
                            to={`/parks/${park.id}`}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                        >
                            View Details
                        </Link>
                    ) : (
                        <button
                            onClick={handleViewDetails}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                        >
                            Login to View Details
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParkCard;