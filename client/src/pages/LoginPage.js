import React from "react";

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter email" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter password" />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
