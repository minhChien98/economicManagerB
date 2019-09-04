/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const SellRecord = require('./sellRecord.model');
const moment = require('moment');

const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
// eslint-disable-next-line prefer-destructuring
const STATUS = require('../../utils/CONST_STATUS').STATUS;
const Collaborators = require('./../collaborators/collaborators.model');

/**
 * Load ImportStock and append to req
 */
async function load(req, res, next, id) {
  // eslint-disable-next-line no-param-reassign
  req.sellRecord = await SellRecord.findById(id);
  if (!req.sellRecord) {
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
    const sellRecord = await SellRecord.listBy({
      limit,
      skip,
      sort,
      filter,
    });
    res.json(sellRecord);
  } catch (e) {
    next(e);
  }
}

async function updateCollaborator(collaborator, amountChange) {
  // eslint-disable-next-line no-unused-vars
  let { amount } = collaborator;
  amount += Number(amountChange);
  // eslint-disable-next-line no-param-reassign
  collaborator.amount = amount;
  const listRecord = collaborator.buyAmountList;
  const date = moment().subtract(1, 'months'); // ngày này tháng trước
  if (listRecord.length > 0) {
    console.log(amount);
    const exist = listRecord.findIndex(inx => moment(inx.createdDate).format('MM/YYYY') === moment(date).format('MM/YYYY'));
    listRecord[exist].amount += Number(amountChange);
    // eslint-disable-next-line no-param-reassign
    collaborator.buyAmountList = listRecord;
  } else {
    listRecord.push({
      createdDate: new Date(date),
      amount: amountChange,
    });
    // eslint-disable-next-line no-param-reassign
    collaborator.buyAmountList = listRecord;
  }
  return collaborator.save();
}
/**
 * create ImportStock
 */
// eslint-disable-next-line consistent-return
async function create(req, res, next) {
  try {
    // eslint-disable-next-line max-len
    const {
      amount, createdDate, collaborator, note, sellStatus,
    } = req.body;
    console.log(req.body);
    let collaboratorSelected1;
    if (collaborator === '') {
      collaboratorSelected1 = await Collaborators.find({ phone: '0000000000' });
    }
    const sellRecord = new SellRecord({
      // eslint-disable-next-line max-len
      amount,
      createdDate: new Date(createdDate),
      collaborator:
        collaborator === ''
          ? { collaboratorId: collaboratorSelected1[0]._id, name: collaboratorSelected1[0].name }
          : collaborator,
      note,
      sellStatus: collaborator === '' ? 1 : 0,
    });
    if (Number(sellStatus) === 1) {
      const collaboratorSelected = await Collaborators.findById(collaborator.collaboratorId);
      await updateCollaborator(collaboratorSelected, amount);
    }
    return sellRecord
      .save()
      .then((savedSellRecord) => {
        if (savedSellRecord) res.json(savedSellRecord);
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
      amount, createdDate, note, sellStatus, collaborator,
    } = req.body;
    // eslint-disable-next-line prefer-destructuring
    const sellRecord = req.sellRecord;
    // sellRecord.collaborator = collaborator;
    sellRecord.sellStatus = sellStatus;
    sellRecord.note = note;
    sellRecord.amount = amount;
    sellRecord.createdDate = new Date(createdDate);

    if (Number(sellStatus) === 1) {
      const collaboratorSelected = await Collaborators.findById(collaborator.collaboratorId);
      await updateCollaborator(collaboratorSelected, amount);
    }

    if (Number(sellStatus) === 2) {
      const collaboratorSelected = await Collaborators.findById(collaborator.collaboratorId);
      await updateCollaborator(collaboratorSelected, -Number(amount));
    }

    return sellRecord
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
  const sellRecord = req.sellRecord;
  sellRecord.status = STATUS.DELETED;

  sellRecord
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
  res.json(req.sellRecord);
}

module.exports = {
  list,
  load,
  create,
  update,
  del,
  get,
};
