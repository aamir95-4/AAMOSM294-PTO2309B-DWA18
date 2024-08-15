import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import Login from "./Login.jsx";
import { supabase } from "../components/database/supabase";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const [showLoginOverlay, setShowLoginOverlay] = React.useState(false);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    setIsLoggedIn((prev) => !prev);
    if (error) console.error("Logout failed:", error);
  }
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
            {!isLoggedIn && (
              <Button
                color="primary"
                className="login-button"
                onClick={handleLogInClick}
              >
                Log in
              </Button>
            )}
            {isLoggedIn && (
              <Button onClick={signOut} color="primary">
                Log out
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {showLoginOverlay && (
        <Login isActive={showLoginOverlay} onClose={handleOverlayClose} />
      )}
    </div>
  );
}
