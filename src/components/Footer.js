import React from "react";
import { Row, Col} from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="footer mt-5">
      <Row style={{
          position: "fixed",
          bottom: "0",
          width: "100%",
        }}>
        <Col xs={12} style={{ backgroundColor: "#212529", color: "white" }}>
          <p className="text-center">
            &copy; Footer. All rights reserved.
          </p>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
