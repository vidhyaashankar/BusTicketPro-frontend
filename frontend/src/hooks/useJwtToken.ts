// Reusable custom hook for working with a JWT token in localStorage.
// This hook is not used anywhere yet, so it does not change existing behavior.

import { useState, useEffect } from "react";

const STORAGE_KEY = "auth_token";

export function useJwtToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) {
      setToken(existing);
    }
  }, []);

  const saveToken = (value: string | null) => {
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, value);
      setToken(value);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
      setToken(null);
    }
  };

  return { token, setToken: saveToken };
}

