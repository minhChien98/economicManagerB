// eslint-disable-next-line new-cap
const router = require('express').Router();
const collaboratorsCtrl = require('./collaborators.controller');

router
  .route('/')
  .get(collaboratorsCtrl.list)
  .post(collaboratorsCtrl.create);

router
  .route('/:importStockId')
  .get(collaboratorsCtrl.get)
  .delete(collaboratorsCtrl.del)
  .put(collaboratorsCtrl.update);
router.param('importStockId', collaboratorsCtrl.load);

module.exports = router;
