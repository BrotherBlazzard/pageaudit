import { validateHTML } from './utils/htmlValidation.js';
import { validateCSS } from './utils/cssValidation.js';
import { cleanUpHTML } from './utils/cleanHTML.js';
import { cleanUpCSS } from './utils/cleanCSS.js';

export function buildReport(data, url) {
    let h = cleanUpHTML(data.css.html);
    let c = cleanUpCSS(data.css.css);

    let csslinks = '';
    data.css.links.forEach(css => {
        csslinks += `${css.link}<br>`
    });

    validateHTML(h)
        .then((htmlErrorCount) => {
            document.getElementById('hvalid').innerHTML = (htmlErrorCount === 0) ? '✅' : '❌';
            document.getElementById('htmlerrorscount').innerHTML = `Errors: ${htmlErrorCount}`;
        })
        .catch((error) => {
            document.getElementById('htmlerrorscount').innerHTML = `HTML Validation failed to report: ${error}`;
        });

    validateCSS(url)
        .then((cssErrorCount) => {
            document.getElementById('cvalid').innerHTML = (cssErrorCount === 0) ? '✅' : '❌';
            document.getElementById('csserrorscount').innerHTML = `Errors: ${cssErrorCount}`;
        })
        .catch((error) => {
            document.getElementById('csserrorscount').innerHTML = `CSS Validation failed to report: ${error}`;
        });

    return `<main>
        <h3>w3.org Validation Tools</h3>
        <div class="label">HTML</div>
        <div class="data" id="hvalid"></div>
        <div class="standard"> <span id="htmlerrorscount"></span> <a href="https://validator.w3.org/check?verbose=1&uri=${url}" target="_blank" rel="noopener">🔗HTML Validation Link</a>
        </div>
  
        <div class="label">CSS</div>
        <div class="data" id="cvalid"></div>
        <div class="standard"><span id="csserrorscount"></span> <a href="https://jigsaw.w3.org/css-validator/validator?uri=${url}" target="_blank" rel="noopener">🔗CSS Validation Link</a>
        </div>
  
      <h3>HTML Document</h3>
  
        <div class="label">Document Type:</div>
        <div class="data">${h.toLowerCase().includes('<!doctype html>') && h.toLowerCase().indexOf('<!doctype html>') === 0 ? '✅' : '❌'}</div>
        <div class="standard"><span class="blue">&lt;!DOCTYPE html&gt; or &lt;!doctype html&gt; should be on the first line of the document.</span></div>
  
        <div class="label">HTML Lang Attribute:</div>
        <div class="data">${h.includes('<html lang="') > 0 ? '✅' : '❌'}</div>
        <div class="standard"><span class="blue">&lt;html lang="en-US"&gt; or another language can be OK</span></div>
  
        <div class="label">&lt;head&gt; element</div>
        <div class="data">${h.includes('<head>') && h.includes('</head>') && h.indexOf('</head>') < h.indexOf('<body') && h.indexOf('<head>') > h.indexOf('<html') && h.indexOf('</head>') < h.indexOf('</html') ? '✅' : '❌'}</div>
        <div class="standard"><span class="blue">&lt;head&gt; ... &lt;/head&gt; before the body and within the html</span></div>
  
        <div class="label">&lt;body&gt; element</div>
        <div class="data">${h.includes('<body') && h.includes('</body>') && h.indexOf('</body>') < h.indexOf('</html>') && h.indexOf('</body>') < h.indexOf('</html>') ? '✅' : '❌'}</div>
        <div class="standard"><span class="blue">&lt;body&gt; ... &lt;/body&gt; after the head and within the html</span></div>
  
        <div class="label">lowercase HTML used</div>
        <div class="data">${checkCapitalizedTags(h) ? '❌' : '✅'}</div>
        <div class="standard"><span class="blue">It is considered to be a best practice to use lowercase for HTML element names and attributes.</span></div>
  
      <h3>&lt;head&gt; Elements</h3>
  
        <div class="label">Meta Charset:</div>
        <div class="data">${h.toLowerCase().includes('<meta charset="utf-8">') ? '✅' : '❌'}</div>
        <div class="standard"><span class="blue">&lt;meta charset="UTF-8"&gt;</span></div>
  
        <div class="label">Meta Viewport:</div>
        <div class="data">${h.includes('<meta name="viewport"') ? '✅' : '❌'}</div>
        <div class="standard"><span class="blue">&lt;meta name="viewport" content="width=device-width,initial-scale=1.0"&gt;</span></div>
  
        <div class="label">Title:</div>
        <div class="data">${data.css.pageTitle.length > 7 ? '👀' : '❌'}</div>
        <div class="standard">&#10077;${data.css.pageTitle}&#10078;<span class="blue">Is this title specific to the this page and learning activity? e.g., includes the words "Temple" and "Album" or something similar.</span></div>
  
        <div class="label">Meta Description:</div>
        <div class="data">${h.includes('<meta name="description" content="') ? '👀' : '❌'}</div>
        <div class="standard">${getContent(h, /<meta\s+name="description"\s+content="([^"]+)"/i)} <span class="blue">Is this meta description sufficient and relevant to the content of this page?</span></div>
  
        <div class="label">Meta Author:</div>
        <div class="data">${h.includes('name="author"') ? "👀" : "❌"}</div>
        <div class="standard">${getContent(h, /<meta\s+name="author"\s+content="([^"]+)"/i)}
        <span class="blue">Student name?</span></div>
  
        <h3>&lt;body&gt; Elements</h3>
  
        <div class="label">&lt;header&gt;</div>
        <div class="data">${h.includes('<header') && h.includes('</header>') && h.indexOf('<header') > h.indexOf('<body') && h.indexOf('</header>') < h.indexOf('<main') ? '✅' : '❌'}</div>
        <div class="standard"><span class="blue">The &lt;header&gt; ... &lt;/header&gt; must be within the &lt;body&gt; and contained before the &lt;main&gt; element</span></div>
  
        <div class="label">&lt;h1&gt;</div>
        <div class="data">${h.includes('<h1') && h.includes('</h1>') && h.indexOf('</h1>') < h.indexOf('</header>') && getContent(h, /<h1.*>(.*?)<\/h1>/).toLowerCase().includes('temple') ? '✅' : '❌'}</div>
        <div class="standard">${getContent(h, /<h1.*>(.*?)<\/h1>/)} <span class="blue">The h1 should at least contain the word "Temple"</span></div>
  
        <div class="label">&lt;nav&gt;</div>
        <div class="data">${h.includes('<nav') && h.includes('</nav>') && h.indexOf('<nav') > h.indexOf('<header') && h.indexOf('</nav>') < h.indexOf('</header>') ? '✅' : '❌'}</div>
        <div class="standard"><span class="blue">&lt;nav&gt; ... &lt;/nav&gt; is within the &lt;header element</span></div>
  
        <div class="label">&lt;a&gt;</div>
        <div class="data">${getElement(h, '</a>') >= 5 ? '✅' : '❌'}</div>
        <div class="standard"><span class="blue">Found ${getElement(h, '</a>')} / out of 5 min. that are required</span></div>
  
        <div class="label">&lt;main&gt;</div>
        <div class="data">${h.includes('<main') && h.includes('</main>') && h.indexOf('<main') > h.indexOf('</header>') && h.indexOf('</main>') < h.indexOf('<footer') ? '✅' : '❌'}</div>
        <div class="standard"><span class="blue">After the &lt;/header&gt; and before the &lt;footer&gt;</span> </div>
  
        <div class="label">&lt;h2&gt;</div>
        <div class="data">${h.includes('<h2') && h.includes('</h2>') && getElement(h, '</h2>') === 1 && h.indexOf('<h2') > h.indexOf('<main') && h.indexOf('</h2>') < h.indexOf('</main>') ? '✅' : '❌'}</div>
        <div class="standard">${getElement(h, '<h2')} / out of 1 found. <span class="blue">Within the main element</span> </div>
  
        <div class="label">&lt;footer&gt;</div>
        <div class="data">${h.includes('<footer') && h.includes('</footer>') && h.indexOf('<footer') > h.indexOf('</main>') && h.indexOf('</footer>') < h.indexOf('</body>') ? '✅' : '❌'}</div>
        <div class="standard">${getContent(h, /<footer.*>(.*?)<\/footer>/)} </div>
  
  
  <h3>CSS</h3>
  
        <div class="label">CSS Files</div>
        <div class="data">${h.includes('href="styles/') ? "✅" : "❌"}</div>
        <div class="standard">${csslinks} <span class="blue">CSS files are located in styles directory.</span></div>
  
        <div class="label">No Embedded/Inline</div>
        <div class="data">${h.includes("<style>") || h.includes("</style>") || h.includes("style=") ? "❌" : "✅"}</div>
        <div class="standard"><span class="blue">Embedded (&lt;style&gt;) or inline styles (style=") are not permitted</span></div>
  
        <div class="label">CSS Flex</div>
        <div class="data">${c.includes("display: flex") || c.includes("display:flex") ? "✅" : "❌"}</div>
        <div class="standard"><span class="blue">CSS Flex declaration is used</span></div>
  
        <div class="label">:hover</div>
        <div class="data">${c.includes("a:hover") ? "✅" : "❌"}</div>
        <div class="standard"><span class="blue">:hover pseudo-class is used on nav anchor tags</span></div>
  
        <h3>JavaScript</h3>
        <div class="label">JS File</div>
        <div class="data">${h.includes('src="scripts/') ? "✅" : "❌"}</div>
        <div class="standard"><span class="blue">JavaScript external files are located in the scripts directory</span></div>
  
        <div class="label">Defer JS Script</div>
        <div class="data">${h.includes(' defer') ? "✅" : "❌"}</div>
        <div class="standard"><span class="blue">defer attribute found in script reference(s)</span></div>
  
      </main>`;
}
