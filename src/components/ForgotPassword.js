import React, { useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NavbarComponent from "./Navbar";
import axios from "axios";
import emailjs from "emailjs-com";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.get("http://localhost:9999/users");
      const users = response.data;
      const user = users.find((u) => u.account.email === email);

      if (!user) {
        setError("Email not found");
        return;
      }

      const newPassword = generateRandomPassword();
      user.account.password = newPassword;

      await axios.put(`http://localhost:9999/users/${user.id}`, user);

      // Send new password to user's email
      await sendNewPasswordEmail(email, newPassword);

      setSuccess("New password sent to your email");
    } catch (error) {
      console.error("Error sending new password:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const generateRandomPassword = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 6; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
  };

  const sendNewPasswordEmail = async (email, newPassword) => {
    try {
      await emailjs.send(
        "service_zh7f8li", //Service ID
        "template_zbnoqri", //Template ID
        {
          to_email: email,
          newPassword: newPassword,
        },
        "kJErhpnaspsVp_TNQ" //Public key
      );
      console.log("New password email sent successfully");
    } catch (error) {
      console.error("Error sending new password email:", error);
    }
  };

  return (
    <Container fluid>
      <Row>
        <NavbarComponent />
      </Row>
      <Row>
        <Col></Col>

        <Col>
          <h2 className="text-center mt-3">Forgot Password</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Send New Password
            </Button>
          </Form>
          <p className="mt-3">
            Back to <Link to="/login">Login</Link>
          </p>
          <Link to="/">Back to Home</Link>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;