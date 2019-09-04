/**
 *
 * importStock model
 *
 */

// eslint-disable-next-line no-unused-vars
const Promise = require('bluebird');
const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const httpStatus = require('http-status');
// eslint-disable-next-line no-unused-vars
const APIError = require('../../utils/APIError');
// eslint-disable-next-line prefer-destructuring
const STATUS = require('../../utils/CONST_STATUS').STATUS;
// eslint-disable-next-line no-unused-vars

const expensesSchema = new mongoose.Schema({
  name: String,
  createdDate: Date,
  money: Number,
  note: String,
  status: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 1,
  },
});

expensesSchema.method({});

expensesSchema.statics = {
  /**
   * Get ImportStock
   * @param {ObjectId} id - The ObjectId of ImportStock
   * @returns {Promise<ImportStock, APIError}
   */
  get(id) {
    return this.findOne({
      _id: id,
    })
      .exec()
      .then((expenses) => {
        if (expenses) {
          return expenses;
        }
        const err = new APIError('No such expenses exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List ImportStock in descending order of 'createdAt' timestamps
   *
   * @param {number} skip - Number of ImportStock to be skipped.
   * @param {number} limit - Limit number of ImportStock to be returned.
   * @returns {Promise<ImportStock[]>}
   */
  async listBy({
    skip = 0,
    limit = 500,
    sort = {
      createdAt: -1,
    },
    filter = {},
  }) {
    /* eslint-disable no-param-reassign */
    filter.status = STATUS.ACTIVED;
    const data = await this.find(filter)
      .sort(sort)
      .skip(+skip)
      .limit(+limit)
      .exec();
    const count = await this.find(filter).count();
    return {
      data,
      count,
      limit,
      skip,
    };
  },
};

module.exports = mongoose.model('Expenses', expensesSchema);
