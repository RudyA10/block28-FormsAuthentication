import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  async function signup(username) {
    try {
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (response.ok) {
        setToken(result.token);
        setLocation("TABLET");
      } else {
        console.error("Signup failed:", result.message);
      }
    } catch (err) {
      console.error("Error during signup:", err);
    }
  }

  // TODO: authenticate
  const authenticate = async () => {
    try {
      if (!token) throw Error("No token found.");
      const response = await fetch(API + "/authenticate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw Error("Authentication failed.");
      setLocation("TUNNEL");
    } catch (e) {
      console.error(e);
    }
  };

  const value = { signup, authenticate, location };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
