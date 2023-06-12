import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from "./pages/Home"
import Search from './pages/Search';
import Add from './pages/Add'
import Model from './pages/Model';
import Types from './pages/Types'
import Edit from './pages/Edit'
import EditConsumable from './pages/EditConsumable';
import Stock from './pages/Stock';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/add" element={<Add />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/consumable/:model" element={<Model />} />
        <Route path="/type/:type" element={<Types />} />
        <Route path="/edit/:model" element={<EditConsumable />} />
      </Routes>
    </Router>
  );
}

export default App;
