import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuditPage from "./pages/AuditPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/audits/:id" element={<AuditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
