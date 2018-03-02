const express = require('express');
const xss = require('xss');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const {
  create,
  readAll,
  readOne,
  update,
  del,
} = require('./notes');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

const valueValidation = [
  check('title')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be of length 1 to 255 characters'),

  check('title')
    .custom(title => typeof title === 'string')
    .withMessage('Title must be a strings'),

  check('text')
    .custom(title => typeof title === 'string')
    .withMessage('Text must be a string'),

  check('datetime')
    .isISO8601()
    .withMessage('Datetime must be ISO 8601 date'),

  sanitize('title').trim(),

  sanitize('text').trim(),

];

router.post('/', valueValidation, catchErrors(async (req, res) => {
  const { title = '', text = '', datetime = '' } = req.body;
  const values = {
    title: xss(title),
    text: xss(text),
    datetime: xss(datetime),
  };
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const errors = validation.array().map(err => err.msg);
    res.json(errors);
    return;
  }
  const response = await create(values);

  res.status(201).json(...response.rows);
}));

router.get('/', catchErrors(async (req, res) => {
  const response = await readAll();
  if (response.rows.length > 0) {
    res.json(response.rows);
    return;
  }
  res.status(404).json({ error: 'No notes found' });
}));

router.get('/:id', catchErrors(async (req, res) => {
  const { id } = req.params;
  const response = await readOne(id);
  if (response.rows.length > 0) {
    res.json(...response.rows);
    return;
  }
  res.status(404).json({ error: 'No note found' });
}));

router.put('/:id', valueValidation, catchErrors(async (req, res) => {
  const { id } = req.params;
  const { title = '', text = '', datetime = '' } = req.body;
  const values = {
    title: xss(title),
    text: xss(text),
    datetime: xss(datetime),
  };

  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const errors = validation.array().map(err => err.msg);
    res.json(errors);
    return;
  }

  const response = await update(id, values);
  if (response.rows.length > 0) {
    res.json(...response.rows);
    return;
  }
  res.status(404).json({ error: 'Note not found' });
}));

router.delete('/:id', catchErrors(async (req, res) => {
  const { id } = req.params;
  const response = await del(id);
  if (response) {
    res.send();
    return;
  }
  res.status(404).json({ error: 'Note not found' });
}));

module.exports = router;
