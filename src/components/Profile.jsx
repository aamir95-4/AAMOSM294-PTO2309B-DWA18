import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Link,
  Avatar,
} from "@nextui-org/react";
import { supabase } from "../components/database/supabase";
import React from "react";
import PropTypes from "prop-types";
import { IconContext } from "react-icons";
import { BiUpload } from "react-icons/bi";

export default function Profile({
  isProfileOpen,
  setIsProfileOpen,
  session,
  setSession,
}) {
  const [uploading, setUploading] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState(null);

  function uploadAvatar() {
    console.log("Avatar Uploaded");
  }
  return (
    <>
      <Modal
        isOpen={isProfileOpen}
        onOpenChange={(open) => setIsProfileOpen(open)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                My Profile
                <small className="text-default-500">{session.user.email}</small>
              </ModalHeader>
              <ModalBody>
                <div className="avatar-container">
                  <Avatar
                    className="w-20 h-20 text-large"
                    showFallback
                    src={avatarUrl}
                  />
                  <input
                    type="file"
                    id="avatarUpload"
                    onChange={uploadAvatar}
                    accept="image/*"
                    style={{ display: "none" }}
                    disabled={uploading}
                  />
                  <label htmlFor="avatarUpload">
                    <Button isIconOnly as="span" size="sm">
                      <IconContext.Provider
                        value={{ color: "black", size: "1em" }}
                      >
                        <BiUpload />
                      </IconContext.Provider>
                    </Button>
                  </label>
                </div>
                <Link size="sm" href="https://github.com/nextui-org/nextui">
                  Clear Listening History
                </Link>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => setIsProfileOpen(false)}
                >
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
