const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(session({ secret: 'agent-secret', resave: false, saveUninitialized: true }));

const users = new Map();
const tasks = new Map();

function auth(req, res, next) {
  if (req.session.user) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  if (users.has(username)) return res.status(400).json({ error: 'User exists' });
  users.set(username, { password });
  res.json({ ok: true });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.get(username);
  if (!user || user.password !== password) return res.status(400).json({ error: 'Invalid credentials' });
  req.session.user = { username };
  res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/tasks', auth, (req, res) => {
  const data = Array.from(tasks.values()).filter(t => t.owner === req.session.user.username);
  res.json(data);
});

app.post('/api/tasks', auth, (req, res) => {
  const id = uuidv4();
  const task = { id, owner: req.session.user.username, messages: [] };
  tasks.set(id, task);
  res.json(task);
});

app.get('/api/tasks/:id', auth, (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task || task.owner !== req.session.user.username) return res.status(404).json({ error: 'Not found' });
  res.json(task);
});

app.post('/api/tasks/:id/messages', auth, (req, res) => {
  const { text } = req.body;
  const task = tasks.get(req.params.id);
  if (!task || task.owner !== req.session.user.username) return res.status(404).json({ error: 'Not found' });
  const message = { id: uuidv4(), author: req.session.user.username, text, created: Date.now() };
  task.messages.push(message);
  res.json(message);
});

app.post('/api/tasks/:id/gpt', auth, (req, res) => {
  // Placeholder for GPT call using task context
  res.json({ reply: 'This is a stubbed GPT response.' });
});

app.post('/api/tasks/:id/snippets', auth, (req, res) => {
  const { code } = req.body;
  const task = tasks.get(req.params.id);
  if (!task || task.owner !== req.session.user.username) return res.status(404).json({ error: 'Not found' });
  const version = task.snippets ? task.snippets.length + 1 : 1;
  task.snippets = task.snippets || [];
  task.snippets.push({ version, code, created: Date.now() });
  res.json({ version });
});

app.get('/api/tasks/:id/snippets', auth, (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task || task.owner !== req.session.user.username) return res.status(404).json({ error: 'Not found' });
  res.json(task.snippets || []);
});

app.get('/api/tasks/:id/snippets/:version', auth, (req, res) => {
  const task = tasks.get(req.params.id);
  const version = parseInt(req.params.version, 10);
  if (!task || task.owner !== req.session.user.username) return res.status(404).json({ error: 'Not found' });
  const snippet = (task.snippets || []).find(s => s.version === version);
  if (!snippet) return res.status(404).json({ error: 'Not found' });
  res.json(snippet);
});
app.listen(3001, () => console.log('API running on 3001'));
