import React from 'react';
import { Card } from 'react-bootstrap';

const Album = ({ album, onSelect }) => {
  return (
    <Card className="mb-2" onClick={() => onSelect(album.albumId)}>
      <Card.Body>
        <Card.Title>{album.description}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default Album;