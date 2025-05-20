import React, { useState } from 'react';
import apis from '../../context/Api';
import { useAuth } from '../../context/AuthContext';

const RequestForm = ({ parkId, spots, onRequestSubmitted }) => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        spotId: '',
        startTime: '',
        endTime: '',
        vehicleNumber: ''
    });
    console.log(currentUser)
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            const response = await apis.post('/users/requests', {
                parkId,
                spotId: formData.spotId,
                startTime: formData.startTime,
                endTime: formData.endTime,
                vehicleNumber: formData.vehicleNumber
            });
            console.log(response.data);
            
            setSuccess('Parking request submitted successfully!');
            // Clear form and optionally close it
            setFormData({
                spotId: '',
                startTime: '',
                endTime: '',
                vehicleNumber: ''
            });
            // Call the callback to close the form if needed
            if (onRequestSubmitted) onRequestSubmitted();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit request');
        }
    };

    // Filter available spots (using isOccupied instead of status)
    const availableSpots = spots.filter(spot => !spot.isOccupied);

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">New Parking Request</h3>
            
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}
            
            {availableSpots.length === 0 ? (
                <div className="text-yellow-600 mb-4">
                    No available spots found. Please try another time.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Spot</label>
                        <select
                            name="spotId"
                            value={formData.spotId}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select a spot</option>
                            {availableSpots.map(spot => (
                                <option key={spot.id} value={spot.id}>
                                    {spot.spotNumber} {/* Changed from spot.number to spot.spotNumber */}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2">Vehicle Number</label>
                        <input
                            type="text"
                            name="vehicleNumber"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2">Start Time</label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2">End Time</label>
                        <input
                            type="datetime-local"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                </div>
            )}
            
            <button
                type="submit"
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                disabled={availableSpots.length === 0}
            >
                Submit Request
            </button>
        </form>
    );
};

export default RequestForm;