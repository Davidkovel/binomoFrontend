import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Login from './screens/SignIn/components/Login';
import Register from './screens/SignUp/components/Register';
import MainScreen from './screens/Main/components/Main';
import ProtectedRoute from './components/routing/ProtectedRoute';
import BalancePage from './screens/Profile/components/BalancePage';
import PerpetrualTradingPlatform from './screens/Perpetrual/components/Perpetrual';
import { UserProvider } from './features/context/UserContext';

function App() {
  return (
    <div>Test</div>
  );
}
function App2() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Главная страница */}
          <Route path="/main" element={<MainScreen></MainScreen>}/>

          {/* Защищенные маршруты */}
          <Route 
            path="/trading" 
            element={
              <ProtectedRoute>
                <Header />
                <PerpetrualTradingPlatform />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/balance" 
            element={
              <ProtectedRoute>
                <BalancePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Редирект с главной на trading */}
          <Route path="/" element={<Navigate to="/main" replace />} />
          
          {/* 404 - перенаправление на главную */}
          <Route path="*" element={<Navigate to="/main" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App2;