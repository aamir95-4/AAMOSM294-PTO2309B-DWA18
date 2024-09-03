import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Link,
  Avatar,
  Chip,
} from "@nextui-org/react";
import { supabase } from "../components/database/supabase";
import React from "react";
import PropTypes from "prop-types";
import { IconContext } from "react-icons";
import { BiUpload } from "react-icons/bi";

export default function Profile({ isProfileOpen, setIsProfileOpen, session }) {
  const [uploading, setUploading] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState(null);

  React.useEffect(() => {
    if (session.user.avatar_url) {
      setAvatarUrl(session.user.avatar_url);
    }
  }, [session.user.avatar_url]);

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Update user's avatar_url in the profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("user_id", session.user.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(filePath);

      alert("Avatar updated successfully!");
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }
  return (
    <>
      <Modal
        isOpen={isProfileOpen}
        onOpenChange={(open) => setIsProfileOpen(open)}
        className="profile-modal"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                My Profile
                <Chip variant="flat" color="primary">
                  {session.user.email}
                </Chip>
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
                <Link size="sm" href="#">
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

Profile.propTypes = {
  isProfileOpen: PropTypes.bool,
  setIsProfileOpen: PropTypes.func,
  session: PropTypes.object,
};
