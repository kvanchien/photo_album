import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, ListGroup, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

const Comments = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');
  const [editedRating, setEditedRating] = useState(5);
  const [replyingToId, setReplyingToId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchComments();
    fetchUsers();
  }, [id]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9999/comments?photoId=${id}`
      );
      setComments(response.data);
    } catch (error) {
      setError("Error fetching comments");
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:9999/users");
      setUsers(response.data);
    } catch (error) {
      setError("Error fetching users");
      console.error(error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to comment.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:9999/comments", {
        photoId: parseInt(id),
        userId: user.id,
        text: newComment,
        rate: parseInt(newRating),
      });
      setComments([...comments, response.data]);
      setNewComment("");
      setNewRating(5);
    } catch (error) {
      setError("Error posting comment");
      console.error(error);
    }
  };

  const getUserName = (userId) => {
    const foundUser = users.find((user) => user.userId === userId);
    return foundUser ? foundUser.name : "Unknown";
  };

  return (
    <Card className="mt-4">
      <Card.Header>Comments</Card.Header>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Card.Body>
        <ListGroup variant="flush">
          {comments.map((comment) => (
            <ListGroup.Item key={comment.id}>
              <div>
                <strong>{getUserName(comment.userId)}</strong>
              </div>
              <div>{comment.text}</div>
              <div>Rating: {comment.rate}/5</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <br />
        <Form onSubmit={handleSubmitComment}>
          <Form.Group className="mb-3">
            <Form.Label>{replyingToId ? 'Your Reply' : 'Your Comment'}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
          </Form.Group>
          {!replyingToId && (
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={newRating}
                onChange={(e) => setNewRating(e.target.value)}
                required
              />
            </Form.Group>
          )}
          <Button variant="primary" type="submit">
            {replyingToId ? 'Post Reply' : 'Post Comment'}
          </Button>
          {replyingToId && (
            <Button variant="secondary" className="ml-2" onClick={() => setReplyingToId(null)}>
              Cancel Reply
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Comments;
