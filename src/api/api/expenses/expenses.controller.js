/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const Expenses = require('./expenses.model');

const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
// eslint-disable-next-line prefer-destructuring
const STATUS = require('../../utils/CONST_STATUS').STATUS;

/**
 * Load ImportStock and append to req
 */
async function load(req, res, next, id) {
  // eslint-disable-next-line no-param-reassign
  req.expenses = await Expenses.findById(id);
  if (!req.expenses) {
    next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  }
  next();
}
/**
 * list ImportStock
 */
async function list(req, res, next) {
  try {
    const {
      limit = 500, skip = 0, sort = { $natural: -1 }, filter,
    } = req.query;
    const expenses = await Expenses.listBy({
      limit,
      skip,
      sort,
      filter,
    });
    res.json(expenses);
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
      name, createdDate, money, note,
    } = req.body;
    const expenses = new Expenses({
      // eslint-disable-next-line max-len
      name,
      createdDate: new Date(createdDate),
      money: Number(money),
      note,
    });
    return expenses
      .save()
      .then((expensesSave) => {
        if (expensesSave) res.json(expensesSave);
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
      name, createdDate, money, note,
    } = req.body;

    // eslint-disable-next-line prefer-destructuring
    const expenses = req.expenses;
    expenses.name = name;
    expenses.createdDate = createdDate;
    expenses.money = money;
    expenses.note = note;

    return expenses
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
 * @returns ImportStock
 */
function del(req, res, next) {
  const expenses = req.expenses;
  expenses.status = STATUS.DELETED;

  expenses
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
  res.json(req.expenses);
}

module.exports = {
  list,
  load,
  create,
  update,
  del,
  get,
};
