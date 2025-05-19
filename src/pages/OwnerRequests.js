import React, { useState, useEffect } from 'react';
import apis from '../context/Api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import RequestCard from '../components/requests/RequestCard';
import { useAuth } from '../context/AuthContext';

const OwnerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isOwner } = useAuth();

    useEffect(() => {
        if (!isOwner) return;

        const fetchOwnerRequests = async () => {
            try {
                const response = await apis.get('/users/owner/requests');
                setRequests(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch requests');
            } finally {
                setLoading(false);
            }
        };

        fetchOwnerRequests();
    }, [isOwner]);

    const handleStatusUpdate = async (requestId, status) => {
        try {
            await apis.patch(`/users/requests/${requestId}/status`, { status });
            setRequests(prev => prev.map(req => 
                req._id === requestId ? { ...req, status } : req
            ));
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update request');
        }
    };

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
            <h1 className="text-2xl font-bold mb-6">Parking Requests for My Lots</h1>
            
            {requests.length > 0 ? (
                <div className="space-y-4">
                    {requests.map(request => (
                        <RequestCard 
                            key={request.id} 
                            request={request} 
                            onStatusUpdate={handleStatusUpdate}
                            showOwnerActions={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500">No pending requests for your parking lots.</p>
                </div>
            )}
        </div>
    );
};

export default OwnerRequests;