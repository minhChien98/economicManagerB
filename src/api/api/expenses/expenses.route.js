// eslint-disable-next-line new-cap
const router = require('express').Router();
const expensesCtrl = require('./expenses.controller');

router
  .route('/')
  .get(expensesCtrl.list)
  .post(expensesCtrl.create);

router
  .route('/:expensesId')
  .get(expensesCtrl.get)
  .delete(expensesCtrl.del)
  .put(expensesCtrl.update);
router.param('expensesId', expensesCtrl.load);

module.exports = router;
