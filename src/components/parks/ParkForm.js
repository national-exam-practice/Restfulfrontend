import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apis from '../../context/Api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ParkForm = ({ editMode = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        totalSpots: 10,
        hourlyRate: 2.5,
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (editMode && id) {
            const fetchPark = async () => {
                try {
                    const response = await apis.get(`/parks/${id}`);
                    setFormData(response.data.data);
                } catch (err) {
                    setError(err.response?.data?.error || 'Failed to fetch park details');
                }
            };
            fetchPark();
        }
    }, [editMode, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            if (editMode) {
                await apis.put(`/parks/${id}`, formData);
                setSuccess('Park updated successfully!');
            } else {
                await apis.post('/parks', formData);
                setSuccess('Park created successfully! It will be visible after admin approval.');
                setFormData({
                    name: '',
                    address: '',
                    description: '',
                    totalSpots: 10,
                    hourlyRate: 2.5,
                    image: ''
                });
            }
            
            setTimeout(() => {
                navigate(editMode ? `/parks/${id}` : '/my-parks');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">{editMode ? 'Edit Park' : 'Add New Park'}</h1>
            
            {error && <ErrorMessage message={error} />}
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2">Park Name*</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2">Address*</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows="3"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2">Total Spots*</label>
                        <input
                            type="number"
                            name="totalSpots"
                            value={formData.totalSpots}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            min="1"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2">Hourly Rate ($)*</label>
                        <input
                            type="number"
                            name="hourlyRate"
                            value={formData.hourlyRate}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            min="0"
                            step="0.5"
                            required
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2">Image URL</label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="https://example.com/park-image.jpg"
                        />
                    </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate(editMode ? `/parks/${id}` : '/my-parks')}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition flex items-center"
                    >
                        {loading ? <LoadingSpinner size={4} className="mr-2" /> : null}
                        {editMode ? 'Update Park' : 'Create Park'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ParkForm;