import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import SocialMedia from "./socialMedia/SocialMedia";
const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [awaitingTwoFactor, setAwaitingTwoFactor] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (awaitingTwoFactor) {
      // If awaiting 2FA, submit the email, password, and 2FA code
      try {
        const response = await axios.post(
          LOGIN_URL,
          JSON.stringify({ email: user, pwd, code: twoFactorCode }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        // Handle response data (e.g., set tokens, user details)
        const accessToken = response?.data?.accessToken;
        const roles = response?.data?.roles;
        setAuth({ user, roles, accessToken, name: response?.data?.name });
        setUser("");
        setPwd("");
        setTwoFactorCode("");
        setAwaitingTwoFactor(false); // Reset 2FA state
        navigate(from, { replace: true });
      } catch (err) {
        // Handle errors (e.g., incorrect 2FA code)
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 401) {
          setErrMsg("Invalid 2FA code");
        } else {
          setErrMsg("Login Failed");
        }
        errRef.current.focus();
      }
    } else {
      // If not awaiting 2FA, request the 2FA token
      try {
        await axios.post("/auth/send2fa", JSON.stringify({ email: user }), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setAwaitingTwoFactor(true); // Now awaiting 2FA input
      } catch (err) {
        // Handle errors (e.g., user not found)
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 404) {
          setErrMsg("User not found");
        } else {
          setErrMsg("Could not send 2FA code");
        }
        errRef.current.focus();
      }
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);
  const TwoFactorAuth = ({ user, pwd, setTwoFactorCode, handleSubmit }) => {
    const navigate = useNavigate();
    const [code, setCode] = useState("");

    const handleCodeSubmit = (e) => {
      e.preventDefault();
      setTwoFactorCode(code);
      handleSubmit(e); // Call the original handleSubmit from Login
    };

    return (
      <section>
        <h1>Two-Factor Authentication</h1>
        <form onSubmit={handleCodeSubmit}>
          <label htmlFor="twoFactorCode">Enter the code:</label>
          <input
            type="text"
            id="twoFactorCode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </section>
    );
  };

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <SocialMedia />
      {awaitingTwoFactor ? (
        // Render the 2FA input form
        <div>
          <h2>Two-Factor Authentication</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="twoFactorCode">Enter the code:</label>
            <input
              type="text"
              id="twoFactorCode"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              required
            />
            <button type="submit">Verify</button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            autoComplete="on"
            required
          />
          <button>Sign In</button>
          <div className="persistCheck">
            <input
              type="checkbox"
              id="persist"
              onChange={togglePersist}
              checked={persist}
            />
            <label htmlFor="persist">
              Stay logged in for 30 days (which disabled persist login)
            </label>
          </div>
        </form>
      )}
      <p>
        Forgot Password?
        <br />
        <span className="line">
          <Link to="/forgot-password">Reset password</Link>
        </span>
      </p>
      <p>
        Need an Account?
        <br />
        <span className="line">
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
    </section>
  );
};

export default Login;
