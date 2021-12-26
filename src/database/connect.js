import knex from 'knex';
import fs from 'fs';

const path = './src/database/announcements-notice-tg-bot.sqlite3';

export const db = knex({
    client: 'sqlite3',
    connection: {
      filename: path,
    },
});

fs.readFile(path, async (error) => {
    if (error) {
        console.warn('database isn\'t exist, create database with table');

        try {
            await db.schema.createTable('links', table => {
                table.increments('id');
                table.string('link');
                table.string('link_name');
                table.integer('user_id')
            });
        } catch (err) {
            console.error(err);
        }
    }
});