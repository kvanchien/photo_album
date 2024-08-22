import React, { useState, useEffect } from "react";
import NavbarComponent from "./Navbar";
import Footer from "./Footer";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useUser } from "../UserContext";

export default function Manage() {
  const { user } = useUser(); // Get the logged-in user from context
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [newPhotoAlbumId, setNewPhotoAlbumId] = useState("");
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editedPhotoTitle, setEditedPhotoTitle] = useState("");
  const [editedPhotoImage, setEditedPhotoImage] = useState("");

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:9999/albums?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setAlbums(data);
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
        fetch(`http://localhost:9999/albums?userId=${user.id}`)
          .then((res) => res.json())
          .then((data) => setAlbums(data));
      });
    }
  };

  const handleUploadPhoto = (albumId) => {
    if (newPhoto && newPhotoTitle) {
      const formData = new FormData();
      formData.append("file", newPhoto);
      formData.append("title", newPhotoTitle);
      formData.append("albumId", albumId);

      fetch("http://localhost:9999/photos", {
        method: "POST",
        body: formData,
      }).then(() => {
        setNewPhoto(null);
        setNewPhotoTitle("");
        fetch(`http://localhost:9999/photos?albumId=${albumId}`)
          .then((res) => res.json())
          .then((data) => setPhotos((prevPhotos) => [...prevPhotos, ...data]));
      });
    }
  };

  const handleDeleteAlbum = (albumId) => {
    if (window.confirm("Are you sure you want to delete this album?")) {
      fetch(`http://localhost:9999/albums/${albumId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setAlbums(albums.filter((album) => album.albumId !== albumId));
            setPhotos(photos.filter((photo) => photo.albumId !== albumId));
          } else {
            return res.text().then((text) => {
              throw new Error(`Failed to delete the album: ${text}`);
            });
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to delete the album. Please try again.");
        });
    }
  };

  const handleDeletePhoto = (photoId) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      fetch(`http://localhost:9999/photos/${photoId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setPhotos(photos.filter((photo) => photo.photoId !== photoId));
          } else {
            return res.text().then((text) => {
              throw new Error(`Failed to delete the photo: ${text}`);
            });
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to delete the photo. Please try again.");
        });
    }
  };

  const handleEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setEditedPhotoTitle(photo.title);
    setEditedPhotoImage(photo.image);
  };

  const handleUpdatePhoto = () => {
    if (editingPhoto && editedPhotoTitle) {
      const updatedPhoto = { ...editingPhoto };
      updatedPhoto.title = editedPhotoTitle;

      if (newPhoto) {
        updatedPhoto.image = newPhoto;
      }

      fetch(`http://localhost:9999/photos/${editingPhoto.photoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPhoto),
      })
        .then((res) => res.json())
        .then((updatedPhoto) => {
          setPhotos((prevPhotos) =>
            prevPhotos.map((photo) =>
              photo.photoId === updatedPhoto.photoId ? updatedPhoto : photo
            )
          );
          setEditingPhoto(null);
          setEditedPhotoTitle("");
          setNewPhoto(null);
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to update the photo. Please try again.");
        });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addPhoto = (e) => {
    e.preventDefault();
    const newPhotoData = {
      title: newPhotoTitle,
      albumId: newPhotoAlbumId,
      image: newPhoto,
      userId: user.id,
    };

    fetch("http://localhost:9999/photos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPhotoData),
    })
      .then((res) => res.json())
      .then((data) => {
        setPhotos([...photos, data]);
        setNewPhotoTitle("");
        setNewPhotoAlbumId("");
        setNewPhoto(null);
      });
  };

  return (
    <Container fluid>
      <Row>
        <NavbarComponent />
      </Row>
      <Row>
        <Col>
          <h2 className="text-center mt-3">Manage Your Albums and Photos</h2>
          <Row>
            <Col md={2} className="text-center">
              <Row>
                <Form onSubmit={addPhoto}>
                  <h4 className="mt-4">Add New Photo</h4>
                  <Form.Group>
                    <Form.Label>Photo Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={newPhotoTitle}
                      onChange={(e) => setNewPhotoTitle(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Album</Form.Label>
                    <Form.Control
                      as="select"
                      value={newPhotoAlbumId}
                      onChange={(e) => setNewPhotoAlbumId(e.target.value)}
                      required
                    >
                      <option value="">Select Album</option>
                      {albums.map((album) => (
                        <option key={album.albumId} value={album.albumId}>
                          {album.description}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-3">
                    Add
                  </Button>
                </Form>
              </Row>

              <Row className="mt-5">
                <Form>
                  <Form.Group>
                    <Form.Label><h4>Create New Album </h4></Form.Label>
                    <Form.Control
                      className="mb-3"
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
              </Row>
            </Col>
            <Col>
              <Row>
                {albums.map((album) => (
                  <Col key={album.albumId} md={4}>
                    <Card className="mb-4">
                      <Card.Body>
                        <Card.Title>{album.description}</Card.Title>
                        <ul>
                          {photos
                            .filter((photo) => photo.albumId === album.albumId)
                            .map((photo) => (
                              <li key={photo.id}>
                                <img
                                  src={`/images/${photo.image.thumbnailUrl}`}
                                  alt={photo.title}
                                  style={{ width: "100px", height: "100px" }}
                                />
                                <p>Title: {photo.title}</p>
                                {editingPhoto &&
                                editingPhoto.photoId === photo.photoId ? (
                                  <>
                                    <Form.Control
                                      type="text"
                                      value={editedPhotoTitle}
                                      onChange={(e) =>
                                        setEditedPhotoTitle(e.target.value)
                                      }
                                    />
                                    <Form.Control
                                      type="file"
                                      onChange={(e) =>
                                        setNewPhoto(e.target.files[0])
                                      }
                                    />
                                    <Button
                                      variant="primary"
                                      onClick={handleUpdatePhoto}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      onClick={() => setEditingPhoto(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="secondary"
                                      onClick={() => handleEditPhoto(photo)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="danger"
                                      onClick={() =>
                                        handleDeletePhoto(photo.photoId)
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </li>
                            ))}
                        </ul>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteAlbum(album.albumId)}
                        >
                          Delete Album
                        </Button>
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
