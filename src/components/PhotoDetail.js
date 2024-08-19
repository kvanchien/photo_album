import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Comments from "./Comments";

function PhotoDetail() {
  const { id } = useParams();
  const [photo, setPhoto] = useState({});
  const [selectedImage, setSelectedImage] = useState(""); // State for the selected image

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseP = await axios.get("http://localhost:9999/photos/" + id);
        setPhoto(responseP.data);
        // Initialize selectedImage with the first image
        if (responseP.data.image && responseP.data.image.url.length > 0) {
          setSelectedImage(responseP.data.image.url[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleThumbnailClick = (src) => {
    setSelectedImage(src); 
    
  };

  return (
    <Container>
      <Row>
        <Container>
          <Col>
            <h1 className="text-center my-3">PHOTO DETAIL</h1>
          </Col>
        </Container>
      </Row>
      <Row>
        <Col>
          <Link to={"/"}>
            <Button variant="success">Go to Home</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Container></Container>
        <Col md={8}>
          {photo.image && photo.image.url.length > 0 ? (
            <>
              <Card style={{ width: "2rem" }}>
                <Card.Img
                  variant="top"
                  style={{
                    width: "15rem",
                    height: "20rem",
                    objectFit: "cover",
                  }}
                  src={`/images/${selectedImage}`} // Use selectedImage state
                />
              </Card>
              <hr />
              <div className="d-flex flex-wrap" style={{ marginTop: "1rem" }}>
                {photo.image.url.map((url, index) => (
                  <Col
                    key={index}
                    onClick={() => handleThumbnailClick(url)} // Pass the URL directly
                  >
                    <Card.Img
                      variant="top"
                      src={`/images/${url}`}
                      style={{
                        width: "10rem",
                        objectFit: "cover",
                        border: "1px solid transparent",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.border = "2px solid red")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.border = "1px solid transparent")
                      }
                    />
                  </Col>
                ))}
              </div>
              <hr />
            </>
          ) : (
            <p>No images available</p>
          )}
        </Col>
        <Col md={4}>
          <div>
            <h6>ID: {photo.id}</h6>
            <h6>Title: {photo.title} </h6>
            <h8>Tags: {photo.tags && photo.tags.join(", ")} </h8>
          </div>
        </Col>
      </Row>

      <Row>
        <Comments />
      </Row>
    </Container>
  );
}

export default PhotoDetail;
