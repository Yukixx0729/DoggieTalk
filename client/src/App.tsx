import { Routes, Route } from "react-router-dom";
import "./App.css";
import { SignupAndLogin } from "./pages/SignupAndLogin";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { useAuth, AuthContextType } from "./contexts/AuthProvider";
import HeadingAndNavBar from "./components/HeadingAndNavBar";
import PrivateRoutes from "./components/PrivateRoutes";
import { Button } from "@chakra-ui/react";
import Settings from "./components/Setting";
import Events from "./components/Events";
import Chat from "./components/Chat";

function App() {
  const { user, logout } = useAuth() as AuthContextType;
  return (
    <>
      {user && (
        <div>
          <h1>Doggie Talk🐶</h1>
          <h2>
            Hello, {user.name}!{" "}
            <Button colorScheme="blue" size="sm" onClick={logout}>
              Logout
            </Button>
          </h2>
          <HeadingAndNavBar />
        </div>
      )}

      <Routes>
        <Route path="/login" element={<SignupAndLogin />} />
        <Route element={<PrivateRoutes redirectTo="/login" />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          / <Route path="/events" element={<Events />} />
          <Route path="/setting" element={<Settings />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
