import {
  pgTable, serial, varchar, text, integer, boolean,
  timestamp, jsonb, uuid, index,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 64 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 128 }).notNull(),
  displayName: varchar('display_name', { length: 128 }),
  role: varchar('role', { length: 16 }).notNull().default('user'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type TaskStatus =
  | 'queued' | 'running' | 'succeeded' | 'partial_failed' | 'failed';

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: integer('owner_id').notNull().references(() => users.id),
  name: varchar('name', { length: 128 }).notNull(),
  project: varchar('project', { length: 128 }).notNull(),
  status: varchar('status', { length: 16 }).notNull().default('queued')
    .$type<TaskStatus>(),
  predictorName: varchar('predictor_name', { length: 64 }).notNull(),
  totalCount: integer('total_count').notNull(),
  finishedCount: integer('finished_count').notNull().default(0),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
}, (t) => ({
  ownerCreated: index('idx_tasks_owner_created').on(t.ownerId, t.createdAt),
  statusIdx: index('idx_tasks_status').on(t.status),
}));

export const taskItems = pgTable('task_items', {
  id: serial('id').primaryKey(),
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  idx: integer('idx').notNull(),
  smiles: text('smiles').notNull(),
  parsedOk: boolean('parsed_ok').notNull().default(false),
  result: jsonb('result'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  taskIdx: index('idx_items_task').on(t.taskId, t.idx),
}));
