import React, { useState, useEffect } from "react";
import { Container, Alert } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const Verification = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState(""); // State for the warning message
  const navigate = useNavigate();
  const { userId, verificationCode } = useParams(); // Extract userId and verificationCode from URL

  useEffect(() => {
    const verifyUser = async () => {
      if (!userId || !verificationCode) {
        setErrorMessage(
          "Invalid verification session. Please try registering again."
        );
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:9999/users/${userId}`
        );
        const user = response.data;

        if (!user) {
          setErrorMessage("User not found. Please try registering again.");
          return;
        }

        if (user.account.isActive) {
          setWarningMessage(
            "This account is already active. Redirecting you to the login page..."
          );
          setTimeout(() => navigate("/login"), 5000); // 5-second delay before redirecting
          return;
        }

        if (verificationCode !== user.account.activeCode) {
          setErrorMessage(
            "Invalid verification code. Please try registering again."
          );
          return;
        }

        // Update user's account to be active
        await axios.patch(`http://localhost:9999/users/${userId}`, {
          account: {
            ...user.account,
            isActive: true,
            activeCode: "", // Clear the active code after successful verification
          },
        });

        setSuccessMessage(
          "Account verified successfully. You will be redirected to the login page in 5 seconds."
        );
        setTimeout(() => navigate("/login"), 5000); // 5-second delay before redirecting
      } catch (error) {
        setErrorMessage("An error occurred. Please try again.");
        console.error("Verification error:", error);
      }
    };

    verifyUser();
  }, [userId, verificationCode, navigate]);

  return (
    <Container className="mt-5">
      <h2>Verify Your Account</h2>
      {errorMessage && (
        <>
          <Alert variant="danger">{errorMessage}</Alert>
          <p className="mt-3">
            <Link to="/register">Back to Register</Link>
          </p>
        </>
      )}
      {warningMessage && <Alert variant="warning">{warningMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
    </Container>
  );
};

export default Verification;