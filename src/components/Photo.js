import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Photo = ({ photo }) => {
  const thumbnailSrc = photo.thumbnail.url
    ? `/images/${photo.thumbnail.url}`
    : `${photo.thumbnail.base64}`;

  return (
    <Card className="mb-3">
      <Card.Img variant="top" src={thumbnailSrc} />
      <Card.Body>
        <Link to={`/photos/${photo.id}`}>
          <Card.Title>{photo.title}</Card.Title>
        </Link>
        <Card.Text>Tags: {photo.tags.join(", ")}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Photo;
