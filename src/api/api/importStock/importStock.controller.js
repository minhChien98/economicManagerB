/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const ImportStock = require('./importStock.model');

const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
// eslint-disable-next-line prefer-destructuring
const STATUS = require('../../utils/CONST_STATUS').STATUS;

/**
 * Load ImportStock and append to req
 */
async function load(req, res, next, id) {
  // eslint-disable-next-line no-param-reassign
  req.importStock = await ImportStock.findById(id);
  if (!req.importStock) {
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
    const importStocks = await ImportStock.listBy({
      limit,
      skip,
      sort,
      filter,
    });
    res.json(importStocks);
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
    const importStock = new ImportStock({
      // eslint-disable-next-line max-len
      name,
      createdDate: new Date(createdDate),
      money: Number(money),
      note,
    });
    return importStock
      .save()
      .then((savedImportStock) => {
        if (savedImportStock) res.json(savedImportStock);
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
    const importStock = req.importStock;
    importStock.name = name;
    importStock.createdDate = createdDate;
    importStock.money = money;
    importStock.note = note;

    return importStock
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
  const importStock = req.importStock;
  importStock.status = STATUS.DELETED;

  importStock
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
  res.json(req.importStock);
}

module.exports = {
  list,
  load,
  create,
  update,
  del,
  get,
};
