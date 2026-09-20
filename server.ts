import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  getOrCreateUser,
  getUserPreferences,
  updateUserPreferences,
  getUserRoutines,
  upsertRoutine,
  getUserBookmarks,
  addBookmark,
  removeBookmark,
} from './src/db/users.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // User Profile & Sync
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email } = req.user!;
      const { displayName } = req.body;
      const user = await getOrCreateUser(uid, email || '', displayName);
      const preferences = await getUserPreferences(user.id);
      res.json({ user, preferences });
    } catch (error: any) {
      console.error('API sync error:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  // User Preferences
  app.get('/api/user/preferences', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email } = req.user!;
      const user = await getOrCreateUser(uid, email || '');
      const preferences = await getUserPreferences(user.id);
      res.json(preferences);
    } catch (error: any) {
      console.error('API get preferences error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch preferences' });
    }
  });

  app.put('/api/user/preferences', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email } = req.user!;
      const user = await getOrCreateUser(uid, email || '');
      const updated = await updateUserPreferences(user.id, req.body);
      res.json(updated);
    } catch (error: any) {
      console.error('API update preferences error:', error);
      res.status(500).json({ error: error.message || 'Failed to update preferences' });
    }
  });

  // Routines / Daily Tracker
  app.get('/api/routines', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email } = req.user!;
      const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
      const user = await getOrCreateUser(uid, email || '');
      const routines = await getUserRoutines(user.id, date);
      res.json(routines);
    } catch (error: any) {
      console.error('API get routines error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch routines' });
    }
  });

  app.post('/api/routines', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email } = req.user!;
      const { date, routineId, title, completed } = req.body;
      const user = await getOrCreateUser(uid, email || '');
      const routine = await upsertRoutine(
        user.id,
        date || new Date().toISOString().split('T')[0],
        routineId,
        title,
        Boolean(completed)
      );
      res.json(routine);
    } catch (error: any) {
      console.error('API update routine error:', error);
      res.status(500).json({ error: error.message || 'Failed to update routine' });
    }
  });

  // Bookmarks
  app.get('/api/bookmarks', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email } = req.user!;
      const user = await getOrCreateUser(uid, email || '');
      const items = await getUserBookmarks(user.id);
      res.json(items);
    } catch (error: any) {
      console.error('API get bookmarks error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch bookmarks' });
    }
  });

  app.post('/api/bookmarks', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email } = req.user!;
      const { surahNumber, ayahNumber, pageNumber, surahName, note } = req.body;
      const user = await getOrCreateUser(uid, email || '');
      const bookmark = await addBookmark(
        user.id,
        Number(surahNumber),
        Number(ayahNumber),
        pageNumber ? Number(pageNumber) : undefined,
        surahName,
        note
      );
      res.json(bookmark);
    } catch (error: any) {
      console.error('API add bookmark error:', error);
      res.status(500).json({ error: error.message || 'Failed to add bookmark' });
    }
  });

  app.delete('/api/bookmarks/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email } = req.user!;
      const user = await getOrCreateUser(uid, email || '');
      const result = await removeBookmark(user.id, Number(req.params.id));
      res.json(result);
    } catch (error: any) {
      console.error('API delete bookmark error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete bookmark' });
    }
  });

  // Vite middleware for development vs static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
