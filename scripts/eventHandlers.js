import { getReport } from './report.js';
export function getReportButtonHandler(student) {
    const getReportButton = document.querySelector('#getReport');
    getReportButton.addEventListener('click', getReport(student.value));

    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            getReport(student.value);
        }
    });
}