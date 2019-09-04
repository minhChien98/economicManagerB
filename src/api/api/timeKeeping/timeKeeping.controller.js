/* eslint-disable eqeqeq */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */

const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
// eslint-disable-next-line prefer-destructuring
const STATUS = require('../../utils/CONST_STATUS').STATUS;
const TimeKeeping = require('./timeKeeping.model');

/**
 * Load ImportStock and append to req
 */
async function load(req, res, next, id) {
  // eslint-disable-next-line no-param-reassign
  req.timeKeeping = await TimeKeeping.findById(id);
  if (!req.timeKeeping) {
    return next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  }
  next();
}
/**
 * list sellRecord
 */
async function list(req, res, next) {
  try {
    const {
      limit = 500, skip = 0, sort, filter,
    } = req.query;
    const timeKeeping = await TimeKeeping.listBy({
      limit,
      skip,
      sort,
      filter,
    });
    res.json(timeKeeping);
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
    const { createdDate, record } = req.body;
    let timeKeeping;
    const existCode = await TimeKeeping.findOne({ createdDate });
    if (existCode) {
      const listRecord = existCode.list;
      const existEmployee = listRecord.findIndex(n => n.employeeId == record.employeeId);
      if (existEmployee > -1) {
        return next(new APIError('Đã chấm công cho nhân viên này rồi!', httpStatus.BAD_REQUEST, true));
      }
      listRecord.push(record);
      existCode.list = listRecord;
      existCode
        .save()
        .then((timeKeepingSave) => {
          if (timeKeepingSave) res.json(timeKeepingSave);
          else res.transforemer.errorBadRequest('Can not create item');
        })
        .catch((e) => {
          next(e);
        });
    } else {
      const listRecord = [];
      listRecord.push(record);
      timeKeeping = new TimeKeeping({
        // eslint-disable-next-line max-len
        createdDate: new Date(createdDate),
        list: listRecord,
      });
      return timeKeeping
        .save()
        .then((timeKeepingSave) => {
          if (timeKeepingSave) res.json(timeKeepingSave);
          else res.transforemer.errorBadRequest('Can not create item');
        })
        .catch((e) => {
          next(e);
        });
    }
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
    const { createdDate, record } = req.body;
    // eslint-disable-next-line prefer-destructuring
    const timeKeeping = req.timeKeeping;
    timeKeeping.createdDate = new Date(createdDate);
    const listRecord = timeKeeping.list;
    const item = listRecord.findIndex(n => n.employeeId == record.employeeId);
    if (item === -1) {
      return next(new APIError('Nhân viên chưa được chấm công!', httpStatus.BAD_REQUEST, true));
    }
    listRecord[item].amount = record.amount;
    timeKeeping.list = listRecord;
    return timeKeeping
      .save()
      .then((result) => {
        if (result) res.json(result);
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
  const timeKeeping = req.timeKeeping;
  timeKeeping.status = STATUS.DELETED;

  timeKeeping
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
  res.json(req.timeKeeping);
}

module.exports = {
  list,
  load,
  create,
  update,
  del,
  get,
};
