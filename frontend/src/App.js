import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import Loader from "./Components/shared/Loader/Loader";
import Navigation from "./Components/shared/Navigation/Navigation";
import NotFound from "./Components/shared/NotFound/NotFound";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";
import Activate from "./pages/Activate/Activate";
import Authenticate from "./pages/Authenticate/Authenticate";
import Home from "./pages/Home/Home";
import Room from "./pages/Room/Room";
import Rooms from "./pages/Rooms/Rooms";

function App() {
  const { loading } = useLoadingWithRefresh();

  return loading ? (
    <Loader message="Loading, please wait.." />
  ) : (
    <Router>
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
        <Route
          path="/room/:id"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

const GuestRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return <>{isLoggedIn ? <Navigate to="/rooms" replace /> : children}</>;
};

const SemiProtectedRoute = ({ children }) => {
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

const ProtectedRoute = ({ children }) => {
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
