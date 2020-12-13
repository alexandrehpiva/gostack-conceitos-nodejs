const express = require('express');
const cors = require('cors');

const { v4: uuid, validate: isUuid } = require('uuid');
const { validateProjectId } = require('./middlewares');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateProjectId);

const repositories = [];

app.get('/repositories', (request, response) => {
  try {
    const { title, url, techs } = request.query;

    let filteredRepos = repositories;

    // Filter by title
    filteredRepos = title
      ? filteredRepos.filter(f =>
          f.title.toLowerCase().includes(title.toLowerCase())
        )
      : filteredRepos;

    // Filter by url
    filteredRepos = url
      ? filteredRepos.filter(f =>
          f.url.toLowerCase().includes(url.toLowerCase())
        )
      : filteredRepos;

    // Filter by techs
    filteredRepos = techs
      ? filteredRepos.filter(f =>
          f.techs.toLowerCase().includes(techs.toLowerCase())
        )
      : filteredRepos;

    return response.json(filteredRepos);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

app.post('/repositories', (request, response) => {
  try {
    const { title, url, techs } = request.body;

    const repository = {
      id: uuid(),
      title,
      url,
      techs: [...techs],
      likes: 0,
    };

    repositories.push(repository);

    return response.status(201).json(repository);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

app.put('/repositories/:id', (request, response) => {
  try {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repoIndex = repositories.findIndex(r => r.id === id);

    if (repoIndex < 0) {
      return response.status(404).json({ error: 'ID not found.' });
    }

    const repo = repositories[repoIndex];

    repositories[repoIndex] = {
      ...repo,
      title,
      url,
      techs: (techs && [...techs]) || [],
    };

    return response.json(repositories[repoIndex]);
  } catch (error) {
    return response.status(500).json({ error });
  }
});

app.delete('/repositories/:id', (request, response) => {
  try {
    const { id } = request.params;

    const repoIndex = repositories.findIndex(r => r.id === id);

    if (repoIndex < 0) {
      return response.status(404).json({ error: 'ID not found.' });
    }

    repositories.splice(repoIndex, 1);

    return response.status(204).send();
  } catch (error) {
    return response.status(500).json({ error });
  }
});

app.post('/repositories/:id/like', (request, response) => {
  try {
    const { id } = request.params;

    const repoIndex = repositories.findIndex(r => r.id === id);

    if (repoIndex < 0) {
      return response.status(404).json({ error: 'ID not found.' });
    }

    const repo = repositories[repoIndex];

    repositories[repoIndex] = {
      ...repo,
      likes: repo.likes + 1,
    };

    return response.json(repositories[repoIndex]);
  } catch (error) {}
});

module.exports = app;
