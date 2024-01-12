import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import ReactLoading from "react-loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import SocialMedia from "./socialMedia/SocialMedia";
import useAuth from "../hooks/useAuth";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const MAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  const imgRef = useRef();
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [profileImg, setProfileImg] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const { setAuth } = useAuth();

  useEffect(() => {
    if (!success) userRef.current.focus();
  }, [success]);

  useEffect(() => {
    setValidName(MAIL_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      console.log("File selected:", file); // Check if the file is being selected
      setProfileImg(file);
      const previewUrl = URL.createObjectURL(file);
      console.log("Preview URL:", previewUrl); // Check the generated URL
      setPreviewSrc(previewUrl);
    } else {
      setProfileImg("");
      setPreviewSrc("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = PWD_REGEX.test(pwd);
    const v2 = MAIL_REGEX.test(user);
    if (!user || !pwd || !matchPwd || !v1 || !v2) {
      setErrMsg("Invalid fields");
      return;
    }

    const formData = new FormData();
    formData.append("email", user);
    formData.append("pwd", pwd);
    if (profileImg) {
      formData.append("profileImg", profileImg);
    }

    try {
      const response = await axios.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setSuccessMessage(response.data.success);
      setSuccess(true);
      setUser("");
      setPwd("");
      setMatchPwd("");
      setProfileImg("");
      setPreviewSrc("");

      navigate("/login");
    } catch (err) {
      
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
    }
  };
  const triggerFileSelectPopup = () => imgRef.current.click();

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            {successMessage}
            <ReactLoading
              type="spokes"
              color="#fff"
              height={"20%"}
              width={"20%"}
            />
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register</h1>
          <SocialMedia />
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">
              Email:
              <FontAwesomeIcon
                icon={faCheck}
                className={validName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validName || !user ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="email"
              ref={userRef}
              onChange={(e) => setUser(e.target.value)}
              value={user}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              autoComplete="off"
              required
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              invalid email address
            </p>
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
            <label htmlFor="profileImg" style={{ display: 'block', fontWeight: 'bold' }}>
              Profile Picture (optional):
            </label>
            <input
              type="file"
              id="profileImg"
              ref={imgRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
            <div
              onClick={triggerFileSelectPopup}
              style={{
                height: '80px', // Adjusted size
                width: '80px',  // Adjusted size
                borderRadius: '50%',
                background: previewSrc ? `url(${previewSrc})` : '#e0e0e0',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                border: '2px dashed #cccccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '10px auto', // Centered horizontally
              }}
            >
              {!previewSrc && (
                <FontAwesomeIcon
                  icon={faUpload}
                  style={{ fontSize: '24px', color: '#666666' }}
                />
              )}
            </div>
          </div>

            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <button
              disabled={!validName || !validPwd || !validMatch ? true : false}
            >
              Sign Up
            </button>
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              {/*put router link here*/}
              <Link to="/login">Sign In</Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;

