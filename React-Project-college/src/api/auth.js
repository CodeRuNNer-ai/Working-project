const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || "Login failed");
  }

  return res.json();
};

export const signupUser = async (credentials) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || "Signup failed");
  }

  return res.json();
};

export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/auth/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
};