import { createClient } from "@supabase/supabase-js";
const supabaseUrl =
  process.env.SUPABASE_URL || "https://pnyaqnvyoyoixcgycrdx.supabase.co";
const supabaseKey =
  process.env.SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBueWFxbnZ5b3lvaXhjZ3ljcmR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODA3MTgyMywiZXhwIjoyMDczNjQ3ODIzfQ.GXxJYLzrG8tLzhqX9tbwyKVU_DzB4OFcGP3pVj6Ukwg";
export const supabase = createClient(supabaseUrl, supabaseKey);
