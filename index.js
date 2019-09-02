const express = require("express");
const server = express();
server.use(express.json());

const db = require("./data/db.js");

// Create new user
server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.insert(req.body)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "There was an error while adding the user to the database." });
    });
  }
});

// Get all users from the database
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({ error: "The users information could not be retrieved." })
    });
});

// Get user by specific ID
server.get('/api/users/:id', (req, res) => {
  db.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." })
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." })
    })
});

// Delete user by specific ID
server.delete('/api/users/:id', (req, res) => {
  db.remove(req.params.id)
    .then(user => {
      if (user) {
        res.status(200)
        .json({ message: "user successfully deleted" });
      } else {
        res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
      };
    })
    .catch(() => {
      res 
        .status(500)
        .json({ error: "The user could not be removed" });
    });
});

// Update specific user by ID
server.put('/api/users/:id', (req, res) => {
  const { name, bio } = req.body;

  if (!name || !bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.update(req.params.id, req.body)
      .then(updatedUser => {
        if (updatedUser) {
          res.status(200).json(updatedUser)
        } else {
          res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
      })
      .catch(() => {
        res.status(500).json({ errorMessage: "The user information could not be modified." })
      })
  }

  const { id } = req.params;
  const changes = req.body;
  db.update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200)
        .json(updated);
      } else {
        res.status(404)
        .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(() => {
      res.status(500)
      .json({ message: 'error updating user' });
    });
});


server.listen(8000, () => console.log("API running on port 8000"));
