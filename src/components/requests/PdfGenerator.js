import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#666666'
  },
  section: {
    marginBottom: 15,
    padding: 15,
    border: '1px solid #EEEEEE',
    borderRadius: 5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  label: {
    fontWeight: 'bold',
    width: '40%'
  },
  value: {
    width: '60%'
  },
  total: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: '1px solid #DDDDDD',
    fontWeight: 'bold'
  }
});

const TicketDocument = ({ request }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>PARKING TICKET</Text>
        <Text style={styles.subtitle}>Thank you for using our service</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Ticket Number:</Text>
          <Text style={styles.value}>{request._id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Parking Spot:</Text>
          <Text style={styles.value}>{request.spot.spotNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Parking Location:</Text>
          <Text style={styles.value}>{request.park.address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Start Time:</Text>
          <Text style={styles.value}>{new Date(request.startTime).toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>End Time:</Text>
          <Text style={styles.value}>{new Date(request.endTime).toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>BILLING INFORMATION</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Hourly Rate:</Text>
          <Text style={styles.value}>${request.park.hourlyRate.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Duration (hours):</Text>
          <Text style={styles.value}>
            {((new Date(request.endTime) - new Date(request.startTime)) / (1000 * 60 * 60)).toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>
            ${(request.park.hourlyRate * 
              ((new Date(request.endTime) - new Date(request.startTime)) / (1000 * 60 * 60))).toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tax (10%):</Text>
          <Text style={styles.value}>
            ${(request.park.hourlyRate * 
              ((new Date(request.endTime) - new Date(request.startTime)) / (1000 * 60 * 60)) * 0.1).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.row, styles.total]}>
          <Text style={styles.label}>Total Amount:</Text>
          <Text style={styles.value}>
            ${(request.park.hourlyRate * 
              ((new Date(request.endTime) - new Date(request.startTime)) / (1000 * 60 * 60)) * 1.1).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 30, fontSize: 10, color: '#999999', textAlign: 'center' }}>
        <Text>Please present this ticket when entering the parking facility</Text>
        <Text>Ticket valid only for the specified date and time</Text>
      </View>
    </Page>
  </Document>
);

export const PdfGenerator = ({ request }) => (
  <PDFDownloadLink 
    document={<TicketDocument request={request} />} 
    fileName={`ticket_${request.id}.pdf`}
  >
    {({ loading }) => (
      <button 
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
        disabled={loading}
      >
        {loading ? 'Generating PDF...' : 'Download Ticket'}
      </button>
    )}
  </PDFDownloadLink>
);