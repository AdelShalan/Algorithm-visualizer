import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AlgorithmProvider } from './contexts/AlgorithmContext';
import Landing from './components/Landing';
import Home from './components/Home';
import AlgorithmPage from './components/AlgorithmPage';
import Docs from './components/Docs';

export default function App() {
  return (
    <AlgorithmProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/algorithms" element={<Home />} />
          <Route path="/:category/:algorithm" element={<AlgorithmPage />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </BrowserRouter>
    </AlgorithmProvider>
  );
}
