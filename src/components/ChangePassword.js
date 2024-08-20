import React, { useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import NavbarComponent from "./Navbar";
import axios from "axios";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useUser();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!user) {
    setError("User not found. Please log in again.");
    return;
  }

  if (user.account.password !== oldPassword) {
    setError("Old password is incorrect");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("New password and confirm password do not match");
    return;
  }

  try {
    const updatedUser = { ...user, account: { ...user.account, password: newPassword } };

    await axios.put(`http://localhost:9999/users/${user.id}`, updatedUser);

    setUser(updatedUser);
    setSuccess("Password changed successfully");
  } catch (error) {
    console.error("Error changing password:", error);
    setError("An error occurred. Please try again.");
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
          <h2 className="text-center mt-3">Change Password</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Change Password
            </Button>
          </Form>
          <Link to="/">Back to Home</Link>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;