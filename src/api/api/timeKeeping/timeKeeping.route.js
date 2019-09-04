// eslint-disable-next-line new-cap
const router = require('express').Router();
const timeKeepingCtrl = require('./timeKeeping.controller');

router
  .route('/')
  .get(timeKeepingCtrl.list)
  .post(timeKeepingCtrl.create);

router
  .route('/:timeKeepingId')
  .get(timeKeepingCtrl.get)
  .delete(timeKeepingCtrl.del)
  .put(timeKeepingCtrl.update);
router.param('timeKeepingId', timeKeepingCtrl.load);

module.exports = router;
