const config = require('../../../config/config');
const CryptoJS = require('crypto-js');
const bcrypt = require('bcrypt');

const toLowerCaseString = (text = '') => (text || '').trim().toLowerCase();

const compareStrings = (currentValue, nextValue, desc = false) => {
  let comparison = 0;
  const currVal = toLowerCaseString(currentValue);
  const nextVal = toLowerCaseString(nextValue);
  if (currVal > nextVal) {
    comparison = 1;
  } else if (nextVal > currVal) {
    comparison = -1;
  }
  return comparison * (desc ? -1 : 1);
};

const getLastDigitString = (text = '', num = 4) => (
  (text || '').trim().substring(text.length - num)
);

const encryptString = (text) => CryptoJS.AES.encrypt(text, config.hashSecretKey).toString();

const decryptString = (text) => {
  const bytes = CryptoJS.AES.decrypt(text, config.hashSecretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const stringIsExistsInArray = (list = [], string = '') => {
  let isExisted = false;
  for(let item of list) {
    if((item || '').toLowerCase().indexOf(string) > -1) {
      isExisted = true;
      break;
    }
  }
  return isExisted;
};

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

module.exports = {
  toLowerCaseString,
  compareStrings,
  getLastDigitString,
  encryptString,
  decryptString,
  stringIsExistsInArray,
  hashPassword,
  comparePassword,
};
