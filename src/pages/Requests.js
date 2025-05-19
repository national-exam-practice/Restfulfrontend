import React, { useState, useEffect } from 'react';
import apis from '../context/Api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import RequestCard from '../components/requests/RequestCard';
import { Link } from 'react-router-dom';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await apis.get('/users/requests');
                setRequests(response.data.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch requests');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleCancel = async (requestId) => {
        try {
            await apis.patch(`/users/requests/${requestId}/cancel`);
            setRequests(prev => prev.filter(req => req._id !== requestId));
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to cancel request');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">My Parking Requests</h1>
            
            {requests.length > 0 ? (
                <div className="space-y-4">
                    {requests.map(request => (
                        <RequestCard 
                            key={request._id} 
                            request={request} 
                            onCancel={handleCancel}
                            showActions={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500">You haven't made any parking requests yet.</p>
                    <Link 
                        to="/parks"
                        className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                    >
                        Find Parking
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Requests;