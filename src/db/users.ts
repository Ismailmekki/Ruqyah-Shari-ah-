import { db } from './index.ts';
import { users, routines, userPreferences, bookmarks } from './schema.ts';
import { eq, and, desc } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(displayName ? { displayName } : {}),
        },
      })
      .returning();

    const user = result[0];

    // Ensure preferences record exists
    if (user) {
      await db
        .insert(userPreferences)
        .values({
          userId: user.id,
        })
        .onConflictDoNothing({
          target: userPreferences.userId,
        });
    }

    return user;
  } catch (error) {
    console.error('getOrCreateUser database error:', error);
    throw new Error('Failed to retrieve or create user record', { cause: error });
  }
}

export async function getUserRoutines(userId: number, date: string) {
  try {
    return await db
      .select()
      .from(routines)
      .where(and(eq(routines.userId, userId), eq(routines.routineDate, date)));
  } catch (error) {
    console.error('getUserRoutines database error:', error);
    throw new Error('Failed to retrieve daily routines', { cause: error });
  }
}

export async function upsertRoutine(
  userId: number,
  date: string,
  routineId: string,
  title: string,
  completed: boolean
) {
  try {
    const existing = await db
      .select()
      .from(routines)
      .where(
        and(
          eq(routines.userId, userId),
          eq(routines.routineDate, date),
          eq(routines.routineId, routineId)
        )
      );

    if (existing.length > 0) {
      const updated = await db
        .update(routines)
        .set({
          completed,
          updatedAt: new Date(),
        })
        .where(eq(routines.id, existing[0].id))
        .returning();
      return updated[0];
    } else {
      const inserted = await db
        .insert(routines)
        .values({
          userId,
          routineDate: date,
          routineId,
          title,
          completed,
        })
        .returning();
      return inserted[0];
    }
  } catch (error) {
    console.error('upsertRoutine database error:', error);
    throw new Error('Failed to update daily routine item', { cause: error });
  }
}

export async function getUserPreferences(userId: number) {
  try {
    const records = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return records[0] || null;
  } catch (error) {
    console.error('getUserPreferences database error:', error);
    throw new Error('Failed to retrieve user preferences', { cause: error });
  }
}

export async function updateUserPreferences(
  userId: number,
  data: {
    streakCount?: number;
    lastReadSurah?: number;
    lastReadPage?: number;
    reciterId?: string;
    theme?: string;
    fontSize?: number;
  }
) {
  try {
    const updated = await db
      .insert(userPreferences)
      .values({
        userId,
        ...data,
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          ...data,
          updatedAt: new Date(),
        },
      })
      .returning();
    return updated[0];
  } catch (error) {
    console.error('updateUserPreferences database error:', error);
    throw new Error('Failed to update user preferences', { cause: error });
  }
}

export async function getUserBookmarks(userId: number) {
  try {
    return await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt));
  } catch (error) {
    console.error('getUserBookmarks database error:', error);
    throw new Error('Failed to retrieve bookmarks', { cause: error });
  }
}

export async function addBookmark(
  userId: number,
  surahNumber: number,
  ayahNumber: number,
  pageNumber?: number,
  surahName?: string,
  note?: string
) {
  try {
    const inserted = await db
      .insert(bookmarks)
      .values({
        userId,
        surahNumber,
        ayahNumber,
        pageNumber: pageNumber || null,
        surahName: surahName || null,
        note: note || null,
      })
      .returning();
    return inserted[0];
  } catch (error) {
    console.error('addBookmark database error:', error);
    throw new Error('Failed to create bookmark', { cause: error });
  }
}

export async function removeBookmark(userId: number, bookmarkId: number) {
  try {
    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.userId, userId)));
    return { success: true };
  } catch (error) {
    console.error('removeBookmark database error:', error);
    throw new Error('Failed to delete bookmark', { cause: error });
  }
}
