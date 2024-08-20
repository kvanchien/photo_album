import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import emailjs from "emailjs-com";

const VerifyAccount = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendMessage, setResendMessage] = useState(""); // For showing resend messages
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const generatedCode = location.state?.verificationCode || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !generatedCode) {
      setError("Invalid session. Please try registering again.");
      return;
    }

    if (verificationCode !== generatedCode) {
      setError("Invalid verification code. Please try again.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:9999/users");
      const users = response.data;
      const user = users.find((u) => u.account && u.account.email === email);

      if (!user) {
        setError("User not found. Please try registering again.");
        return;
      }

      if (user.account.isActive) {
        setError("This account is already active. Please login.");
        return;
      }

      // Update user's account to be active
      await axios.patch(`http://localhost:9999/users/${user.id}`, {
        account: {
          ...user.account,
          isActive: true,
          activeCode: "",
        },
      });

      setSuccess(
        "Account verified successfully. You will go to login page after 3 seconds."
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Verification error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleResendCode = async () => {
    try {
      setResendMessage("Resending verification code...");
      const response = await axios.get("http://localhost:9999/users");
      const users = response.data;
      const user = users.find((u) => u.account && u.account.email === email);

      if (!user) {
        setError("User not found. Please try registering again.");
        return;
      }

      const baseLocation = window.location.origin;
      const verifyMessage = `Your verification code is ${generatedCode}\n
      Or click the following link to verify your account: ${baseLocation}/verification/${user.userId}/${generatedCode}`;

      await emailjs.send(
        "service_zh7f8li",
        "template_as8273v",
        {
          to_email: email,
          code: verifyMessage,
        },
        "kJErhpnaspsVp_TNQ"
      );

      setResendMessage(
        "Verification code resent successfully. Please check your email."
      );
    } catch (error) {
      console.error("Error resending verification code:", error);
      setError("An error occurred while resending the code. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Verify Your Account</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {resendMessage && <Alert variant="info">{resendMessage}</Alert>}
      {email ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" value={email} disabled />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Verification Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter 6-digit verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              maxLength={6}
              pattern="\d{6}"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Verify Account
          </Button>
          <Button variant="link" onClick={handleResendCode} className="mt-3">
            Resend Verification Code
          </Button>
        </Form>
      ) : (
        <p>
          No email provided. Please <Link to="/register">register again</Link>.
        </p>
      )}
      <p className="mt-3">
        <Link to="/register">Back to Register</Link>
      </p>
    </Container>
  );
};

export default VerifyAccount;
