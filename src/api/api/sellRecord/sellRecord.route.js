// eslint-disable-next-line new-cap
const router = require('express').Router();
const sellRecordCtrl = require('./sellRecord.controller');

router
  .route('/')
  .get(sellRecordCtrl.list)
  .post(sellRecordCtrl.create);

router
  .route('/:sellRecordId')
  .get(sellRecordCtrl.get)
  .delete(sellRecordCtrl.del)
  .put(sellRecordCtrl.update);
router.param('sellRecordId', sellRecordCtrl.load);

module.exports = router;
