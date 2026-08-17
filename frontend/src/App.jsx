import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MoodTracker from "./pages/MoodTracker";
import Journal from "./pages/Journal";
import SleepTracker from "./pages/SleepTracker";
import StressTracker from "./pages/StressTracker";
import ExerciseTracker from "./pages/ExerciseTracker";
import WaterTracker from "./pages/WaterTracker";
import HabitTracker from "./pages/HabitTracker";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/mood" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
      <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
      <Route path="/sleep" element={<ProtectedRoute><SleepTracker /></ProtectedRoute>} />
      <Route path="/stress" element={<ProtectedRoute><StressTracker /></ProtectedRoute>} />
      <Route path="/exercise" element={<ProtectedRoute><ExerciseTracker /></ProtectedRoute>} />
      <Route path="/water" element={<ProtectedRoute><WaterTracker /></ProtectedRoute>} />
      <Route path="/habits" element={<ProtectedRoute><HabitTracker /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
