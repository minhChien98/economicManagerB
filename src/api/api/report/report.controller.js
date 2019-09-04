/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const Report = require('./report.model');

const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');

/**
 * Load ImportStock and append to req
 */
async function load(req, res, next, id) {
  // eslint-disable-next-line no-param-reassign
  req.report = await Report.findById(id);
  if (!req.report) {
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
    const report = await Report.listBy({
      limit,
      skip,
      sort,
      filter,
    });
    res.json(report);
  } catch (e) {
    next(e);
  }
}

function get(req, res) {
  res.json(req.report);
}

module.exports = {
  list,
  load,
  get,
};
