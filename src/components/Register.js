import React, { useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarComponent from "./Navbar";
import emailjs from "emailjs-com";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.get("http://localhost:9999/users");
      const users = response.data;
      const existingUser = users.find(
        (u) => u.account && u.account.email === email
      );

      if (existingUser) {
        setError("Email already in use");
        return;
      }

      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const newUser = {
        id: users.length + 1,
        userId: users.length + 1,
        name: name,
        account: {
          email: email,
          password: password,
          activeCode: verificationCode,
          isActive: false,
        },
        address: {
          street: "",
          city: "",
          zipcode: "",
        },
      };

      await axios.post("http://localhost:9999/users", newUser);

      // Send verification email
      await sendVerificationEmail(email, verificationCode);

      console.log("Registration successful");
      navigate("/verify-account", { state: { email, verificationCode } });
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const sendVerificationEmail = async (email, code) => {
    try {
      await emailjs.send(
        "service_zh7f8li", //Service ID
        "template_as8273v", //Template ID
        {
          to_email: email,
          code: code,
        },
        "kJErhpnaspsVp_TNQ" //Public key
      );
      console.log("Verification email sent successfully");
    } catch (error) {
      console.error("Error sending verification email:", error);
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
          <h2 className="text-center mt-3">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

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

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
          <p className="mt-3">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
          <Link to="/">Back to Home</Link>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default Register;
