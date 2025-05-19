import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const RequestCard = ({ request, onCancel, onStatusUpdate, showActions = false, showOwnerActions = false }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <h3 className="font-semibold">Park: {request.park.name}</h3>
                    <p className="text-gray-600">Spot: {request.spot.number}</p>
                </div>
                
                <div>
                    <p className="font-semibold">Time Slot:</p>
                    <p className="text-gray-600">
                        {moment(request.startTime).format('lll')} - {moment(request.endTime).format('lll')}
                    </p>
                </div>
                
                <div>
                    <p className="font-semibold">Status:</p>
                    <span className={`px-2 py-1 rounded text-sm ${
                        request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {request.status}
                    </span>
                </div>
            </div>
            
            {showActions && request.status === 'PENDING' && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => onCancel(request.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                    >
                        Cancel Request
                    </button>
                </div>
            )}
            
            {showOwnerActions && request.status === 'PENDING' && (
                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        onClick={() => onStatusUpdate(request.id, 'REJECTED')}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => onStatusUpdate(request.id, 'APPROVED')}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                    >
                        Approve
                    </button>
                </div>
            )}
        </div>
    );
};

export default RequestCard;