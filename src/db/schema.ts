import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Daily routines / Ruqyah tracking
export const routines = pgTable('routines', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  routineDate: text('routine_date').notNull(), // Format: YYYY-MM-DD
  routineId: text('routine_id').notNull(), // 'morning', 'evening', 'sleep'
  title: text('title').notNull(),
  completed: boolean('completed').notNull().default(false),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// User preferences & reading progress
export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull()
    .unique(),
  streakCount: integer('streak_count').notNull().default(0),
  lastReadSurah: integer('last_read_surah').default(1),
  lastReadPage: integer('last_read_page').default(1),
  reciterId: text('reciter_id').default('mishari'),
  theme: text('theme').default('light'),
  fontSize: integer('font_size').default(28),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Quran Bookmarks & Saved Ayahs
export const bookmarks = pgTable('bookmarks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  surahNumber: integer('surah_number').notNull(),
  ayahNumber: integer('ayah_number').notNull(),
  pageNumber: integer('page_number'),
  surahName: text('surah_name'),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  routines: many(routines),
  bookmarks: many(bookmarks),
  preferences: one(userPreferences, {
    fields: [users.id],
    references: [userPreferences.userId],
  }),
}));

export const routinesRelations = relations(routines, ({ one }) => ({
  user: one(users, {
    fields: [routines.userId],
    references: [users.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
}));
