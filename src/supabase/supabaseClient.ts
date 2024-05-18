import { createClient } from "@supabase/supabase-js"
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_ANON_URL as string

export const supabase = createClient(supabaseUrl, supabaseKey)