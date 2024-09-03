import React from "react";
import { supabase } from "../components/database/supabase";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import Profile from "./Profile";
import { createFavouritesTable } from "./database/favourites";

export default function Login({ session, setSession }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [signUp, setSignUp] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function handleSignUp() {
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setErrorMessage(
            "This email is already registered. Please log in instead."
          );
        } else {
          setErrorMessage(error.message);
        }
      } else {
        alert("Check your email for the login link!");
        createFavouritesTable(session.user.id);
        setSignUp(false);

        onOpenChange(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleLogin() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSession(session);
        onOpenChange(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      {session ? (
        <div className="profile-dropdown">
          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <Avatar
                as="button"
                isBordered
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                className="transition-transform"
                description="@tonyreichert"
                name="Tony Reichert"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                onClick={() => setIsProfileOpen(true)}
              >
                <p className="font-bold">{session.user.email}</p>
                <p className="font-bold">View profile</p>
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                className="text-danger"
                onClick={handleSignOut}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Profile
            isProfileOpen={isProfileOpen}
            setIsProfileOpen={setIsProfileOpen}
            session={session}
          />
        </div>
      ) : (
        <div>
          <Button onPress={onOpen} color="primary">
            Log in
          </Button>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {signUp ? "Sign Up" : "Log in"}
                  </ModalHeader>

                  <ModalBody>
                    {errorMessage && (
                      <div style={{ color: "red", marginBottom: "1rem" }}>
                        {errorMessage}
                      </div>
                    )}
                    <Input
                      autoFocus
                      label="Email"
                      placeholder="Enter your email"
                      variant="bordered"
                      className="inputField"
                      type="email"
                      value={email}
                      required={true}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      variant="bordered"
                      className="inputField"
                      value={password}
                      required={true}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex py-2 px-1 justify-between">
                      <Link
                        size="sm"
                        color="foreground"
                        underline="always"
                        onPress={() => {
                          setSignUp(!signUp);
                          setErrorMessage("");
                        }}
                      >
                        {signUp
                          ? "Have an account? Log in"
                          : "Need an account? Sign up"}
                      </Link>
                      {!signUp && (
                        <Link color="primary" href="#" size="sm">
                          Forgot password?
                        </Link>
                      )}
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                    {signUp && (
                      <Button color="primary" onPress={handleSignUp}>
                        Sign up
                      </Button>
                    )}

                    {!signUp && (
                      <Button color="primary" onPress={handleLogin}>
                        Log in
                      </Button>
                    )}
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      )}
    </>
  );
}

Login.propTypes = {
  session: PropTypes.object,
  setSession: PropTypes.func,
};
