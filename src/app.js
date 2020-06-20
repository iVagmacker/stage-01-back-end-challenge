const express = require('express');
const { uuid } = require('uuidv4');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const repositories = [];

var likes = 0;

app.post('/repositories', (request, response) => {
  likes = 0;
  const { title, url } = request.body;
  const techs = request.body.techs;

  const repository = { id: uuid(), title, url, techs, likes };

  repositories.push(repository);

  return response.json(repository);
});

app.get('/repositories', (request, response) => {
  const { title } = request.query;

  const result = title
    ? repositories.filter((repository) => repository.title.includes(title))
    : repositories;

  return response.json(result);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url } = request.body;
  const techs = request.body.techs;

  const index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return response.status(404).json({ error: 'Repository not found.' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[index] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return response.status(404).json({ error: 'Repository not found.' });
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  const { title, url } = request.body;
  const techs = request.body.techs;
  likes++;

  const index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return response.status(404).json({ error: 'Repository not found.' });
  }

  const repository = { id, title, url, techs, likes };

  repositories[index] = repository;

  return response.json(repository);
});
