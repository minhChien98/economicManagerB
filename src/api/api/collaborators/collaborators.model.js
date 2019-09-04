/**
 *
 * Collaborators model
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

const collaboratorsSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  amount: {
    type: Number,
    default: 0,
  },
  note: String,
  buyAmountList: [
    {
      createdDate: Date,
      amount: Number,
    },
  ],
  status: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 1,
  },
});

collaboratorsSchema.method({});

collaboratorsSchema.statics = {
  /**
   * Get Collaborators
   * @param {ObjectId} id - The ObjectId of Collaborators
   * @returns {Promise<Collaborators>, APIError}
   */
  get(id) {
    return this.findOne({
      _id: id,
    })
      .exec()
      .then((Collaborators) => {
        if (Collaborators) {
          return Collaborators;
        }
        const err = new APIError('No such Collaborators exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List Collaborators in descending order of 'createdAt' timestamps
   *
   * @param {number} skip - Number of Collaborators to be skipped.
   * @param {number} limit - Limit number of Collaborators to be returned.
   * @returns {Promise<Collaborators[]>}
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

module.exports = mongoose.model('Collaborators', collaboratorsSchema);
