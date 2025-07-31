import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WarehousesPage from './pages/WarehousesPage';
import HistoryPage from './pages/HistoryPage';
import ReservePage from './pages/ReservePage';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<WarehousesPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/reserve" element={<ReservePage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
