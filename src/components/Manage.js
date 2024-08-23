import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarComponent from "./Navbar";
import Footer from "./Footer";
import Photo from "./Photo";

const Manage = () => {
  const [user, setUser] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [newAlbumDescription, setNewAlbumDescription] = useState("");
  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [newPhotoThumbnail, setNewPhotoThumbnail] = useState(null);
  const [newPhotoImages, setNewPhotoImages] = useState([]);
  const [newPhotoTags, setNewPhotoTags] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAlbums();
    }
  }, [user]);

  useEffect(() => {
    if (selectedAlbum) {
      fetchPhotos(selectedAlbum);
    }
  }, [selectedAlbum]);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/albums`);
      const userAlbums = response.data.filter(
        (album) => album.userId === user.userId
      );
      setAlbums(userAlbums);
      if (userAlbums.length > 0) {
        setSelectedAlbum(userAlbums[0].albumId);
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  const fetchPhotos = async (albumId) => {
    try {
      const response = await axios.get(
        `http://localhost:9999/photos?albumId=${albumId}`
      );
      setPhotos(response.data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const handleCreateAlbum = async () => {
    try {
      const newAlbumId =
        albums.length > 0 ? Math.max(...albums.map((a) => a.albumId)) + 1 : 1;
      const newAlbum = {
        albumId: newAlbumId,
        description: newAlbumDescription,
        userId: user.userId,
      };
      const response = await axios.post(
        "http://localhost:9999/albums",
        newAlbum
      );
      setAlbums([...albums, response.data]);
      setShowAlbumModal(false);
      setNewAlbumDescription("");
      setSelectedAlbum(newAlbumId);
    } catch (error) {
      console.error("Error creating album:", error);
    }
  };
  const handleCreatePhoto = async () => {
    try {
      const existingPhotosResponse = await axios.get(
        "http://localhost:9999/photos"
      );
      const allPhotos = existingPhotosResponse.data;
      const newPhotoId =
        allPhotos.length > 0
          ? Math.max(...allPhotos.map((p) => p.photoId)) + 1
          : 1;

      // Convert thumbnail to base64
      const thumbnailBase64 = newPhotoThumbnail
        ? await toBase64(newPhotoThumbnail)
        : "";

      // Convert other images to base64
      const imageUrls = await Promise.all(
        newPhotoImages.map(async (image) => {
          return await toBase64(image);
        })
      );

      const newPhoto = {
        photoId: newPhotoId,
        title: newPhotoTitle,
        albumId: selectedAlbum,
        tags: newPhotoTags.split(" "),
        image: {
          url: [], // If URLs are provided, they can be added here
          base64: imageUrls,
        },
        thumbnail: {
          url: "", // If URL is provided for thumbnail, it can be added here
          base64: thumbnailBase64,
        },
      };

      const response = await axios.post(
        "http://localhost:9999/photos",
        newPhoto
      );
      setPhotos([...photos, response.data]);
      setShowPhotoModal(false);
      setNewPhotoTitle("");
      setNewPhotoThumbnail(null);
      setNewPhotoImages([]);
      setNewPhotoTags("");
    } catch (error) {
      console.error("Error creating photo:", error);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <Container fluid>
      <Row>
        <NavbarComponent />
      </Row>

      <Row className="mt-4">
        {/* Left Column */}
        <Col
          md={3}
          className="bg-light p-4"
          style={{ borderRight: "1px solid #ccc" }}
        >
          <div className="d-flex flex-column">
            <Link to="/profile" className="mb-3">
              <Button>User Profile</Button>
            </Link>
            <h5 className="mt-4">Albums</h5>
            <Button onClick={() => setShowAlbumModal(true)}>
              Create Album
            </Button>
          </div>
        </Col>

        {/* Center Column: Album Selection */}
        <Col md={3} className="p-4" style={{ borderRight: "1px solid #ccc" }}>
          <h5>Albums</h5>
          <ListGroup>
            {albums.map((album) => (
              <ListGroup.Item
                key={album.albumId}
                action
                active={album.albumId === selectedAlbum}
                onClick={() => setSelectedAlbum(album.albumId)}
              >
                <Form.Check
                  type="radio"
                  id={`album-${album.albumId}`}
                  label={album.description}
                  name="albumSelection"
                  checked={album.albumId === selectedAlbum}
                  onChange={() => setSelectedAlbum(album.albumId)}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Right Column: Photos */}
        <Col md={6} className="p-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Photos</h5>
            <Button
              onClick={() => setShowPhotoModal(true)}
              disabled={!selectedAlbum}
            >
              Upload Photo
            </Button>
          </div>
          <Row className="mt-3">
            {photos.length > 0 ? (
              photos.map((photo) => (
                <Col md={4} key={photo.photoId} className="mb-3">
                  <Photo photo={photo} />
                </Col>
              ))
            ) : (
              <p>No photos available</p>
            )}
          </Row>
        </Col>
      </Row>

      <Footer />

      {/* Album Creation Modal */}
      <Modal
        show={showAlbumModal}
        onHide={() => setShowAlbumModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Album</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="albumDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newAlbumDescription}
                onChange={(e) => setNewAlbumDescription(e.target.value)}
                placeholder="Enter album description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAlbumModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateAlbum}>
            Create Album
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Photo Upload Modal */}
      <Modal
        show={showPhotoModal}
        onHide={() => setShowPhotoModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Photos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="photoTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newPhotoTitle}
                onChange={(e) => setNewPhotoTitle(e.target.value)}
                placeholder="Enter photo title"
              />
            </Form.Group>

            <Form.Group controlId="photoTags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                value={newPhotoTags}
                onChange={(e) => setNewPhotoTags(e.target.value)}
                placeholder="Enter tags (separated by spaces)"
              />
            </Form.Group>

            <Form.Group controlId="photoThumbnail">
              <Form.Label>Thumbnail</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setNewPhotoThumbnail(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group controlId="photoImages">
              <Form.Label>Photos</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setNewPhotoImages([...e.target.files])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPhotoModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreatePhoto}>
            Upload Photos
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Manage;
