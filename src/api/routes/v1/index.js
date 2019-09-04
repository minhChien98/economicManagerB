const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const importStockRoutes = require('../../api/importStock/importStock.route');
const collaboratorsRoutes = require('../../api/collaborators/collaborators.route');
const sellRecordRoutes = require('../../api/sellRecord/sellRecord.route');
const employeeRoutes = require('../../api/employee/employee.route');
const timeKeepingRoutes = require('../../api/timeKeeping/timeKeeping.route');
const expensesRoutes = require('../../api/expenses/expenses.route');
const reportRoutes = require('../../api/report/report.route.js');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

router.use('/importStock', importStockRoutes);
router.use('/collaborators', collaboratorsRoutes);
router.use('/sellRecord', sellRecordRoutes);
router.use('/employee', employeeRoutes);
router.use('/timeKeeping', timeKeepingRoutes);
router.use('/expenses', expensesRoutes);
router.use('/report', reportRoutes);

module.exports = router;
