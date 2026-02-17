import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import AddClient from './pages/AddClient';
import Expenses from './pages/Expenses';
import Timeline from './pages/Timeline';
import { useEffect } from 'react';
import { initMockData } from './utils/storage';

function App() {
  useEffect(() => {
    initMockData();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/add" element={<AddClient />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/analytics" element={<Dashboard />} /> {/* Using Dashboard as analytics for now */}
          {/* Add more routes here */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
