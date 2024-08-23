import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import Comments from "./Comments";
import Navbar from "./Navbar"; // Assuming you have a Navbar component
import Footer from "./Footer"; // Assuming you have a Footer component

function PhotoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState({});
  const [selectedImage, setSelectedImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadImages, setUploadImages] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [albumCreator, setAlbumCreator] = useState(""); // To store the album creator

  // Retrieve user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const photoResponse = await axios.get(
          "http://localhost:9999/photos/" + id
        );
        const photoData = photoResponse.data;

        if (photoData.image && Array.isArray(photoData.image.url)) {
          setPhoto(photoData);
          const firstImageUrl = photoData.image.url[0];
          setSelectedImage(
            firstImageUrl
              ? `/images/${firstImageUrl}`
              : photoData.image.base64[0] || ""
          );

          // Fetch album info to get the creator
          const albumResponse = await axios.get(
            `http://localhost:9999/albums/${photoData.albumId}`
          );
          const albumData = albumResponse.data;
          setAlbumCreator(albumData.userId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleThumbnailClick = (url, base64) => {
    setSelectedImage(url ? `/images/${url}` : `${base64}`);
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
      user_name: user ? user.name : "John Doe",
      photo_url: window.location.href,
      to_email: email,
    };

    try {
      await emailjs.send(
        "service_tzrcl6t",
        "template_4jxt27r",
        templateParams,
        "OMf5QwixZwebkY_wH"
      );
      setSuccessMessage("Email sent successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailError("Failed to send email. Please try again.");
    }
  };

  const handleUploadImages = async () => {
    try {
      const imageUrls = await Promise.all(
        uploadImages.map(async (image) => {
          return await toBase64(image);
        })
      );

      const updatedPhoto = {
        ...photo,
        image: {
          ...photo.image,
          base64: [...(photo.image.base64 || []), ...imageUrls],
        },
      };

      await axios.put(`http://localhost:9999/photos/${id}`, updatedPhoto);
      setPhoto(updatedPhoto);
      setShowUploadModal(false);
      setUploadImages([]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleDeletePhoto = async () => {
    try {
      await axios.delete(`http://localhost:9999/photos/${id}`);
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  return (
    <>
      <Navbar />
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
            {user && (
              <>
                <Button
                  variant="info"
                  onClick={handleShareClick}
                  className="ml-2"
                >
                  Share via Email
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowUploadModal(true)}
                  className="ml-2"
                >
                  Upload Image
                </Button>
                {albumCreator === user.userId && ( // Show delete button if the album creator matches the current user
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="ml-2"
                  >
                    Delete Photo
                  </Button>
                )}
              </>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            {photo.image &&
            Array.isArray(photo.image.url) &&
            (photo.image.url.length > 0 || photo.image.base64.length > 0) ? (
              <>
                <Card>
                  <Card.Img
                    variant="top"
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                    src={selectedImage}
                  />
                </Card>
                <hr />
                <div className="d-flex flex-wrap" style={{ marginTop: "1rem" }}>
                  {Array.isArray(photo.image.url) &&
                    photo.image.url.map((url, index) => (
                      <Col
                        key={index}
                        onClick={() =>
                          handleThumbnailClick(url, photo.image.base64[index])
                        }
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
                            (e.currentTarget.style.border =
                              "1px solid transparent")
                          }
                        />
                      </Col>
                    ))}
                  {Array.isArray(photo.image.base64) &&
                    photo.image.base64.map((base64, index) => (
                      <Col
                        key={index}
                        onClick={() => handleThumbnailClick(null, base64)}
                      >
                        <Card.Img
                          variant="top"
                          src={`${base64}`}
                          style={{
                            width: "10rem",
                            objectFit: "cover",
                            border: "1px solid transparent",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.border = "2px solid red")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.border =
                              "1px solid transparent")
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
            </Row>
          </Col>
        </Row>

        <Row>
          <Comments />
        </Row>

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
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="ml-2"
              >
                Close
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Upload Images</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFileMultiple">
                <Form.Label>Select Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={(e) => setUploadImages(Array.from(e.target.files))}
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={handleUploadImages}
                className="mt-3"
              >
                Upload
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={showDeleteConfirm}
          onHide={() => setShowDeleteConfirm(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to delete this photo? This action cannot be
              undone.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeletePhoto}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {successMessage && (
          <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default PhotoDetail;
