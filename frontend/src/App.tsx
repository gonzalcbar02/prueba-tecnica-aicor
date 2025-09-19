import { Routes, Route } from "react-router-dom";
import LoginView from "./views/auth/LoginView";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./views/Dashboard";
import Cart from "./views/Cart";
import History from "./views/History";


export default function App() {
  return (
    <Routes>
      
      <Route element={<AuthLayout/>}>
        <Route path="/" element={<LoginView />} />
      </Route>

      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/history" element={<History />} />

    </Routes>
  )
}
