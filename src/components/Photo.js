import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Photo = ({ photo }) => {
  const thumbnailSrc = photo.thumbnail.url
    ? `/images/${photo.thumbnail.url}`
    : `${photo.thumbnail.base64}`;

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

// Custom styles object
const styles = {
  card: {
    borderRadius: '10px',
    overflow: 'hidden',
    transition: 'transform 0.2s',
  },
  image: {
  
    objectFit: 'cover',
  },
  body: {
    padding: '15px',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  text: {
    color: '#6c757d',
  },
};

export default Photo;
