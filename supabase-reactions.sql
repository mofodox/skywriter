-- Create a table for storing reactions
CREATE TABLE reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index for faster lookups by post_id
CREATE INDEX reactions_post_id_idx ON reactions(post_id);

-- Create a unique constraint to prevent duplicate reactions from the same session
CREATE UNIQUE INDEX reactions_unique_session_post_reaction ON reactions(session_id, post_id, reaction_type);

-- Enable Row Level Security
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous users to read all reactions
CREATE POLICY "Allow anonymous read access" ON reactions
  FOR SELECT USING (true);

-- Create policy for anonymous users to insert reactions
CREATE POLICY "Allow anonymous insert" ON reactions
  FOR INSERT WITH CHECK (true);

-- Create policy for anonymous users to delete their own reactions
CREATE POLICY "Allow anonymous delete own reactions" ON reactions
  FOR DELETE USING (session_id = current_setting('request.headers')::json->>'x-session-id'); 