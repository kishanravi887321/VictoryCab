import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import Experiences from './pages/Experiences';
import ExperienceDetail from './pages/ExperienceDetail';
import Guides from './pages/Guides';
import GuideDetail from './pages/GuideDetail';
import AIStudio from './pages/AIStudio';
import AIRecommend from './pages/AIRecommend';
import AIPlan from './pages/AIPlan';
import AIChat from './pages/AIChat';
import Dashboard from './pages/Dashboard';
import Overview from './pages/dashboard/Overview';
import Bookings from './pages/dashboard/Bookings';
import Favorites from './pages/dashboard/Favorites';
import Trips from './pages/dashboard/Trips';
import MyReviews from './pages/dashboard/MyReviews';
import History from './pages/dashboard/History';
import Settings from './pages/dashboard/Settings';
import AdminConsole from './pages/admin/AdminConsole';
import AdminStats from './pages/admin/AdminStats';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBusinesses from './pages/admin/AdminBusinesses';
import AdminReviews from './pages/admin/AdminReviews';
import AdminAudit from './pages/admin/AdminAudit';
import BusinessConsole from './pages/business/BusinessConsole';
import BusinessOverview from './pages/business/BusinessOverview';
import BusinessRegister from './pages/business/BusinessRegister';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login mode="signin" />} />
            <Route path="/signup" element={<Login mode="signup" />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/experiences/:id" element={<ExperienceDetail />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:id" element={<GuideDetail />} />
            <Route path="/ai" element={<AIStudio />} />
            <Route path="/ai/recommend" element={<ProtectedRoute><AIRecommend /></ProtectedRoute>} />
            <Route path="/ai/plan" element={<ProtectedRoute><AIPlan /></ProtectedRoute>} />
            <Route path="/ai/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
              <Route index element={<Overview />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="trips" element={<Trips />} />
              <Route path="reviews" element={<MyReviews />} />
              <Route path="history" element={<History />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/admin" element={<ProtectedRoute><AdminConsole /></ProtectedRoute>}>
              <Route index element={<AdminStats />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="businesses" element={<AdminBusinesses />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="audit" element={<AdminAudit />} />
            </Route>
            <Route path="/business" element={<ProtectedRoute><BusinessConsole /></ProtectedRoute>}>
              <Route index element={<BusinessOverview />} />
              <Route path="listings" element={<BusinessOverview />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="register" element={<BusinessRegister />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
