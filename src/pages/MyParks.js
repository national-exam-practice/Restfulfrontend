import React, { useState, useEffect } from 'react';
import apis from '../context/Api';
import ParkList from '../components/parks/ParkList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyParks = () => {
    const [parks, setParks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isOwner } = useAuth();

    useEffect(() => {
        if (!isOwner) return;

        const fetchMyParks = async () => {
            try {
                const response = await apis.get('/parks/my-parks');
                setParks(response.data.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch your parks');
            } finally {
                setLoading(false);
            }
        };

        fetchMyParks();
    }, [isOwner]);

    if (!isOwner) {
        return (
            <div className="container mx-auto p-4">
                <ErrorMessage message="You need to be a parking lot owner to access this page" />
            </div>
        );
    }

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Parking Locations</h1>
                <Link 
                    to="/parks/new"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                >
                    Add New Park
                </Link>
            </div>
            
            {parks.length > 0 ? (
                <ParkList parks={parks} />
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500 mb-4">You haven't added any parking locations yet.</p>
                    <Link 
                        to="/parks/new"
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                    >
                        Add Your First Park
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyParks;