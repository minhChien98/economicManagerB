// eslint-disable-next-line prefer-destructuring
const moment = require('moment');
const Employee = require('./../api/api/employee/employee.model');
const Timekeeping = require('./../api/api/timeKeeping/timeKeeping.model');
const ImportStock = require('./../api/api/importStock/importStock.model');
const Expenses = require('./../api/api/expenses/expenses.model');
const SellRecord = require('./../api/api/sellRecord/sellRecord.model');
const Report = require('./../api/api/report/report.model');

// func report
async function reportSalary() {
  const listEmployee = await Employee.find({});
  const date = moment().subtract(1, 'months'); // ngày này tháng trước
  const startDay = moment(date)
    .startOf('month')
    .toDate();
  const endDay = moment(date)
    .endOf('month')
    .toDate();
  const listTimeKeeping = await Timekeeping.find({
    createdDate: {
      $gte: startDay,
      $lt: endDay,
    },
  });
  await Promise.all(listEmployee.map(async (employ) => {
    if (employ.type === 1) {
      let total = 0;
      listTimeKeeping.forEach((time) => {
        const { list } = time;
        const record = list.find(n => String(n.employeeId) === String(employ._id));
        if (record) {
          total += Number(record.amount) * Number(employ.moneyPerHour);
        }
      });
      const log = {
        month: new Date(date),
        amount: total,
      };
        // eslint-disable-next-line no-param-reassign
      if (employ.salary.length > 0) {
        const exist = employ.salary.findIndex(i => moment(i.month).format('MM/YYYY') === moment(date).format('MM/YYYY'));
        if (exist === -1) {
          employ.salary.push(log);
        } else if (log.amount !== employ.salary[exist].amount) {
          employ.salary.splice(exist, 1, log);
        }
      } else {
        employ.salary.push(log);
      }
      employ.save();
    }
  }));
}

async function reportExpenses() {
  const date = moment().subtract(1, 'months'); // ngày này tháng trước
  const startDay = moment(date)
    .startOf('month')
    .toDate();
  const endDay = moment(date)
    .endOf('month')
    .toDate();
  const listImportStock = await ImportStock.find({
    createdDate: {
      $gte: startDay,
      $lt: endDay,
    },
  });
  const listExpenses = await Expenses.find({
    createdDate: {
      $gte: startDay,
      $lt: endDay,
    },
  });
  const listSellRecord = await SellRecord.find({
    createdDate: {
      $gte: startDay,
      $lt: endDay,
    },
    sellStatus: 1,
    status: 1,
  });
  const listEmployee = await Employee.find({});

  let totalImportStock = 0;
  let totalExpenses = 0;
  let totalSell = 0;
  let totalSalary = 0;

  await Promise.all(listImportStock.map(async (importStock) => {
    totalImportStock += Number(importStock.money);
  }));

  await Promise.all(listExpenses.map(async (expenses) => {
    totalExpenses += Number(expenses.money);
  }));

  await Promise.all(listExpenses.map(async (expenses) => {
    totalExpenses += Number(expenses.money);
  }));

  await Promise.all(listSellRecord.map(async (record) => {
    totalSell += Number(record.amount);
  }));

  await Promise.all(listEmployee.map(async (employ) => {
    if (employ.type === 1 && employ.salary.length > 0) {
      const item = employ.salary.find(i => moment(i.month).format('MM/YYYY') === moment(date).format('MM/YYYY'));
      if (item) {
        totalSalary += Number(item.amount);
      }
    }
    if (employ.type === 0) {
      totalSalary += Number(employ.moneyPerMonth);
    }
  }));

  const listRecord = await Report.find({
    createdDate: {
      $gte: startDay,
      $lt: endDay,
    },
  });
  if (listRecord) {
    const itemExsit = listRecord.findIndex(inx => moment(inx.createdDate).format('MM/YYYY') === moment(date).format('MM/YYYY'));
    if (itemExsit === -1) {
      const report = new Report({
        createdDate: new Date(date),
        totalImportStock,
        totalExpenses,
        totalSell,
        totalSalary,
      });

      report.save();
    }
  }
}

module.exports = {
  reportSalary,
  reportExpenses,
};
