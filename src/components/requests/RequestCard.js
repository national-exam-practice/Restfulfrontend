import React from 'react';
import moment from 'moment';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketDocument from './TicketDocument';

const RequestCard = ({ request, onCancel, onExit, showActions = false }) => {
    if (!request) {
        return <div className="bg-white rounded-lg shadow-md p-6">No request data available</div>;
    }

    const parkName = request.park?.name || 'Unknown Park';
    const spotNumber = request.spot?.spotNumber || 'N/A';
    const status = request.status || 'UNKNOWN';
    const startTimeFormatted = request.startTime ? moment(request.startTime).format('lll') : 'N/A';
    const endTimeFormatted = request.endTime ? moment(request.endTime).format('lll') : 'Ongoing';
    const canExit = status === 'APPROVED' && !request.endTime;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <h3 className="font-semibold">Park: {parkName}</h3>
                    <p className="text-gray-600">Spot: {spotNumber}</p>
                </div>
                
                <div>
                    <p className="font-semibold">Time Slot:</p>
                    <p className="text-gray-600">
                        {startTimeFormatted} - {endTimeFormatted}
                    </p>
                </div>
                
                <div>
                    <p className="font-semibold">Status:</p>
                 <span className={`px-2 py-1 rounded text-sm ${
  status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
  status === 'APPROVED' ? 'bg-green-100 text-green-800' :
  status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 
  status === 'REJECTED' ? 'bg-red-100 text-red-800' :
  'bg-gray-100 text-gray-800'
}`}>
                        {status}
                    </span>
                </div>
            </div>

            <div className="mt-2">
                <p className="font-semibold">
                    Total Amount: ${request.totalAmount?.toFixed(2) || '0.00'}
                </p>
            </div>

            {request.endTime && (
                <div className="mt-4 flex justify-start">
                    <PDFDownloadLink
                        document={<TicketDocument request={request} />}
                        fileName={`parking-receipt-${request.id || 'unknown'}.pdf`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                    >
                        {({ loading }) => (loading ? 'Generating Receipt...' : 'Download Receipt')}
                    </PDFDownloadLink>
                </div>
            )}

            {canExit && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => onExit(request.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition"
                    >
                        Exit Parking
                    </button>
                </div>
            )}

            {showActions && status === 'PENDING' && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => onCancel(request.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                    >
                        Cancel Request
                    </button>
                </div>
            )}
        </div>
    );
};

export default RequestCard;