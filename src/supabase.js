import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nrlnteimuatccufkgjkw.supabase.co";
const supabasePublishableKey = "sb_publishable_4qA51bmmN3axu5jiUpiMPw_qMKVy6ks";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);