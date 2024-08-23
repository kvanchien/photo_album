import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, ListGroup, Form, Button, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { FaStar, FaRegStar} from 'react-icons/fa';

const Comments = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
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
  const { user } = useUser();

  useEffect(() => {
    fetchComments();
    fetchUsers();
  }, [id]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/comments?photoId=${id}`);
      setComments(response.data);
    } catch (error) {
      setError('Error fetching comments');
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:9999/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error fetching users');
      console.error(error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to comment.');
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post('http://localhost:9999/comments', {
        photoId: parseInt(id),
        userId: user.id,
        text: newComment,
        rate: replyingToId ? null : parseInt(newRating),
        parentId: replyingToId
      });
      setComments([...comments, response.data]);
      setNewComment('');
      setNewRating(5);
      setReplyingToId(null);
    } catch (error) {
      setError('Error posting comment');
      console.error(error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await axios.put(`http://localhost:9999/comments/${commentId}`, {
        text: editedComment,
        rate: parseInt(editedRating)
      });
      const updatedComments = comments.map(comment => 
        comment.id === commentId ? { ...comment, text: editedComment, rate: parseInt(editedRating) } : comment
      );
      setComments(updatedComments);
      setEditingCommentId(null);
      setEditedComment('');
      setEditedRating(5);
    } catch (error) {
      setError('Error editing comment');
      console.error(error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`http://localhost:9999/comments/${deleteCommentId}`);
      const updatedComments = comments.filter(comment => comment.id !== deleteCommentId);
      setComments(updatedComments);
      setShowDeleteModal(false);
      setDeleteCommentId(null);
    } catch (error) {
      setError('Error deleting comment');
      console.error(error);
    }
  };

  const getUserName = (userId) => {
    const foundUser = users.find((user) => user.userId === userId);
    return foundUser ? foundUser.name : 'Unknown';
  };

  const RatingStars = ({ rating }) => {
    return (
      <div>
        {[...Array(5)].map((star, index) => {
          const ratingValue = index + 1;
          return (
            <span key={index}>
              {ratingValue <= rating ? <FaStar color="#ffc107" /> : <FaRegStar color="#ffc107" />}
            </span>
          );
        })}
      </div>
    );
  };

  const renderComment = (comment, level = 0) => (
    <ListGroup.Item key={comment.id} style={{ marginLeft: `${level * 20}px` }}>
      <div><strong>{getUserName(comment.userId)}</strong></div>
      {editingCommentId === comment.id ? (
        <Form onSubmit={(e) => { e.preventDefault(); handleEditComment(comment.id); }}>
          <Form.Control
            as="textarea"
            rows={3}
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            required
          />
          {!comment.parentId && (
            <Form.Group className="mb-3 mt-2">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={editedRating}
                onChange={(e) => setEditedRating(e.target.value)}
                required
              />
            </Form.Group>
          )}
          <Button variant="primary" type="submit" size="sm" className="mt-2">
            Save
          </Button>
          <Button variant="secondary" size="sm" className="mt-2 ml-2" onClick={() => setEditingCommentId(null)}>
            Cancel
          </Button>
        </Form>
      ) : (
        <>
          <div>{comment.text}</div>
          {!comment.parentId && <RatingStars rating={comment.rate} />}
          {user && user.id === comment.userId && (
            <>
              <Button variant="link" size="sm" onClick={() => { 
                setEditingCommentId(comment.id); 
                setEditedComment(comment.text);
                setEditedRating(comment.rate || 5);
              }}>
                Edit
              </Button>
              <Button variant="link" size="sm" className="text-danger" onClick={() => {
                setDeleteCommentId(comment.id);
                setShowDeleteModal(true);
              }}>
                Delete
              </Button>
            </>
          )}
          <Button variant="link" size="sm" onClick={() => setReplyingToId(comment.id)}>
            Reply
          </Button>
        </>
      )}
      {comments.filter(c => c.parentId === comment.id).map(childComment => renderComment(childComment, level + 1))}
    </ListGroup.Item>
  );

  return (
    <Card className="mt-4">
      <Card.Header>Comments</Card.Header>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Card.Body>
        <ListGroup variant="flush">
          {comments.filter(comment => !comment.parentId).map(comment => renderComment(comment))}
        </ListGroup>
        <br/>
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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteComment}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default Comments;