import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Login from "./Login.jsx";

import PropTypes from "prop-types";

export default function Header({ session, setSession, setPage }) {
  return (
    <div>
      <Navbar>
        <NavbarMenuToggle />
        <NavbarContent>
          <NavbarBrand>
            <p className="font-bold text-inherit">UAVVE</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Login session={session} setSession={setSession} />
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu className="navbar-menu" height="20rem">
          <NavbarMenuItem>
            <Link color="foreground" href="#" onPress={() => setPage("home")}>
              Home
            </Link>
          </NavbarMenuItem>
          {session && (
            <NavbarMenuItem>
              <Link
                color="foreground"
                href="#"
                onPress={() => setPage("favourites")}
              >
                Favourites
              </Link>
            </NavbarMenuItem>
          )}
        </NavbarMenu>
      </Navbar>
    </div>
  );
}

Header.propTypes = {
  session: PropTypes.object,
  setSession: PropTypes.func,
  setPage: PropTypes.func,
};
