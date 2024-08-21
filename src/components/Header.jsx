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
import PropTypes from "prop-types";

export default function Header({ session, setSession }) {
  const [showLoginOverlay, setShowLoginOverlay] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogOutClick = () => {
    supabase.auth.signOut();
    setSession(null);
  };

  const handleLogInClick = () => {
    setShowLoginOverlay(true);
  };

  const handleOverlayClose = () => {
    setShowLoginOverlay(false);
  };

  return (
    <div>
      <Navbar shouldHideOnScroll>
        <NavbarContent>
          <NavbarBrand>
            <p className="font-bold text-inherit">UAVVE</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            {!session && (
              <Button
                color="primary"
                className="login-button"
                onClick={handleLogInClick}
              >
                Log in
              </Button>
            )}
            {session && (
              <Button onClick={handleLogOutClick} color="primary">
                Log out
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {showLoginOverlay && (
        <Login
          session={session}
          isActive={showLoginOverlay}
          onClose={handleOverlayClose}
        />
      )}
    </div>
  );
}

Header.propTypes = {
  session: PropTypes.object,
  setSession: PropTypes.func,
};
