import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Login from "./Login.jsx";
import PropTypes from "prop-types";

export default function Header({ session, setSession, setProgressUpdated }) {
  return (
    <div>
      <Navbar>
        <NavbarContent>
          <NavbarBrand>
            <p className="font-bold text-inherit">UAVVE</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Login
              session={session}
              setSession={setSession}
              setProgressUpdated={setProgressUpdated}
            />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}

Header.propTypes = {
  session: PropTypes.object,
  setSession: PropTypes.func,
  setProgressUpdated: PropTypes.func,
};
