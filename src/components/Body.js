import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  ListGroup,
} from "react-bootstrap";
import Album from "./Album";
import Photo from "./Photo";

const Body = ({ albums, photos }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const filteredPhotos = photos.filter(
    (photo) =>
      (!selectedAlbum || photo.albumId === selectedAlbum) &&
      ((photo.title &&
        photo.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (photo.tags &&
          photo.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))) &&
      (selectedTags.length === 0 ||
        (photo.tags && selectedTags.every((tag) => photo.tags.includes(tag))))
  );

  const allTags = [...new Set(photos.flatMap((photo) => photo.tags || []))];

  return (
    <Container className="mt-4">
      <Row>
        <Col md={9}>
          <Row className="mb-3" style={{ justifyContent: "center" }}>
            <Col md={12}>
              <Button
                variant={selectedAlbum === null ? "primary" : "outline-primary"}
                onClick={() => setSelectedAlbum(null)}
                className="mb-2"
              >
                All Albums
              </Button>
            </Col>
            {albums.map((album) => (
              <Col key={album.albumId} md={4}>
                <Button
                  variant={
                    selectedAlbum === album.albumId
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => setSelectedAlbum(album.albumId)}
                  className="mb-2"
                  style={{ width: "100%" }}
                >
                  {album.description}
                </Button>
              </Col>
            ))}
          </Row>
          <Form className="mb-3">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search by title or tags"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Form>
          <Row>
            {filteredPhotos.map((photo) => (
              <Col key={photo.photoId} md={4}>
                <Photo photo={photo} />
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Tags</Card.Title>
              <ListGroup>
                {allTags.map((tag) => (
                  <ListGroup.Item key={tag}>
                    <Form.Check
                      type="checkbox"
                      label={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(
                            selectedTags.filter((t) => t !== tag)
                          );
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Body;
