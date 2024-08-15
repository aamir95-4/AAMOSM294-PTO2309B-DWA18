import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "@nextui-org/react";
import { supabase } from "../components/database/supabase";

export default function Login(props) {
  if (!props.isActive) return null;

  return (
    <div className="login-overlay">
      <div className="login-content">
        <Button isIconOnly onClick={props.onClose} className="close-button">
          X
        </Button>
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
      </div>
    </div>
  );
}
