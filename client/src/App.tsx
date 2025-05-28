import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import LoadingMessage from "./components/hud/loading-message";
import GameProvider from "./contexts/game";
import useProfile from "./hooks/queries/use-get-profile";
import Game from "./routes/game";
import Login from "./routes/login";
import MainMenu from "./routes/menu";
import NotFound from "./routes/not-found";

const RouteProtection = () => {
  const { data, isLoading, isError } = useProfile();

  if (isError) {
    return <Navigate to="/auth/login" />;
  }

  if (isLoading) {
    return <LoadingMessage />;
  }

  return (
    <GameProvider profile={data?.profile}>
      <Outlet />
    </GameProvider>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/auth/login"
          element={
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <Login />
            </GoogleOAuthProvider>
          }
        />
        <Route path="*" element={<NotFound />} />
        <Route element={<RouteProtection />}>
          <Route path="/" element={<MainMenu />} />
          <Route path="/game" element={<Game />} />
          {/* <Route path="/game-editor" element={<GameEditor />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
