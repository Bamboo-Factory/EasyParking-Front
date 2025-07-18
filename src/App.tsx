import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import ParkingList from "./pages/ParkingList";
import AllParkings from "./pages/AllParkings";
import ParkingRegister from "./pages/ParkingRegister";
import ParkingReservation from "./pages/ParkingReservation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReservationsListPage from "./pages/ReservationsListPage";

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<ParkingList />} />
              <Route path="/home" element={<Home />} />
              <Route path="/parkings" element={<ParkingList />} />
              <Route path="/all-parkings" element={<AllParkings />} />
              <Route path="/register-parking" element={<ParkingRegister />} />
              <Route path="/reservation/:id" element={<ParkingReservation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reservations" element={<ReservationsListPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
