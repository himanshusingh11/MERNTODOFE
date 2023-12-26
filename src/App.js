import React, { useState, useEffect } from "react";
import { Container, Form, Button, ListGroup } from "react-bootstrap";
import { Toast } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [showToast, setShowToast] = useState(false);

  const API_URL = "http://localhost:5000/api/todos";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.log(err));
  }, []);

  // Add a new todo
  const handleAddTodo = () => {
    if (!task.trim()) {
      setShowToast(true);
      return;
    }
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos([...todos, data]);
        setTask("");
      })
      .catch((err) => console.log(err));
  };


  const handleDeleteTodo = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((err) => console.log(err));
  };
  return (
    <Container className="App">
      <h1 className="mt-3">TODO App</h1>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: "absolute",
          top: 20,
          right: 20,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>Please enter a task!</Toast.Body>
      </Toast>
      <Form>
        <Form.Group>
          <Form.Control
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task..."
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddTodo}>
          Add Task
        </Button>
      </Form>
      <ListGroup className="mt-3">
        {todos?.map((todo) => (
            <ListGroup.Item key={todo._id}>
        {todo.task}
        <Button
          variant="danger"
          className="float-end"
          onClick={() => handleDeleteTodo(todo._id)}
        >
          <Trash />
        </Button>
      </ListGroup.Item>
        ))}
      </ListGroup>

    
    </Container>
  );
}

export default App;
