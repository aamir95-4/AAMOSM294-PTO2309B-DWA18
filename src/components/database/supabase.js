import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://rhtlygiybvrfsssbdfvy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodGx5Z2l5YnZyZnNzc2JkZnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNDM0NDQsImV4cCI6MjAzODYxOTQ0NH0.W7FavyzWmXsD5mISmfkLl3XJhC6_fNw-sSbwgQGDuWI"
);
