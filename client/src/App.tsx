import { Loader } from "@mantine/core";
import { Fragment } from "react";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import MainMenu from "./routes/menu";
import Game from "./routes/game";
import Login from "./routes/login";
import NotFound from "./routes/not-found";
import { GoogleOAuthProvider } from "@react-oauth/google";
import useProfile from "./hooks/queries/use-get-profile";
import GameEditor from "./routes/game-editor";

const RouteProtection = () => {
  const { isLoading, isError } = useProfile();

  // if (isError) {
  //   return <Navigate to="/auth/login" />;
  // }

  // if (isLoading) {
  //   return (
  //     <div className="h-screen w-screen flex flex-col items-center justify-center">
  //       <h1 className="text-3xl font-semibold">Please wait ...</h1>
  //       <Loader size="xl" type="dots" color="#8960AF" />
  //     </div>
  //   );
  // }

  return (
    <Fragment>
      <Outlet />
    </Fragment>
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
          <Route path="/game-editor" element={<GameEditor />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
