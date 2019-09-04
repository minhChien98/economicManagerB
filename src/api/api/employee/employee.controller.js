/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */

const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
// eslint-disable-next-line prefer-destructuring
const STATUS = require('../../utils/CONST_STATUS').STATUS;
const Employee = require('../employee/employee.model');

/**
 * Load ImportStock and append to req
 */
async function load(req, res, next, id) {
  // eslint-disable-next-line no-param-reassign
  req.employee = await Employee.findById(id);
  if (!req.employee) {
    next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  }
  next();
}
/**
 * list sellRecord
 */
async function list(req, res, next) {
  try {
    const {
      limit = 500, skip = 0, sort = { $natural: -1 }, filter,
    } = req.query;
    const employee = await Employee.listBy({
      limit,
      skip,
      sort,
      filter,
    });
    res.json(employee);
  } catch (e) {
    next(e);
  }
}

/**
 * create ImportStock
 */
// eslint-disable-next-line consistent-return
async function create(req, res, next) {
  try {
    // eslint-disable-next-line max-len
    const {
      type, name, phone, moneyPerMonth, moneyPerHour,
    } = req.body;
    const employee = new Employee({
      // eslint-disable-next-line max-len
      type,
      name,
      phone,
      moneyPerMonth,
      moneyPerHour,
    });
    return employee
      .save()
      .then((savedEmployee) => {
        if (savedEmployee) res.json(savedEmployee);
        else res.transforemer.errorBadRequest('Can not create item');
      })
      .catch((e) => {
        next(e);
      });
  } catch (e) {
    // console.log(e);
    next(e);
  }
}
/**
 * update ImportStock
 */
// eslint-disable-next-line consistent-return
async function update(req, res, next) {
  try {
    const {
      type, name, phone, moneyPerMonth, moneyPerHour,
    } = req.body;
    // eslint-disable-next-line prefer-destructuring
    const employee = req.employee;
    employee.type = type;
    employee.name = name;
    employee.phone = phone;
    employee.moneyPerMonth = moneyPerMonth;
    employee.moneyPerHour = moneyPerHour;

    return employee
      .save()
      .then(async (result) => {
        res.json(result);
      })
      .catch((err) => {
        next(err);
      });
  } catch (e) {
    next(e);
  }
}

/**
 * Delete costEstimate.
 * @returns collaborators
 */
function del(req, res, next) {
  const employee = req.employee;
  employee.status = STATUS.DELETED;

  employee
    .save()
    .then((result) => {
      res.json({
        success: true,
        data: result,
      });
    })
    .catch(e => next(e));
}

function get(req, res) {
  res.json(req.employee);
}

module.exports = {
  list,
  load,
  create,
  update,
  del,
  get,
};
