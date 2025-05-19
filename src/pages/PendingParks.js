import React, { useState, useEffect } from 'react';
import apis from '../context/Api';
import ParkList from '../components/parks/ParkList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import ParkCard from '../components/parks/ParkCard';

const PendingParks = () => {
    const [parks, setParks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAdmin } = useAuth();

    useEffect(() => {
        if (!isAdmin) return;

        const fetchPendingParks = async () => {
            try {
                const response = await apis.get('/parks/pending');
                setParks(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch pending parks');
            } finally {
                setLoading(false);
            }
        };

        fetchPendingParks();
    }, [isAdmin]);

    const handleApprove = async (parkId, isApproved) => {
        try {
            await apis.patch(`/parks/${parkId}/approve`, { isApproved });
            setParks(prev => prev.filter(park => park.id !== parkId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update park status');
        }
    };

    if (!isAdmin) {
        return (
            <div className="container mx-auto p-4">
                <ErrorMessage message="You need to be an admin to access this page" />
            </div>
        );
    }

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Parks Pending Approval</h1>
            
            {parks.length > 0 ? (
                <div className="space-y-6">
                    {parks.map(park => (
                        <div key={park.id} className="bg-white rounded-lg shadow-md p-6">
                            <ParkCard park={park} />
                            <div className="mt-4 flex justify-end space-x-4">
                                <button
                                    onClick={() => handleApprove(park.id, false)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleApprove(park.id, true)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500">No parks pending approval.</p>
                </div>
            )}
        </div>
    );
};

export default PendingParks;