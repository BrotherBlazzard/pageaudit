import { checkURL } from './utils/network.js';
import { cssstats } from './utils/cssstats.js';
import { buildReport } from './reportBuilder.js';
import { resetReport } from './reportActions.js';

export async function getReport(studentgh) {
  resetReport();
  if (studentgh === "") {
    document.querySelector('#student').focus();
    return;
  } else {
    const uri = `${studentgh}.github.io/wdd131/filtered-temples.html`;
    const url = `https://${uri}`;
    const rescheck = await checkURL(url);
    if (rescheck) {
      const cssStats = await cssstats(uri);
      const reportElement = document.querySelector('#report');
      reportElement.innerHTML += buildReport(cssStats, uri);
      getTotalErrorCount();
    } else {
      document.querySelector('#message').style.display = "block";
      return;
    }
  }
}