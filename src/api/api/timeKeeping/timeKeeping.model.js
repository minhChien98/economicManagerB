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

const timeKeepingSchema = new mongoose.Schema({
  createdDate: Date,
  list: [
    {
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
      },
      amount: Number,
      name: String,
    },
  ], // Danh sách chấm công
  status: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 1,
  },
});

timeKeepingSchema.method({});

timeKeepingSchema.statics = {
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
      .then((TimeKeeping) => {
        if (TimeKeeping) {
          return TimeKeeping;
        }
        const err = new APIError('No such TimeKeeping exists!', httpStatus.NOT_FOUND);
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

module.exports = mongoose.model('TimeKeeping', timeKeepingSchema);
