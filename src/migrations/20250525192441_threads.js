/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('threads', function (table) {
            table.increments('id').primary();
            table.string('subject');
            table.text('content');
            table.string('image_url');
            table.string('image_name');
            table.string('image_size');
            table.string('image_resolution');
            table.string('user_hash')
            table.timestamps(true, true);
        }),
        knex.schema.createTable('replies', function (table) {
            table.increments('id').primary();
            table.integer('thread_id').references('id').inTable('threads');
            table.text('content');
            table.string('user_hash');
            table.timestamps(true, true);
        }),
        knex.schema.createTable('users', function (table) {
            table.string('hash').primary();
            table.string('ip_address');
            table.string('user_agent');
            table.string('device_id');
            table.timestamps(true, true);
        })
    ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('threads'),
        knex.schema.dropTable('replies'),
        knex.schema.dropTable('users')
    ]);
};
