const request = require('supertest');
const index = require('../index');
const { isUuid } = require('uuidv4');

describe('Repositories', () => {
  it('should be able to create a new repository', async () => {
    const response = await request(index)
      .post('/repositories')
      .send({
        url: 'https://nestjs.com/',
        title: 'NestJs',
        techs: ['Node', 'Express', 'Framework'],
      });
    console.log(index);

    expect(isUuid(response.body.id)).toBe(true);

    expect(response.body).toMatchObject({
      url: 'https://nestjs.com/',
      title: 'NestJs',
      techs: ['Node', 'Express', 'Framework'],
      likes: 0,
    });
  });
});
it('should be able to list the repositories', async () => {
  const repository = await request(index)
    .post('/repositories')
    .send({
      url: 'https://nestjs.com/',
      title: 'NestJs',
      techs: ['Node', 'Express', 'Framework'],
    });

  const response = await request(index).get('/repositories');

  expect(response.body).toEqual(
    expect.arrayContaining([
      {
        id: repository.body.id,
        url: 'https://nestjs.com/',
        title: 'NestJs',
        techs: ['Node', 'Express', 'Framework'],
        likes: 0,
      },
    ])
  );
});

it('should be able to update repository', async () => {
  const repository = await request(index)
    .post('/repositories')
    .send({
      url: 'https://nestjs.com/',
      title: 'NestJs',
      techs: ['Node', 'Express', 'Framework'],
    });

  const response = await request(index)
    .put(`/repositories/${repository.body.id}`)
    .send({
      url: 'https://www.npmjs.com/package/structure',
      title: 'Node Package Manage',
      techs: ['Application', 'Attributes', 'Javascript', 'ContextApi'],
    });

  expect(isUuid(response.body.id)).toBe(true);

  expect(response.body).toMatchObject({
    url: 'https://www.npmjs.com/package/structure',
    title: 'Node Package Manage',
    techs: ['Application', 'Attributes', 'Javascript', 'ContextApi'],
  });
});

it('should not be able to update a repository that does not exist', async () => {
  await request(index).put(`/repositories/123`).expect(400);
});

it('should not be able to update repository likes manually', async () => {
  const repository = await request(index)
    .post('/repositories')
    .send({
      url: 'https://nestjs.com/',
      title: 'NestJs',
      techs: ['Node', 'Framework', 'Express', 'ContextApi'],
    });

  const response = await request(index)
    .put(`/repositories/${repository.body.id}`)
    .send({
      likes: 15,
    });

  expect(response.body).toMatchObject({
    likes: 0,
  });
});

it('should be able to delete the repository', async () => {
  const response = await request(index)
    .post('/repositories')
    .send({
      url: 'https://nestjs.com/',
      title: 'NestJs',
      techs: ['Node', 'Express', 'Framework'],
    });

  await request(index).delete(`/repositories/${response.body.id}`).expect(204);

  const repositories = await request(index).get('/repositories');

  const repository = repositories.body.find((r) => r.id === response.body.id);

  expect(repository).toBe(undefined);
});

it('should not be able to delete a repository that does not exist', async () => {
  await request(index).delete(`/repositories/123`).expect(400);
});
