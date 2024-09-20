export async function validateHTML(html) {
    let url = `https://validator.w3.org/nu/?out=json`;
    let htmlErrorCount = 0;
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/html'
        },
        body: html
    });
    if (response.status !== 200 || !response.ok) {
        throw new Error(`Validation failed with status code ${response.status}`);
    }
    let hResult = await response.json();

    htmlErrorCount = hResult.messages.reduce((count, message) => {
        return message.type === 'error' ? count + 1 : count;
    }, 0);

    return htmlErrorCount;
}

export async function validateCSS(uri) {
    let url = `https://jigsaw.w3.org/css-validator/validator?uri=${uri}&profile=css3svg&usermedium=all&output=json`;
    let cssErrorCount = 0;
    let response = await fetch(url);
    if (response.status !== 200 || !response.ok) {
        throw new Error(`Validation failed with status code ${response.status}`);
    }
    let cResult = await response.json();
    cssErrorCount = cResult.cssvalidation.result.errorcount;

    return cssErrorCount;
}