// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import LoginPage from './pages/Login';
// import RegisterPage from './pages/Register';
// // import NewPost from './pages/NewPost';
// // import PrivateRoute from './components/PrivateRoute';
// // import MyPosts from './pages/MyPosts';

// const App = () => {
//     return (
//         <Router>
//             <AuthProvider>
//                 <Navbar />
//                 <Routes>
//                     <Route path="/" element={<Home />} />
//                     <Route path="/login" element={<LoginPage />} />
//                     <Route path="/register" element={<RegisterPage />} />
//                     {/* <Route element={<PrivateRoute />}>
//                         <Route path="/new" element={<NewPost />} />
//                         <Route path="/my-posts" element={<MyPosts />} />

//                     </Route> */}
//                 </Routes>
//             </AuthProvider>
//         </Router>
//     );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Parks from './pages/Parks';
import ParkDetails from './components/parks/ParkDetails';
import MyParks from './pages/MyParks';
import ParkForm from './components/parks/ParkForm';
import PendingParks from './pages/PendingParks';
import Requests from './pages/Requests';
import OwnerRequests from './pages/OwnerRequests';
// import PrivateRoute from './components/common/PrivateRoute';
import PrivateRoute from './components/common/PrivateRoute';
import ResetPasswordPage from './pages/ResetPassword';


function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ResetPasswordPage />} />
                            
                            <Route path="/parks" element={<Parks />} />
                            <Route path="/parks/:id" element={<ParkDetails />} />
                            
                            <Route element={<PrivateRoute />}>
                                <Route path="/my-parks" element={<MyParks />} />
                                <Route path="/parks/new" element={<ParkForm />} />
                                <Route path="/parks/:id/edit" element={<ParkForm editMode={true} />} />
                                
                                <Route path="/requests" element={<Requests />} />
                                <Route path="/owner/requests" element={<OwnerRequests />} />
                                
                                <Route path="/pending-parks" element={<PendingParks />} />
                            </Route>
                        </Routes>
                    </main>
                    
                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;