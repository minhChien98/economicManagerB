// eslint-disable-next-line new-cap
const router = require('express').Router();
const importStockCtrl = require('./report.controller');

router.route('/').get(importStockCtrl.list);

router.route('/:importStockId').get(importStockCtrl.get);
router.param('importStockId', importStockCtrl.load);

module.exports = router;
