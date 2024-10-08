import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import NavbarComponent from "./Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [inactiveUser, setInactiveUser] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInactiveUser(null);

    try {
      const response = await axios.get("http://localhost:9999/users");
            const user = response.data.find(u => u.account.email === email && u.account.password === password);

      if (user) {
        if (user.account.isActive) {
          localStorage.setItem("user", JSON.stringify(user)); // Save user to local storage
          navigate("/");
        } else {
          setInactiveUser(user);
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Container fluid>
      <Row>
        <NavbarComponent />
      </Row>
      <h2 className="text-center mt-3">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {inactiveUser && (
        <Alert variant="danger">
          You need to verify your account before proceeding.{" "}
          <Link
            to="/verify-account"
            state={{
              email: inactiveUser.account.email,
              verificationCode: inactiveUser.account.activeCode,
            }}
          >
            Verify your account
          </Link>
        </Alert>
      )}
      <Row>
        <Col></Col>
        <Col>
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

            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
          <p className="mt-3">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <p className="mt-2">
            Forgot Password? <Link to="/forgot-password">Reset password</Link>
          </p>
          <Link to="/">Back to Home</Link>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Footer />
      </Row>
    </Container>
  );
};

export default Login;
