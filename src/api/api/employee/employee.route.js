// eslint-disable-next-line new-cap
const router = require('express').Router();
const employeeCtrl = require('./employee.controller');

router
  .route('/')
  .get(employeeCtrl.list)
  .post(employeeCtrl.create);

router
  .route('/:employeeId')
  .get(employeeCtrl.get)
  .delete(employeeCtrl.del)
  .put(employeeCtrl.update);
router.param('employeeId', employeeCtrl.load);

module.exports = router;
