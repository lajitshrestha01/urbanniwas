import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react"; 
import Login from "./page/login";
import Register from "./page/register";
import { AuthProvider } from "./auth/AuthContex";
import Home from "./page/home";
import AgentProfile from "./page/agentProfile";
import Myproperties from "./page/mypropertiesAgent";
import SingleProperty from "./component/common/singleProperty";
import AgentDashboard from "./page/agentDashboard";
import AddPropertyForm from "./component/dashboard/addProperty";
import Buy from "./page/buy";
import Rent from "./page/rent"
import KathmanduProperties from "./page/cities/kathmanduProperty";
import BhaktapurProperties from "./page/cities/bhaktapurProperty";
import LalitpurProperties from "./page/cities/lalitpurProperty";
import FavoritesPage from "./page/favorites";
import EditProperty from "./page/Edit";
import BookingRequest from "./component/dashboard/booking";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/client/profile" element={<AgentProfile />} />
          <Route path="/agent/profile" element={<AgentProfile />} />
          <Route path="/agent/properties" element={<Myproperties />} />
          <Route path="/agent/add-property" element={<AddPropertyForm />} />
          <Route path="/agent/booking-request" element={<BookingRequest />} />
          <Route path="/property/:id" element={<SingleProperty />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/properties/city/kathmandu" element={<KathmanduProperties />} />
          <Route path="/properties/city/bhaktapur" element={<BhaktapurProperties />} />
          <Route path="/properties/city/lalitpur" element={<LalitpurProperties />} />
          <Route path="/client/favorites" element={<FavoritesPage />} />
          <Route path="/property/edit/:id" element={<EditProperty />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/login" element={<Login />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
