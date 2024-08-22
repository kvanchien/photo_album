import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Container, Row, Col, Form, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import emailjs from "emailjs-com";
import Comments from "./Comments";
import { useUser } from "../UserContext"; // Import the useUser hook

function PhotoDetail() {
  const { id } = useParams();
  const [photo, setPhoto] = useState({});
  const [selectedImage, setSelectedImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useUser(); // Get the logged-in user

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:9999/photos/" + id);
        setPhoto(response.data);
        if (response.data.image && response.data.image.url.length > 0) {
          setSelectedImage(response.data.image.url[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleThumbnailClick = (src) => {
    setSelectedImage(src);
  };

  const handleShareClick = () => {
    setShowModal(true);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    const templateParams = {
      user_name: user.name || "John Doe", // Replace with the actual user's name
      photo_url: window.location.href, // The URL of the current photo
      to_email: email, // The recipient's email address
    };

    try {
      await emailjs.send(
        "service_tzrcl6t", // Service ID
        "template_4jxt27r", // Template ID
        templateParams,
        "OMf5QwixZwebkY_wH" // Public key
      );
      setSuccessMessage("Email sent successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailError("Failed to send email. Please try again.");
    }
  };

  return (
    <Container>
      <Row>
        <Container>
          <Col>
            <h1 className="text-center my-3">PHOTO DETAIL</h1>
          </Col>
        </Container>
      </Row>
      <Row>
        <Col className="mb-3">
          <Link to={"/"}>
            <Button variant="success">Go to Home</Button>
          </Link>
<<<<<<< HEAD
          
=======
          {user && ( // Conditionally render the share button
            <Button variant="info" onClick={handleShareClick} className="ml-2">
              Share via Email
            </Button>
          )}
>>>>>>> 05a93e453da4e6ff5ae7629b5742c97e28073598
        </Col>
      </Row>
      <Row>
        <Container></Container>
        <Col md={8}>
          {photo.image && photo.image.url.length > 0 ? (
            <>
              <Card style={{ width: "2rem" }}>
                <Card.Img
                  variant="top"
                  style={{
                    width: "30rem",
                    height: "20rem",
                  }}
                  src={`/images/${selectedImage}`}
                />
              </Card>
              <hr />
              <div className="d-flex flex-wrap" style={{ marginTop: "1rem" }}>
                {photo.image.url.map((url, index) => (
                  <Col
                    key={index}
                    onClick={() => handleThumbnailClick(url)}
                  >
                    <Card.Img
                      variant="top"
                      src={`/images/${url}`}
                      style={{
                        width: "10rem",
                        objectFit: "cover",
                        border: "1px solid transparent",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.border = "2px solid red")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.border = "1px solid transparent")
                      }
                    />
                  </Col>
                ))}
              </div>
              <hr />
            </>
          ) : (
            <p>No images available</p>
          )}
        </Col>
        <Col md={4}>
          <Row>
            <h6>ID: {photo.id}</h6>
            <h6>Title: {photo.title}</h6>
            <h8>Tags: {photo.tags && photo.tags.join(", ")}</h8>
<<<<<<< HEAD
            
          </Row>
          <Row>
          {user && ( // Conditionally render the share button
            <Button variant="info" onClick={handleShareClick} className="ml-2">
              Share via Email
            </Button>
          )}
          </Row>
=======
          </div>
>>>>>>> 05a93e453da4e6ff5ae7629b5742c97e28073598
        </Col>
      </Row>

      <Row>
        <Comments />
      </Row>

      {/* Modal for Email Sharing */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Share Photo via Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSendEmail}>
            <Form.Group>
              <Form.Label>Recipient Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p style={{ color: "red" }}>{emailError}</p>}
            </Form.Group>
            <Button variant="primary" type="submit">
              Send Email
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {successMessage && (
        <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>
      )}
    </Container>
  );
}

export default PhotoDetail;