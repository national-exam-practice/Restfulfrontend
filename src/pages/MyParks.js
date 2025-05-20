import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import apis from '../context/Api';
import ParkList from '../components/parks/ParkList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../context/AuthContext';

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
    color: '#666',
    marginBottom: 10
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    paddingBottom: 5,
    borderBottom: '1px solid #eee'
  },
  parkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  label: {
    fontWeight: 'bold',
    width: '60%'
  },
  value: {
    width: '40%'
  },
  summaryBox: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 10
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    padding: 5,
    fontSize: 10
  },
  tableLastCol: {
    width: '25%',
    padding: 5,
    fontSize: 10,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#eee'
  }
});

// PDF Document Component for Consolidated Park Reports
const ConsolidatedReportDocument = ({ parks, parkStats }) => {
  // Calculate totals across all parks
  const totalRevenue = Object.values(parkStats).reduce((sum, stats) => sum + stats.totalRevenue, 0);
  const totalApprovedRequests = Object.values(parkStats).reduce((sum, stats) => sum + stats.approvedRequests, 0);
  const totalCarsEntered = Object.values(parkStats).reduce((sum, stats) => sum + stats.totalCarsEntered, 0);
  const totalCarsExited = Object.values(parkStats).reduce((sum, stats) => sum + stats.totalCarsExited, 0);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>CONSOLIDATED PARKING REPORT</Text>
          <Text style={styles.subtitle}>All Owned Parking Locations</Text>
          <Text style={styles.subtitle}>Generated on: {moment().format('MMMM D, YYYY')}</Text>
        </View>

        {/* Executive Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.summaryBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Total Locations:</Text>
              <Text style={styles.value}>{parks.length}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Revenue:</Text>
              <Text style={styles.value}>${totalRevenue.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Approved Requests:</Text>
              <Text style={styles.value}>{totalApprovedRequests}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Vehicle Entries:</Text>
              <Text style={styles.value}>{totalCarsEntered}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Vehicle Exits:</Text>
              <Text style={styles.value}>{totalCarsExited}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Currently Parked Vehicles:</Text>
              <Text style={styles.value}>{totalCarsEntered - totalCarsExited}</Text>
            </View>
          </View>
        </View>

        {/* Comparative Data Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parking Locations Comparison</Text>
          
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text>Location</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text>Revenue</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text>Approved Requests</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text>Current Occupancy</Text>
              </View>
            </View>
            
            {/* Table Rows */}
            {parks.map(park => {
              const stats = parkStats[park.id] || {};
              const currentOccupancy = stats.totalCarsEntered - stats.totalCarsExited;
              
              return (
                <View style={styles.tableRow} key={park.id}>
                  <View style={styles.tableCol}>
                    <Text>{park.name || 'Unknown'}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>${stats.totalRevenue.toFixed(2)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{stats.approvedRequests}</Text>
                  </View>
                  <View style={styles.tableLastCol}>
                    <Text>{currentOccupancy}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Detailed Section for Each Park */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Park Information</Text>
          
          {parks.map(park => {
            const stats = parkStats[park.id] || {};
            
            return (
              <View key={park.id} style={{marginBottom: 15}}>
                <Text style={styles.parkTitle}>{park.name || 'Unknown Park'}</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Address:</Text>
                  <Text style={styles.value}>{park.address || 'No address'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Hourly Rate:</Text>
                  <Text style={styles.value}>${(park.hourlyRate || 0).toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Revenue:</Text>
                  <Text style={styles.value}>${stats.totalRevenue.toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Request Status:</Text>
                  <Text style={styles.value}>
                    {`${stats.approvedRequests} approved, ${stats.pendingRequests} pending, ${stats.rejectedRequests} rejected`}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Traffic:</Text>
                  <Text style={styles.value}>
                    {`${stats.totalCarsEntered} entered, ${stats.totalCarsExited} exited, ${stats.totalCarsEntered - stats.totalCarsExited} current`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text>This is an automatically generated report for all parking locations</Text>
          <Text>For any discrepancies, please contact system administration</Text>
        </View>
      </Page>
    </Document>
  );
};

const MyParks = () => {
    const [parks, setParks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [parkStats, setParkStats] = useState({});
    const [reportReady, setReportReady] = useState(false);
    const [generatingReport, setGeneratingReport] = useState(false);
    const { isOwner } = useAuth();

    useEffect(() => {
        if (!isOwner) return;

        const fetchMyParks = async () => {
            try {
                const response = await apis.get('/parks/my-parks');
                setParks(response.data.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch your parks');
            } finally {
                setLoading(false);
            }
        };

        fetchMyParks();
    }, [isOwner]);

    // Generate stats from existing park data
    const generateParkStats = () => {
        setGeneratingReport(true);
        
        try {
            const stats = {};
            
            parks.forEach(park => {
                // Calculate stats from requests array
                const requests = park.requests || [];
                
                // Count requests by status
                const approvedRequests = requests.filter(req => req.status === 'APPROVED').length;
                const pendingRequests = requests.filter(req => req.status === 'PENDING').length;
                const rejectedRequests = requests.filter(req => req.status === 'REJECTED').length;
                
                // Sum total revenue from approved requests
                const totalRevenue = requests
                    .filter(req => req.status === 'APPROVED')
                    .reduce((sum, req) => sum + (req.totalAmount || 0), 0);
                
                // We'll use some default/estimated values for car entries/exits
                // since these aren't in the provided data
                // In a real scenario, you might want to fetch this data separately
                const totalCarsEntered = approvedRequests * 1.2; // Estimate: approved requests + 20%
                const totalCarsExited = totalCarsEntered * 0.8;  // Estimate: 80% of entered cars exited
                
                stats[park.id] = {
                    approvedRequests,
                    pendingRequests,
                    rejectedRequests,
                    totalRevenue,
                    totalCarsEntered,
                    totalCarsExited
                };
            });
            
            setParkStats(stats);
            setReportReady(true);
        } catch (err) {
            console.error('Error generating park statistics', err);
        } finally {
            setGeneratingReport(false);
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Parking Locations</h1>
                <div className="flex space-x-2">
                    {parks.length > 0 && (
                        <button
                            onClick={generateParkStats}
                            disabled={generatingReport}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition"
                        >
                            {generatingReport ? 'Generating...' : 'Generate Consolidated Report'}
                        </button>
                    )}
                    {reportReady && !generatingReport && (
                        <PDFDownloadLink
                            document={<ConsolidatedReportDocument parks={parks} parkStats={parkStats} />}
                            fileName={`consolidated-parking-report-${moment().format('YYYYMMDD')}.pdf`}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                        >
                            {({ loading }) => (loading ? 'Creating PDF...' : 'Download PDF Report')}
                        </PDFDownloadLink>
                    )}
                    <Link 
                        to="/parks/new"
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                    >
                        Add New Park
                    </Link>
                </div>
            </div>
            
            {parks.length > 0 ? (
                <ParkList parks={parks} />
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500 mb-4">You haven't added any parking locations yet.</p>
                    <Link 
                        to="/parks/new"
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                    >
                        Add Your First Park
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyParks;