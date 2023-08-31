import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate("/");
  }, []);

  return null;
};
export default NotFound;
