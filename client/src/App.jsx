import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './page/login';
import Register from './page/register';
import { AuthProvider } from './auth/AuthContex';
import Home from './page/home';
import AgentProfile from './page/agentProfile';
import Myproperties from './page/mypropertiesAgent';
import SingleProperty from './component/common/singleProperty';
import AgentDashboard from './page/agentDashboard';
import AddPropertyForm from './component/dashboard/addProperty';
import Buy from './page/buy';
import Rent from './page/rent';
import KathmanduProperties from './page/cities/kathmanduProperty';
import BhaktapurProperties from './page/cities/bhaktapurProperty';
import LalitpurProperties from './page/cities/lalitpurProperty';
import FavoritesPage from './page/favorites';
import EditProperty from './page/Edit';
import BookingRequest from './component/dashboard/booking';
import BookVisit from './component/dashboard/bookingVisitClient';
import Messages from './component/dashboard/message';
import ProtectedRoute from './utlis/protectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/client/profile"
            element={
              <ProtectedRoute>
                <AgentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/profile"
            element={
              <ProtectedRoute>
                <AgentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agent/properties"
            element={
              <ProtectedRoute>
                <Myproperties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/add-property"
            element={
              <ProtectedRoute>
                <AddPropertyForm />
              </ProtectedRoute>
            }
          />
          <Route path="/agent/booking-request" element={<BookingRequest />} />
          <Route path="/client/visits" element={<BookVisit />} />
          <Route
            path="/property/:id"
            element={
              <ProtectedRoute>
                <SingleProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/dashboard"
            element={
              <ProtectedRoute>
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/message"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/message"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/city/kathmandu"
            element={
              <ProtectedRoute>
                <KathmanduProperties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/city/bhaktapur"
            element={
              <ProtectedRoute>
                <BhaktapurProperties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/city/lalitpur"
            element={
              <ProtectedRoute>
                <LalitpurProperties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/property/edit/:id"
            element={
              <ProtectedRoute>
                <EditProperty />
              </ProtectedRoute>
            }
          />
          <Route path="/buy" element={<Buy />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
