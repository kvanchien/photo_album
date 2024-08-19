import React, { useState } from 'react';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import Album from './Album';
import Photo from './Photo';

const Body = ({ albums, photos }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const filteredPhotos = photos.filter(photo => 
    (!selectedAlbum || photo.albumId === selectedAlbum) &&
    (photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedTags.length === 0 || selectedTags.every(tag => photo.tags.includes(tag)))
  );

  const allTags = [...new Set(photos.flatMap(photo => photo.tags))];

  return (
    <Container className="mt-4">
      <Row>
        <Col md={9}>
          <Row className="mb-3" style={{justifyContent:"center"}}>
            {albums.map(album => (
              <Col key={album.albumId} md={4}>
                <Album album={album} onSelect={setSelectedAlbum} />
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
            {filteredPhotos.map(photo => (
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
              {allTags.map(tag => (
                <Form.Check 
                  key={tag}
                  type="checkbox"
                  label={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                />
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Body;