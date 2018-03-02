/* todo sækja pakka sem vantar  */
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/v3';

async function queryDB(query, values = []) {
  const client = new Client({ connectionString });
  await client.connect();
  let result;
  try {
    result = await client.query(query, values);
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
  return result;
}

/**
 * Create a note asynchronously.
 *
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function create({ title, text, datetime } = {}) {
  const query = 'INSERT INTO notes(datetime, title, text) VALUES($1, $2, $3) RETURNING *;';
  const values = [datetime, title, text];
  const result = await queryDB(query, values);
  return result;
  /* todo útfæra */
}

/**
 * Read all notes.
 *
 * @returns {Promise} Promise representing an array of all note objects
 */
async function readAll() {
  const query = 'SELECT * FROM notes;';
  const result = await queryDB(query);
  return result;
  /* todo útfæra */
}

/**
 * Read a single note.
 *
 * @param {number} id - Id of note
 *
 * @returns {Promise} Promise representing the note object or null if not found
 */
async function readOne(id) {
  const query = 'SELECT * FROM notes WHERE id = $1;';
  const values = [id];
  const result = queryDB(query, values);
  return result;
}

/**
 * Update a note asynchronously.
 *
 * @param {number} id - Id of note to update
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function update(id, { title, text, datetime } = {}) {
  const query = 'UPDATE notes SET datetime = $2, title =  $3, text = $4 WHERE id = $1 RETURNING *;';
  const values = [id, datetime, title, text];
  const result = await queryDB(query, values);
  return result;
}

/**
 * Delete a note asynchronously.
 *
 * @param {number} id - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the note
 */
async function del(id) {
  const query = 'DELETE FROM notes WHERE id = $1;';
  const values = [id];
  const { rowCount } = queryDB(query, values);
  return rowCount === 1;
}

module.exports = {
  create,
  readAll,
  readOne,
  update,
  del,
};
