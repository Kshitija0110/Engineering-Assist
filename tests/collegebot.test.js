const URL = "https://engineering-assist-lh3f.onrender.com";
const username = "Shubhan Singh";
const password = "alfabravo";
const topic = "ex9_2022300118_docker";

let token, userId, chatId;

beforeAll(async () => {
  // Login and get token
  const response = await fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  token = data.token;
  userId = data.userId;
}, 60000);

describe('Chat Operations', () => {
  test('Create a chat', async () => {
    const response = await fetch(`${URL}/chats/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: 'Test Chat', owner: userId, topic })
    });
    const data = await response.json();
    chatId = data._id;
    expect(response.status).toBe(201);
    expect(data.name).toBe('Test Chat');
  }, 60000);

  test('Send a message in the chat', async () => {
    const response = await fetch(`${URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: 'Hello, this is a test message.' })
    });
    expect(response.status).toBe(201);
  }, 60000);

  test('Delete the chat', async () => {
    const response = await fetch(`${URL}/chats/${chatId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    expect(response.status).toBe(204);
  }, 60000);
});

afterAll(async () => {
  // Cleanup: Delete any remaining test chats
  const response = await fetch(`${URL}/chats?topic=${topic}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const chats = await response.json();
  for (const chat of chats) {
    if (chat.name === 'Test Chat') {
      await fetch(`${URL}/chats/${chat._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    }
  }
}, 60000);