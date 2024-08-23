import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarComponent from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

const UpdateProfile = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Get user from local storage
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.account.email || "");
  const [street, setStreet] = useState(user?.address.street || "");
  const [city, setCity] = useState(user?.address.city || "");
  const [zipcode, setZipcode] = useState(user?.address.zipcode || "");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const updatedUser = {
      ...user,
      name,
      account: {
        ...user.account,
        email,
      },
      address: {
        street,
        city,
        zipcode: parseInt(zipcode),
      },
    };

    axios
      .put(`http://localhost:9999/users/${user.id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data)); // Update user in local storage
        setSuccess("Profile updated successfully!");
        window.location.reload(); // Reload the page
      })
      .catch((err) => {
        setError("Failed to update profile.");
        console.error(err);
      });
  };

  return (
    <Container fluid>
      <Row>
        <NavbarComponent />
      </Row>

      <Row>
        <Col md={2}>
          <Row className="mt-3 mb-3">
            <Button style={{ width: "150px" }}>
              <Link style={{ color: "white" }}>User profile</Link>
            </Button>
          </Row>
          <Row>
            <Button style={{ width: "150px" }}>
              <Link style={{ color: "white" }} to="/manage">
                Albums
              </Link>
            </Button>
          </Row>
        </Col>

        <Col>
          <h2 className="text-center mt-3">Information</h2>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                disabled
                readOnly
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Row>
              <Col md={4}>
                <Form.Group controlId="formStreet" className="mt-3">
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formCity" className="mt-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formZipcode" className="mt-3">
                  <Form.Label>Zipcode</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your zipcode"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Link to="/change-password">Change password</Link>
            </Row>
            <Button variant="primary" type="submit" className="mt-4">
              Edit
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Footer />
      </Row>
    </Container>
  );
};

export default UpdateProfile;
