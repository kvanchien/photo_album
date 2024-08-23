import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Modal,
  Card,
} from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarComponent from "./Navbar";
import Footer from "./Footer";

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

  const fetchAlbums = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:9999/albums`);
      const userAlbums = response.data.filter(
        (album) => album.userId === user.userId
      );
      setAlbums(userAlbums);
      if (userAlbums.length > 0) {
        setSelectedAlbum(userAlbums[0].albumId); // Set the first album as default
        fetchPhotos(userAlbums[0].albumId);
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

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

  const handleSelectAlbum = (albumId) => {
    setSelectedAlbum(albumId);
    fetchPhotos(albumId);
  };

  const handleDeleteAlbum = async (albumId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this album? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`http://localhost:9999/albums/${albumId}`);
        const updatedAlbums = albums.filter(
          (album) => album.albumId !== albumId
        );
        setAlbums(updatedAlbums);
        if (updatedAlbums.length > 0) {
          setSelectedAlbum(updatedAlbums[0].albumId); // Set the first album as default
          fetchPhotos(updatedAlbums[0].albumId);
        } else {
          setSelectedAlbum(null);
          setPhotos([]);
        }
      } catch (error) {
        console.error("Error deleting album:", error);
      }
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await axios.delete(`http://localhost:9999/photos/${photoId}`);
      setPhotos(photos.filter((photo) => photo.photoId !== photoId));
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const handleCreateAlbum = async () => {
    try {
      const newAlbum = {
        description: newAlbumDescription,
        userId: user.userId,
      };
      const response = await axios.post(
        "http://localhost:9999/albums",
        newAlbum
      );
      const updatedAlbums = [...albums, response.data];
      setAlbums(updatedAlbums);
      setSelectedAlbum(response.data.albumId); // Set the new album as selected
      setShowAlbumModal(false);
      setNewAlbumDescription("");
    } catch (error) {
      console.error("Error creating album:", error);
    }
  };

  const handleCreatePhoto = async () => {
    try {
      const imageUrls = await Promise.all(
        newPhotoImages.map(async (image) => {
          const base64 = await toBase64(image);
          return base64;
        })
      );

      const thumbnailBase64 = await toBase64(newPhotoThumbnail);

      const newPhoto = {
        title: newPhotoTitle,
        albumId: selectedAlbum,
        tags: newPhotoTags.split(" "),
        image: {
          url: [], // URLs can be added here if needed
          base64: imageUrls,
        },
        thumbnail: {
          url: "", // URLs can be added here if needed
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

  const getImageSrc = (image) => {
    return image.url ? `/images/${image.url}` : image.base64;
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
          </div>
        </Col>

        {/* Center Column */}
        <Col md={3} className="p-4" style={{ borderRight: "1px solid #ccc" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Manage Albums</h5>
            <Button onClick={() => setShowAlbumModal(true)}>
              Create Album
            </Button>
          </div>
          {albums.length > 0 ? (
            albums.map((album) => (
              <Form
                key={album.albumId}
                className={`d-flex justify-content-between align-items-center mb-2 p-2 ${
                  album.albumId === selectedAlbum ? "bg-primary text-white" : ""
                }`}
                onClick={() => handleSelectAlbum(album.albumId)}
              >
                <Form.Check
                  type="radio"
                  checked={album.albumId === selectedAlbum}
                  readOnly
                  label={album.description}
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAlbum(album.albumId);
                  }}
                >
                  Delete
                </Button>
              </Form>
            ))
          ) : (
            <p>No albums available</p>
          )}
        </Col>

        {/* Right Column */}
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
          {selectedAlbum ? (
            <>
              <Row className="mt-3">
                {photos.length > 0 ? (
                  photos.map((photo) => (
                    <Col md={4} key={photo.photoId} className="mb-3">
                      <Card className="text-center">
                        <Card.Img
                          variant="top"
                          src={getImageSrc(photo.thumbnail)}
                          alt={photo.title}
                          className="img-thumbnail"
                          style={{
                            cursor: "pointer",
                            height: "150px",
                            objectFit: "cover",
                          }}
                          onClick={() => handleDeletePhoto(photo.photoId)}
                        />
                        <Card.Body>
                          <Link
                            to={`/photos/${photo.photoId}`}
                            className="d-block mt-2"
                          >
                            {photo.title}
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p>No photos available</p>
                )}
              </Row>
            </>
          ) : (
            <h5>Select an album to view photos</h5>
          )}
        </Col>
      </Row>

      {/* Modals */}
      <Modal show={showAlbumModal} onHide={() => setShowAlbumModal(false)}>
        <Modal.Header closeButton>Create New Album</Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAlbumDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter album description"
                value={newAlbumDescription}
                onChange={(e) => setNewAlbumDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAlbumModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateAlbum}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPhotoModal} onHide={() => setShowPhotoModal(false)}>
        <Modal.Header closeButton>Add New Photo</Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPhotoTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter photo title"
                value={newPhotoTitle}
                onChange={(e) => setNewPhotoTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPhotoTags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tags (separated by spaces)"
                value={newPhotoTags}
                onChange={(e) => setNewPhotoTags(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPhotoThumbnail">
              <Form.Label>Thumbnail Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setNewPhotoThumbnail(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group controlId="formPhotoImages">
              <Form.Label>Images</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setNewPhotoImages([...e.target.files])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPhotoModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreatePhoto}>
            Add Photo
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Footer />
      </Row>
    </Container>
  );
};

export default Manage;
