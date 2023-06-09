import { Routes, Route } from "react-router-dom";
import "./App.css";
import { SignupAndLogin } from "./pages/SignupAndLogin";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { useAuth, AuthContextType } from "./contexts/AuthProvider";
import "./App.css";
import PrivateRoutes from "./components/PrivateRoutes";
import { Button, Container } from "@chakra-ui/react";
import MyAccount from "./components/MyAccount";
import Events from "./components/Events";
import Chat from "./components/ChatRoom";
import Sidebar from "./components/HeadingAndNavBar";
import UserInfo from "./components/UserInfo";
import logo from "./image/logo.png";

function App() {
  const { user, logout } = useAuth() as AuthContextType;

  return (
    <Container maxW="8xl">
      {user ? (
        <div>
          <div className="navbar">
            <h1 className="mainTitle">
              <img src={logo} alt="logo pic" id="logo" />
              Doggie Talk
            </h1>
            <h1 id="logoutTitle">
              Hello, {user.name}!{" "}
              <Button colorScheme="blue" size="xs" onClick={logout}>
                Logout
              </Button>
            </h1>
          </div>
          <div className="main-content">
            <Sidebar />
            <Routes>
              <Route element={<PrivateRoutes redirectTo="/login" />}>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/events" element={<Events />} />
                <Route path="/myaccount" element={<MyAccount />} />
                <Route path="/*" element={<NotFound />} />
                <Route path="/user/:userId" element={<UserInfo />} />
              </Route>
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<SignupAndLogin />} />
        </Routes>
      )}
    </Container>
  );
}

export default App;
