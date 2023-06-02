import { Outlet, Navigate } from "react-router-dom";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";
import { Spinner } from "@chakra-ui/react";

const PrivateRoutes = ({ redirectTo }: { redirectTo: string }) => {
  const { user, isLoadingUser } = useAuth() as AuthContextType;

  if (isLoadingUser) return <Spinner color="red.500" />;

  return user ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default PrivateRoutes;
