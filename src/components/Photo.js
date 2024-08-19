import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Photo = ({ photo }) => {
  return (
    <Card className="mb-3">
      <Card.Img variant="top" src={`/images/${photo.image.thumbnailUrl}`} />
      <Card.Body>
        <Link to={`/photos/${photo.id}`}>
        <Card.Title>{photo.title}</Card.Title>
        </Link>
        
        <Card.Text>Tags: {photo.tags.join(', ')}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Photo;