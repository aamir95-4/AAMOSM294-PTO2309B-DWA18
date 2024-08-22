import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Avatar,
  Link,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
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
      <Navbar o>
        <NavbarMenuToggle />
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
              <div className="profile-dropdown">
                <Dropdown placement="bottom-start">
                  <DropdownTrigger>
                    <Avatar
                      as="button"
                      avatarProps={{
                        isBordered: true,
                        src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                      }}
                      className="transition-transform"
                      description="@tonyreichert"
                      name="Tony Reichert"
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="User Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <p className="font-bold">Signed in as</p>
                      <p className="font-bold">@tonyreichert</p>
                    </DropdownItem>
                    <DropdownItem key="clear-history">
                      Clear Listening History
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      color="danger"
                      className="text-danger"
                      onClick={handleLogOutClick}
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu className="navbar-menu" height="20rem">
          <NavbarMenuItem>
            <Link color="foreground" href="#">
              Show All
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link color="foreground" href="#">
              Favourites
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
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
