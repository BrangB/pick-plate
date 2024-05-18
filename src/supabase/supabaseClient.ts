import { createClient } from "@supabase/supabase-js"
import 'dotenv/config'

const supabaseUrl = "https://bblniufqxpsusxqmiswt.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJibG5pdWZxeHBzdXN4cW1pc3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYwMDQ2ODUsImV4cCI6MjAzMTU4MDY4NX0.10pr8JIFK4Cu_fFgatUO1hucLIi4ZSHWqpb89_b62-Y"

export const supabase = createClient(supabaseUrl, supabaseKey)