// eslint-disable-next-line new-cap
const router = require('express').Router();
const importStockCtrl = require('./importStock.controller');

router
  .route('/')
  .get(importStockCtrl.list)
  .post(importStockCtrl.create);

router
  .route('/:importStockId')
  .get(importStockCtrl.get)
  .delete(importStockCtrl.del)
  .put(importStockCtrl.update);
router.param('importStockId', importStockCtrl.load);

module.exports = router;
