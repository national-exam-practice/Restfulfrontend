import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Helvetica' },
    header: { marginBottom: 20, textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: 10 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    subtitle: { fontSize: 14, color: '#666' },
    section: { marginBottom: 15 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    label: { fontWeight: 'bold', width: '40%' },
    value: { width: '60%' },
    total: { marginTop: 15, paddingTop: 10, borderTop: '1px solid #eee', fontWeight: 'bold' },
    footer: { marginTop: 30, fontSize: 10, color: '#999', textAlign: 'center' }
});

const TicketDocument = ({ request }) => {
    if (!request || !request.park || !request.spot) {
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

    const isCompleted = !!request.endTime;
    const hourlyRate = request.park.hourlyRate || 0;
    const startTime = request.startTime ? moment(request.startTime) : moment();
    const endTime = isCompleted ? moment(request.endTime) : moment();
    const durationHours = endTime.diff(startTime, 'hours', true);
    const totalAmount = request.totalAmount || (hourlyRate * durationHours);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>{isCompleted ? 'PARKING RECEIPT' : 'PARKING TICKET'}</Text>
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
                        <Text style={styles.value}>{request.spot.spotNumber || 'N/A'}</Text>
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
                        <Text style={styles.value}>{isCompleted ? endTime.format('lll') : 'Ongoing Session'}</Text>
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
                    {isCompleted && (
                        <>
                            <View style={[styles.row, styles.total]}>
                                <Text style={styles.label}>Total Amount:</Text>
                                <Text style={styles.value}>${totalAmount.toFixed(2)}</Text>
                            </View>
                        </>
                    )}
                </View>

                {!isCompleted && (
                    <View style={styles.footer}>
                        <Text>This ticket is valid for ongoing parking session</Text>
                        <Text>Charges will be calculated at exit time</Text>
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default TicketDocument;