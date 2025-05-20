import React, { useState } from 'react';
import apis from '../../context/Api';
import { useAuth } from '../../context/AuthContext';

const RequestForm = ({ parkId, spots, onRequestSubmitted }) => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        spotId: '',
        startTime: '',
        endTime: '',
        plateNumber: ''
    });
    const [parkingType, setParkingType] = useState('now'); 
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    console.log('current data :', currentUser);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            // Validate reservation times if needed
            if (parkingType === 'reservation') {
                if (!formData.startTime || !formData.endTime) {
                    throw new Error('Both start and end times are required for reservations');
                }
                if (new Date(formData.startTime) >= new Date(formData.endTime)) {
                    throw new Error('End time must be after start time');
                }
            }

            const payload = {
                parkId,
                spotId: formData.spotId,
                plateNumber: formData.plateNumber,
                ...(parkingType === 'reservation' && {
                    startTime: formData.startTime,
                    endTime: formData.endTime
                })
            };

            const response = await apis.post('/users/requests', payload);
            
            setSuccess(parkingType === 'now' 
                ? 'Parking session started successfully!'
                : 'Reservation created successfully!');
            
            // Clear form
            setFormData({
                spotId: '',
                startTime: '',
                endTime: '',
                plateNumber: ''
            });
            
            if (onRequestSubmitted) onRequestSubmitted();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to submit request');
        }
    };

    const availableSpots = spots.filter(spot => !spot.isOccupied);

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">New Parking Session</h3>
            
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}
            
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Parking Type</label>
                <div className="flex gap-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="parkingType"
                            value="now"
                            checked={parkingType === 'now'}
                            onChange={() => setParkingType('now')}
                            className="mr-2"
                        />
                        Start Parking Now
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="parkingType"
                            value="reservation"
                            checked={parkingType === 'reservation'}
                            onChange={() => setParkingType('reservation')}
                            className="mr-2"
                        />
                        Make Reservation
                    </label>
                </div>
            </div>

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
                                    {spot.spotNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2">Plate Number</label>
                        <input
                            type="text"
                            name="plateNumber"
                            value={formData.plateNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    {parkingType === 'reservation' && (
                        <>
                            <div>
                                <label className="block text-gray-700 mb-2">Start Time</label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    min={new Date().toISOString().slice(0, 16)}
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
                                    min={formData.startTime || new Date().toISOString().slice(0, 16)}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
            
            <div className="mt-4">
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                    disabled={availableSpots.length === 0}
                >
                    {parkingType === 'now' ? 'Start Parking' : 'Create Reservation'}
                </button>
                
                {parkingType === 'now' && (
                    <p className="mt-2 text-sm text-gray-500">
                        Parking will start immediately and charges will be calculated when you exit
                    </p>
                )}
            </div>
        </form>
    );
};

export default RequestForm;