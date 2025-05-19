import React, { useState, useEffect } from 'react';
import apis from '../context/Api';
import ParkList from '../components/parks/ParkList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Parks = () => {
    const [parks, setParks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParks = async () => {
            try {
                const response = await apis.get('/parks');
                setParks(response.data.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch parks');
            } finally {
                setLoading(false);
            }
        };

        fetchParks();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Available Parking Locations</h1>
            {parks.length > 0 ? (
                <ParkList parks={parks} />
            ) : (
                <p className="text-gray-500">No parking locations available.</p>
            )}
        </div>
    );
};

export default Parks;