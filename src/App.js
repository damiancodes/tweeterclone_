import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import ForgotPassword from './Pages/ForgotPassword';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/signup' element={<Register/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/reset-password' element={<ForgotPassword/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;