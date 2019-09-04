/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const Collaborators = require('./collaborators.model');

const APIError = require('../../utils/APIError');
const httpStatus = require('http-status');
// eslint-disable-next-line prefer-destructuring
const STATUS = require('../../utils/CONST_STATUS').STATUS;

/**
 * Load ImportStock and append to req
 */
async function load(req, res, next, id) {
  // eslint-disable-next-line no-param-reassign
  req.collaborators = await Collaborators.findById(id);
  if (!req.collaborators) {
    next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  }
  next();
}
/**
 * list Collaborators
 */
async function list(req, res, next) {
  try {
    const {
      limit = 500, skip = 0, sort = { $natural: -1 }, filter,
    } = req.query;
    const collaborators = await Collaborators.listBy({
      limit,
      skip,
      sort,
      filter,
    });
    res.json(collaborators);
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
      name, phone, address, note, amount,
    } = req.body;
    const existCode = await Collaborators.findOne({ phone });
    if (existCode !== null) {
      return next(new APIError('Đã tồn tại cộng tác viên này!', httpStatus.BAD_REQUEST, true));
    }
    const collaborators = new Collaborators({
      // eslint-disable-next-line max-len
      name,
      phone,
      address,
      note,
      amount,
    });
    return collaborators
      .save()
      .then((savedCollaborators) => {
        if (savedCollaborators) res.json(savedCollaborators);
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
      name, address, note, amount, phone,
    } = req.body;
    // eslint-disable-next-line prefer-destructuring
    const collaborators = req.collaborators;
    collaborators.name = name;
    collaborators.address = address;
    collaborators.phone = phone;
    collaborators.note = note;
    collaborators.amount = amount;

    return collaborators
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
  const collaborators = req.collaborators;
  collaborators.status = STATUS.DELETED;

  collaborators
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
  res.json(req.collaborators);
}

module.exports = {
  list,
  load,
  create,
  update,
  del,
  get,
};
