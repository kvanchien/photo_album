import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyAccount = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const generatedCode = location.state?.verificationCode || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !generatedCode) {
      setError('Invalid session. Please try registering again.');
      return;
    }

    if (verificationCode !== generatedCode) {
      setError('Invalid verification code. Please try again.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:9999/users');
      const users = response.data;
      const user = users.find(u => u.account && u.account.email === email);

      if (!user) {
        setError('User not found. Please try registering again.');
        return;
      }

      if (user.account.isActive) {
        setError('This account is already active. Please login.');
        return;
      }

      // Update user's account to be active
      await axios.patch(`http://localhost:9999/users/${user.id}`, {
        account: {
          ...user.account,
          isActive: true,
          activeCode: '',
        },
      });

      setSuccess('Account verified successfully. You will go to login page after 3 seconds.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Verification error:', error);
      setError('An error occurred. Please try again.');
    }
  };
  return (
    <Container className="mt-5">
      <h2>Verify Your Account</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {email ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              disabled
            />
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

// Fictional sendEmail function
const sendEmail = (email, code) => {
  const message = `
    Hello new member,

    You registered succesful. Here is a new message includes active code:

    ${code}

    Best wishes,
    EmailJS team
  `;
  console.log(`Sending email to ${email}: ${message}`);
};

export default VerifyAccount;