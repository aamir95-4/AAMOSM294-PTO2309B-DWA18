import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "@nextui-org/react";

const supabase = createClient(
  "https://rhtlygiybvrfsssbdfvy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodGx5Z2l5YnZyZnNzc2JkZnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNDM0NDQsImV4cCI6MjAzODYxOTQ0NH0.W7FavyzWmXsD5mISmfkLl3XJhC6_fNw-sSbwgQGDuWI"
);

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
