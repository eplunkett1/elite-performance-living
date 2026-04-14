import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AssessmentPage from "./pages/AssessmentPage";
import WorkoutPage from "./pages/WorkoutPage";
import ResourcesPage from "./pages/ResourcesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/assessment" element={<AssessmentPage />} />
      <Route path="/workout" element={<WorkoutPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/coaching" element={<Navigate to={{ pathname: "/", hash: "#connect" }} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
