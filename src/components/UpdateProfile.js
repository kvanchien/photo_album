import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUser } from "../UserContext";
import NavbarComponent from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

const UpdateProfile = () => {
  const { user, setUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.account.email);
      setStreet(user.address.street);
      setCity(user.address.city);
      setZipcode(user.address.zipcode);
    }
  }, [user]);

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
        setUser(res.data);
        setSuccess("Profile updated successfully!");
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
          <Row>
            <Link>User profile</Link>
          </Row>
          <Row>
            <Link to={"/manage"}>Albums</Link>
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
                name="name"
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
                    name="street"
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
                    name="city"
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
                    name="zipcode"
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
