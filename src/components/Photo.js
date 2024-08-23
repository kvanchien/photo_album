import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Photo = ({ photo }) => {
  return (
    <Card className="mb-3 shadow-sm" style={styles.card}>
      <Card.Img 
        variant="top" 
        src={`/images/${photo.image.thumbnailUrl}`} 
        style={styles.image} 
      />
      <Card.Body style={styles.body}>
        <Link to={`/photos/${photo.id}`} style={styles.link}>
          <Card.Title style={styles.title}>{photo.title}</Card.Title>
        </Link>
        <Card.Text style={styles.text}>Tags: {photo.tags.join(', ')}</Card.Text>
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
