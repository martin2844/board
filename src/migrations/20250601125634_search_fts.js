/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // Create FTS virtual table for threads
    await knex.schema.raw(`
        CREATE VIRTUAL TABLE IF NOT EXISTS threads_fts USING fts5(
            subject, 
            content, 
            content='threads',
            content_rowid='id'
        )
    `);

    // Create FTS virtual table for replies  
    await knex.schema.raw(`
        CREATE VIRTUAL TABLE IF NOT EXISTS replies_fts USING fts5(
            content,
            content='replies', 
            content_rowid='id'
        )
    `);

    // Populate FTS tables with existing data
    await knex.schema.raw(`
        INSERT OR IGNORE INTO threads_fts(rowid, subject, content) 
        SELECT id, subject, content FROM threads
    `);

    await knex.schema.raw(`
        INSERT OR IGNORE INTO replies_fts(rowid, content) 
        SELECT id, content FROM replies
    `);

    // Create triggers to keep FTS tables in sync
    await knex.schema.raw(`
        CREATE TRIGGER IF NOT EXISTS threads_fts_insert AFTER INSERT ON threads BEGIN
            INSERT INTO threads_fts(rowid, subject, content) VALUES (new.id, new.subject, new.content);
        END
    `);

    await knex.schema.raw(`
        CREATE TRIGGER IF NOT EXISTS threads_fts_delete AFTER DELETE ON threads BEGIN
            INSERT INTO threads_fts(threads_fts, rowid, subject, content) VALUES('delete', old.id, old.subject, old.content);
        END
    `);

    await knex.schema.raw(`
        CREATE TRIGGER IF NOT EXISTS threads_fts_update AFTER UPDATE ON threads BEGIN
            INSERT INTO threads_fts(threads_fts, rowid, subject, content) VALUES('delete', old.id, old.subject, old.content);
            INSERT INTO threads_fts(rowid, subject, content) VALUES (new.id, new.subject, new.content);
        END
    `);

    await knex.schema.raw(`
        CREATE TRIGGER IF NOT EXISTS replies_fts_insert AFTER INSERT ON replies BEGIN
            INSERT INTO replies_fts(rowid, content) VALUES (new.id, new.content);
        END
    `);

    await knex.schema.raw(`
        CREATE TRIGGER IF NOT EXISTS replies_fts_delete AFTER DELETE ON replies BEGIN
            INSERT INTO replies_fts(replies_fts, rowid, content) VALUES('delete', old.id, old.content);
        END
    `);

    await knex.schema.raw(`
        CREATE TRIGGER IF NOT EXISTS replies_fts_update AFTER UPDATE ON replies BEGIN
            INSERT INTO replies_fts(replies_fts, rowid, content) VALUES('delete', old.id, old.content);
            INSERT INTO replies_fts(rowid, content) VALUES (new.id, new.content);
        END
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.raw(`DROP TRIGGER IF EXISTS threads_fts_insert`);
    await knex.schema.raw(`DROP TRIGGER IF EXISTS threads_fts_delete`);
    await knex.schema.raw(`DROP TRIGGER IF EXISTS threads_fts_update`);
    await knex.schema.raw(`DROP TRIGGER IF EXISTS replies_fts_insert`);
    await knex.schema.raw(`DROP TRIGGER IF EXISTS replies_fts_delete`);
    await knex.schema.raw(`DROP TRIGGER IF EXISTS replies_fts_update`);
    await knex.schema.raw(`DROP TABLE IF EXISTS threads_fts`);
    await knex.schema.raw(`DROP TABLE IF EXISTS replies_fts`);
}; 