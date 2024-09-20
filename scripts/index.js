import { getReportButtonHandler } from './eventHandlers.js';

// #region Set HTML Elements ******************************************
const student = document.querySelector('#student');
const getReportButton = document.querySelector('#getReport');
const report = document.querySelector('#report');
const message = document.querySelector('#message');
const warning = document.querySelector('#warning');
// #endregion Set HTML Elements ***************************************

getReportButtonHandler(student);