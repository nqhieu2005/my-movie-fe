import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Copyright from "./components/Copyright";
import HomePage from "./pages/HomePage";
import MovieDetail from "./pages/MovieDetail";
import FilterPage from "./pages/FilterPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Header />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies/:slug" element={<MovieDetail />} />
            <Route path="/filter" element={<FilterPage />} />
          </Routes>
        </main>
        <Copyright />
      </div>
    </Router>
  );
}

export default App;
