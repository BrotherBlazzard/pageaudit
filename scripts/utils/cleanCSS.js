export function cleanUpCSS(css) {
    return css.replace(/(\r\n|\n|\r)/gm, "");
}