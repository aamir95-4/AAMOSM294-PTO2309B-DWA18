import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import Login from "./Login.jsx";

export default function App() {
  const [showLoginOverlay, setShowLoginOverlay] = React.useState(false);

  const handleLogInClick = () => {
    setShowLoginOverlay(true);
  };

  const handleOverlayClose = () => {
    setShowLoginOverlay(false);
  };

  return (
    <div>
      <Navbar variant="sticky">
        <NavbarContent>
          <NavbarBrand>
            <p className="font-bold text-inherit">UAVVE</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              color="primary"
              className="login-button"
              onClick={handleLogInClick}
            >
              Log in
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {showLoginOverlay && (
        <Login isActive={showLoginOverlay} onClose={handleOverlayClose} />
      )}
    </div>
  );
}
