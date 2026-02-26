import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../layout/signin.css";
import { supabase } from "../../supabase/client";
import { Toaster, toast } from "sonner";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
      });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = formData;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Invalid email or password");
    } else {
      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      setSuccessMessage(true);
      setFormData({ email: "", password: "" });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <main className="signin-container">
      {successMessage && (
        <div
          className="success_message"
          role="status"
          aria-live="polite"
        >
          Login successful!
          <br />
          Redirecting to Home...
        </div>
      )}

      <h1>Login</h1>

      <form onSubmit={handleSubmit} className="signin-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="form-control"
          />
        </div>

        <div className="remember-me-container">
          <label className="remember-me-label">
            <div className="switch">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="remember-me-input"
                aria-label="Remember login credentials"
              />
              <span className="slider" aria-hidden="true"></span>
            </div>
            <span>Remember me</span>
          </label>
        </div>

        <button type="submit" className="signin-button">
          Login
        </button>
      </form>

      <p className="dont-have-account">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>

      <Toaster position="bottom-center" />
    </main>
  );
};

export default SignIn;