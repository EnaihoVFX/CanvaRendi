import { pgTable, text, timestamp, boolean, json, integer, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('User', {
    id: text('id').primaryKey(), // Clerk User ID
    email: text('email').notNull().unique(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const sites = pgTable('Site', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    subdomain: text('subdomain').unique(),
    userId: text('userId').notNull().references(() => users.id),
    isPublished: boolean('isPublished').default(false).notNull(),
    theme: json('theme').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const pages = pgTable('Page', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    siteId: text('siteId').notNull().references(() => sites.id, { onDelete: 'cascade' }),
    isHomePage: boolean('isHomePage').default(false).notNull(),
    minHeight: integer('minHeight').default(800).notNull(),
    height: integer('height').default(1200).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const canvasElements = pgTable('CanvasElement', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    type: text('type').notNull(),
    pageId: text('pageId').notNull().references(() => pages.id, { onDelete: 'cascade' }),
    siteId: text('siteId').notNull().references(() => sites.id, { onDelete: 'cascade' }),
    bounds: json('bounds').notNull(),
    props: json('props').notNull(),
    zIndex: integer('zIndex').notNull(),
    locked: boolean('locked').default(false).notNull(),
    hidden: boolean('hidden').default(false).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    sites: many(sites),
}));

export const sitesRelations = relations(sites, ({ one, many }) => ({
    user: one(users, {
        fields: [sites.userId],
        references: [users.id],
    }),
    pages: many(pages),
    elements: many(canvasElements),
}));

export const pagesRelations = relations(pages, ({ one, many }) => ({
    site: one(sites, {
        fields: [pages.siteId],
        references: [sites.id],
    }),
    elements: many(canvasElements),
}));

export const canvasElementsRelations = relations(canvasElements, ({ one }) => ({
    page: one(pages, {
        fields: [canvasElements.pageId],
        references: [pages.id],
    }),
    site: one(sites, {
        fields: [canvasElements.siteId],
        references: [sites.id],
    }),
}));
