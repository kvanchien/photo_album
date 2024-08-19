import React, { useState, useEffect } from "react";
import NavbarComponent from "./Navbar";
import Footer from "./Footer";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useUser } from "../UserContext"; // Import the user context

export default function Manage() {
  const { user } = useUser(); // Get the logged-in user from context
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);

  useEffect(() => {
    // Fetch user's albums if a user is logged in
    if (user) {
      fetch(`http://localhost:9999/albums?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setAlbums(data);

          // Fetch photos for the albums
          const albumIds = data.map((album) => album.albumId).join(",");
          if (albumIds) {
            fetch(`http://localhost:9999/photos?albumId=${albumIds}`)
              .then((res) => res.json())
              .then((photoData) => setPhotos(photoData));
          }
        });
    }
  }, [user]);

  const handleCreateAlbum = () => {
    if (newAlbumName) {
      fetch("http://localhost:9999/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: newAlbumName,
          userId: user.id,
        }),
      }).then(() => {
        setNewAlbumName("");
        // Re-fetch albums to update the list
        fetch(`http://localhost:9999/albums?userId=${user.id}`)
          .then((res) => res.json())
          .then((data) => setAlbums(data));
      });
    }
  };

  const handleUploadPhoto = (albumId) => {
    if (newPhoto) {
      const formData = new FormData();
      formData.append("file", newPhoto);

      fetch("http://localhost:9999/photos", {
        method: "POST",
        body: formData,
      }).then(() => {
        setNewPhoto(null);
        // Re-fetch photos to update the list
        fetch(`http://localhost:9999/photos?albumId=${albumId}`)
          .then((res) => res.json())
          .then((data) => setPhotos((prevPhotos) => [...prevPhotos, ...data]));
      });
    }
  };

  return (
    <Container fluid>
      <Row>
        <NavbarComponent />
      </Row>
      <Row>
        <Col>
          <h2 className="text-center mt-3">Manage Your Albums</h2>
          <Row>
            <Col md={3}>
              <Form>
                <Form.Group>
                  <Form.Label>Create New Album</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter album name"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                  />
                  <Button variant="primary" onClick={handleCreateAlbum}>
                    Create Album
                  </Button>
                </Form.Group>
              </Form>
            </Col>
            <Col>
              <Row>
                {albums.map((album) => (
                  <Col key={album.albumId}>
                    <Card>
                      <Card.Body>
                        <Card.Title>{album.description}</Card.Title>
                        <Form>
                          <Form.Group>
                            <Form.Label>Upload Photo</Form.Label>
                            <Form.Control
                              type="file"
                              onChange={(e) => setNewPhoto(e.target.files[0])}
                            />
                            <Button
                              variant="primary"
                              onClick={() => handleUploadPhoto(album.albumId)}
                            >
                              Upload Photo
                            </Button>
                          </Form.Group>
                        </Form>
                        <Row>
                          {photos
                            .filter((photo) => photo.albumId === album.albumId)
                            .map((photo) => (
                              <Col key={photo.photoId} md={6}>
                                <Card.Img
                                  variant="top"
                                  src={photo.image.url}
                                />
                                <Card.Body>
                                  <Card.Text>{photo.title}</Card.Text>
                                </Card.Body>
                              </Col>
                            ))}
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Footer />
      </Row>
    </Container>
  );
}
