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

const sellRecordSchema = new mongoose.Schema({
  createdDate: Date,
  amount: Number,
  note: String,
  collaborator: {
    name: String,
    collaboratorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collaborators',
    },
  },
  sellStatus: {
    type: Number,
    enum: [0, 1, 2], // 0: vừa tạo, 1: Hoàn thành, 2: hoàn trả
    default: 0,
  },
  status: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 1,
  },
});

sellRecordSchema.method({});

sellRecordSchema.statics = {
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
      .then((SellRecord) => {
        if (SellRecord) {
          return SellRecord;
        }
        const err = new APIError('No such SellRecord exists!', httpStatus.NOT_FOUND);
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

module.exports = mongoose.model('SellRecord', sellRecordSchema);
