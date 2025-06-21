import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jbxanohmcqvplqyzhyih.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpieGFub2htY3F2cGxxeXpoeWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MjY1MzAsImV4cCI6MjA2NjAwMjUzMH0.NFOXtnnA0ztcdU0SzTED0qAJnphCFw5-oVEbCmKw-Rg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
