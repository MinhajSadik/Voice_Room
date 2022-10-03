import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navigation from "./Components/shared/Navigation/Navigation";
import Activate from "./pages/Activate/Activate";
import Authenticate from "./pages/Authenticate/Authenticate";
import Home from "./pages/Home/Home";
import Rooms from "./pages/Rooms/Rooms";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              <Home />
            </GuestRoute>
          }
        />
        <Route
          path="/authenticate"
          element={
            <GuestRoute>
              <Authenticate />
            </GuestRoute>
          }
        />

        <Route
          path="/activate"
          element={
            <SemiProtectedRoute>
              <Activate />
            </SemiProtectedRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const GuestRoute = ({ children, ...rest }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return <>{isLoggedIn ? <Navigate to="/rooms" replace /> : children}</>;
};

const SemiProtectedRoute = ({ children, ...rest }) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  return (
    <>
      {!isLoggedIn ? (
        <Navigate to="/" replace />
      ) : isLoggedIn && !user.activated ? (
        children
      ) : (
        <Navigate to="/rooms" />
      )}
    </>
  );
};

const ProtectedRoute = ({ children, ...rest }) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
 
  return (
    <>
      {!isLoggedIn ? (
        <Navigate to="/" replace />
      ) : isLoggedIn && !user.activated ? (
        <Navigate to="/activate" />
      ) : (
        children
      )}
    </>
  );
};
export default App;
