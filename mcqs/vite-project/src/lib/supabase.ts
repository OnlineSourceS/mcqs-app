import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL  } from '../constants/supabase'

export const supabase = createClient(SUPABASE_URL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmZWJlcWtmemR1ZHVqZXJ2b21xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTk0OTM4NCwiZXhwIjoyMDYxNTI1Mzg0fQ._4w4gHrSkbcs-3ll4T21PBqZHB7e800AUvoSvDGYGjw') 