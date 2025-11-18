-- Seed data for CodeConnect
-- This file contains sample data for development and testing

-- Insert sample profiles (these will be created automatically when users sign up)
-- But we can add some demo data for testing

-- Sample posts
INSERT INTO posts (id, user_id, title, content, code_snippet, language, tags, created_at) VALUES
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000', -- This will be replaced with actual user IDs
  'Welcome to CodeConnect!',
  'This is a sample post to demonstrate the platform. Share your code snippets and connect with other developers!',
  'console.log("Hello, CodeConnect!");
const greeting = "Welcome to our community!";
console.log(greeting);',
  'javascript',
  ARRAY['welcome', 'javascript', 'community'],
  NOW()
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'Python Data Processing',
  'Here''s a useful Python snippet for processing data with pandas.',
  'import pandas as pd
import numpy as np

# Load and process data
df = pd.read_csv("data.csv")
df_cleaned = df.dropna()
result = df_cleaned.groupby("category").mean()
print(result)',
  'python',
  ARRAY['python', 'pandas', 'data-science'],
  NOW()
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'React Hook for API Calls',
  'A custom React hook for handling API calls with loading states.',
  'import { useState, useEffect } from "react";

const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useApi;',
  'javascript',
  ARRAY['react', 'hooks', 'api', 'frontend'],
  NOW()
);
