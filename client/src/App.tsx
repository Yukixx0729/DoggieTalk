import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import { SignupAndLogin } from "./pages/SignupAndLogin";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { useAuth, AuthContextType } from "./contexts/AuthProvider";
import "./App.css";
import PrivateRoutes from "./components/PrivateRoutes";
import { Button, Container, Heading, Box } from "@chakra-ui/react";
import MyAccount from "./components/MyAccount";
import Events from "./components/Events";
import Chat from "./components/ChatRoom";
import HeadingAndNavBar from "./components/HeadingAndNavBar";
import UserInfo from "./components/UserInfo";
import { useEffect } from "react";

function App() {
  const { user, logout } = useAuth() as AuthContextType;
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   const storedRoute = localStorage.getItem("currentRoute");
  //   if (storedRoute) {
  //     localStorage.removeItem("currentRoute");
  //     navigate(storedRoute, { replace: true });
  //   }
  // }, [navigate]);

  // useEffect(() => {
  //   localStorage.setItem("currentRoute", location.pathname);
  // }, [location]);

  // const handleRefreshChange = (route: string) => {
  //   const currentRoute = localStorage.getItem("currentRoute");
  //   if (currentRoute) {
  //     navigate(currentRoute);
  //   }
  // };
  return (
    <Container maxW="8xl">
      {user && (
        <Container maxW="8xl">
          <Box
            textAlign="left"
            bg="#7A999B"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding="20px"
          >
            <Heading size="2xl">Doggie Talk🐶</Heading>
            <Heading size="l" ml="4">
              Hello, {user.name}!{" "}
              <Button colorScheme="blue" size="xs" onClick={logout}>
                Logout
              </Button>
            </Heading>
          </Box>
          <HeadingAndNavBar />
        </Container>
      )}

      <Routes>
        <Route path="/login" element={<SignupAndLogin />} />
        <Route element={<PrivateRoutes redirectTo="/login" />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/events" element={<Events />} />
          <Route path="/myaccount" element={<MyAccount />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/user/:userId" element={<UserInfo />} />
        </Route>
      </Routes>
    </Container>
  );
}

export default App;
