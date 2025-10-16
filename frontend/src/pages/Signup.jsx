import React from "react";

export default function Signup() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Signup Page</h2>
      <form style={{ marginTop: "20px" }}>
        <div>
          <input type="text" placeholder="Name" style={{ padding: "8px", margin: "5px" }} />
        </div>
        <div>
          <input type="email" placeholder="Email" style={{ padding: "8px", margin: "5px" }} />
        </div>
        <div>
          <input type="password" placeholder="Password" style={{ padding: "8px", margin: "5px" }} />
        </div>
        <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>Sign Up</button>
      </form>
    </div>
  );
}
