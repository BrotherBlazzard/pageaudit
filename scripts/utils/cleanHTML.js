export function cleanUpHTML(html) {
    html = html.replace(/[\n\r]/g, ""); // remove line breaks
    html = html.replace(/ {2,}/g, " "); // remove extra spaces
    html = html.replace(/<!--.*?-->/g, ""); // remove comments
    return html;
}