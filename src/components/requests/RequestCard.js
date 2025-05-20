import React from 'react';
// import { Link } from 'react-router-dom';
import moment from 'moment';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottom: '1px solid #eee',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  label: {
    fontWeight: 'bold',
    width: '40%'
  },
  value: {
    width: '60%'
  },
  total: {
    marginTop: 15,
    paddingTop: 10,
    borderTop: '1px solid #eee',
    fontWeight: 'bold'
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    color: '#999',
    textAlign: 'center'
  }
});

// PDF Document Component
const TicketDocument = ({ request }) => {
  // Add safety checks for undefined values
  if (!request || !request.park || !request.spot) {
    // Return a simple document with error message if data is incomplete
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>PARKING TICKET</Text>
            <Text style={styles.subtitle}>Parking Management System</Text>
          </View>
          <View style={styles.section}>
            <Text>Insufficient data to generate ticket.</Text>
          </View>
        </Page>
      </Document>
    );
  }

  // Add safety checks and default values
  const hourlyRate = request.park.hourlyRate || 0;
  const startTime = request.startTime ? moment(request.startTime) : moment();
  const endTime = request.endTime ? moment(request.endTime) : moment().add(1, 'hour');
  
  const durationHours = endTime.diff(startTime, 'hours', true);
  const subtotal = hourlyRate * durationHours;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>PARKING TICKET</Text>
          <Text style={styles.subtitle}>Parking Management System</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parking Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Ticket #:</Text>
            <Text style={styles.value}>{request.id || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Park Name:</Text>
            <Text style={styles.value}>{request.park.name || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Spot Number:</Text>
            <Text style={styles.value}>{request.spot.number || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{request.park.address || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Start Time:</Text>
            <Text style={styles.value}>{startTime.format('lll')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>End Time:</Text>
            <Text style={styles.value}>{endTime.format('lll')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>{durationHours.toFixed(2)} hours</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Hourly Rate:</Text>
            <Text style={styles.value}>${hourlyRate.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal:</Text>
            <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tax (10%):</Text>
            <Text style={styles.value}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.row, styles.total]}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.value}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Please present this ticket when entering the parking facility</Text>
          <Text>Ticket valid only for the specified date and time</Text>
        </View>
      </Page>
    </Document>
  );
};

const RequestCard = ({ request, onCancel, onStatusUpdate, showActions = false, showOwnerActions = false }) => {
  // Add safety check for the request object
  if (!request) {
    return <div className="bg-white rounded-lg shadow-md p-6">No request data available</div>;
  }

  // Make sure park and spot exist with fallbacks
  const parkName = request.park?.name || 'Unknown Park';
  const spotNumber = request.spot?.number || 'N/A';
  const status = request.status || 'UNKNOWN';
  
  // Safe time formatting
  const startTimeFormatted = request.startTime ? moment(request.startTime).format('lll') : 'N/A';
  const endTimeFormatted = request.endTime ? moment(request.endTime).format('lll') : 'N/A';

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
            status === 'REJECTED' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {status}
          </span>
        </div>
      </div>
      
      {/* PDF Download Button - Only show for approved requests with complete data */}
      {status === 'APPROVED' && request.park && request.spot && (
        <div className="mt-4 flex justify-start">
          <PDFDownloadLink
            document={<TicketDocument request={request} />}
            fileName={`parking-ticket-${request.id || 'unknown'}.pdf`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
          >
            {({ loading }) => (loading ? 'Generating Ticket...' : 'Download Ticket')}
          </PDFDownloadLink>
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
      
      {showOwnerActions && status === 'PENDING' && (
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