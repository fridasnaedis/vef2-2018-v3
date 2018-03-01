const express = require('express');

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

router.post('/', async (req, res) => { 
  const { title = '', text ='', datetime = '' } = req.body;
  const response = await create({ title, text, datetime });
  res.json(...response.rows);
});

router.get('/', async (req, res) => {
  const response = await readAll();
  res.json(response.rows);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const response = await readOne(id);
  res.json(...response.rows);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title = '', text = '', datetime = '' } = req.body;
  const response = await update(id, {title, text, datetime });
  res.json(...response.rows);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await del(id);
  res.send();
});

module.exports = router;
