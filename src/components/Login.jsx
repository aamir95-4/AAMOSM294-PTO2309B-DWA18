import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "@nextui-org/react";
import { supabase } from "../components/database/supabase";
import PropTypes from "prop-types";

export default function Login(props) {
  if (!props.isActive) return null;
  if (props.session) return null;

  return (
    <div className="login-overlay">
      {!props.session && (
        <div className="login-content">
          <Button isIconOnly onClick={props.onClose} className="close-button">
            X
          </Button>
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
        </div>
      )}
    </div>
  );
}

Login.propTypes = {
  isActive: PropTypes.bool,
  session: PropTypes.object,
  onClose: PropTypes.func,
};
