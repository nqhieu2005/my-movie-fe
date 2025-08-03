import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/Header'
import Copyright from './components/Copyright';
import HomePage from './pages/HomePage';
import MovieDetail from './pages/MovieDetail';

function App() {
  return (
    <Router>
      <Header />
      <main className="container mx-auto p-6"> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:slug" element={<MovieDetail />} />
        </Routes>
      </main>
      <Copyright />
    </Router>
  )
}

export default App
