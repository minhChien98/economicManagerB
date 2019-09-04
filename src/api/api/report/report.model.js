/**
 *
 * SellRecord model
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

const reportchema = new mongoose.Schema({
  createdDate: Date,
  totalImportStock: Number,
  totalExpenses: Number,
  totalSell: Number,
  totalSalary: Number,
  status: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 1,
  },
});

reportchema.method({});

reportchema.statics = {
  /**
   * Get SellRecord
   * @param {ObjectId} id - The ObjectId of SellRecord
   * @returns {Promise<SellRecord>, APIError}
   */
  get(id) {
    return this.findOne({
      _id: id,
    })
      .exec()
      .then((Report) => {
        if (Report) {
          return Report;
        }
        const err = new APIError('No such Report exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List SellRecord in descending order of 'createdAt' timestamps
   *
   * @param {number} skip - Number of SellRecord to be skipped.
   * @param {number} limit - Limit number of SellRecord to be returned.
   * @returns {Promise<SellRecord[]>}
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

module.exports = mongoose.model('Report', reportchema);
