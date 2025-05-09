import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import { UserProvider } from './context/UserContext';
import Category from './pages/Category';

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions/>}/>
        <Route path="/categories" element={<Category/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </UserProvider>
  );
}

export default App;
