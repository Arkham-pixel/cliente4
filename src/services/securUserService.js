// src/services/securUserService.js

export async function loginSecurUser({ login, pswd }) {
  const response = await fetch("http://13.59.106.174:3000/api/secur-users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ login, pswd })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error en el login");
  }

  return response.json();
}
