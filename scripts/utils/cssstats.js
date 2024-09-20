export async function cssstats(baseuri) {
    const url = `https://cssstats.com/api/stats?url=${baseuri}`;
    const response = await fetch(url);
    const cssresult = await response.json();
    return cssresult;
  }