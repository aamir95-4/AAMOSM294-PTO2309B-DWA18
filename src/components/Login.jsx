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
} from "@nextui-org/react";
import PropTypes from "prop-types";

export default function Login({ session, setSession }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [signUp, setSignUp] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function handleSignUp() {
    try {
      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      alert("Check your email for the login link!");
      setSignUp(false);
      onOpenChange(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleLogin() {
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      onOpenChange(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  return (
    <>
      {session ? (
        <Button color="primary" onPress={() => setSession(null)}>
          Log out
        </Button>
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
