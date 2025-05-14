let keywordMap = new Map();

function showToast(message) {
  const toast = document.createElement('div');
  toast.id = 'ldsToast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    fontFamily: 'sans-serif',
    fontSize: '14px',
    zIndex: 100000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function extractDomains() {
  const elements = [...document.querySelectorAll('div, span')];
  const domains = elements.map(el => el.textContent.trim())
    .filter(text => text.length > 0 && !text.includes('.com') && !text.includes('.blog') && /^[A-Z][a-z]+[A-Z][a-z]+$/.test(text))
    .map(text => text.toLowerCase() + '.com');
  const unique = [...new Set(domains)].slice(0, 1000);
  navigator.clipboard.writeText(unique.join('\n'));
  showToast(`Copied ${unique.length} .com domains to clipboard`);
}

function extractKeywords() {
  const elements = [...document.querySelectorAll('div, span')];
  const keywords = elements.map(el => el.textContent.trim())
    .filter(text => text.length > 0 && !text.includes('.com') && !text.includes('.blog') && /^[A-Z][a-z]+[A-Z][a-z]+$/.test(text))
    .map(text => {
      const spaced = text.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
      keywordMap.set(spaced.replace(/\s+/g, '') + '.com', spaced);
      return spaced;
    });
  const unique = [...new Set(keywords)].slice(0, 1000);
  navigator.clipboard.writeText(unique.join('\n'));
  showToast(`Copied ${unique.length} keywords to clipboard`);
}

function extractDynadotDomains() {
  const bodyText = document.body.innerText;
  const matches = bodyText.match(/\b[a-z0-9-]+\.com\b/gi);
  const domains = [...new Set(matches)];
  if (!domains || domains.length === 0) {
    showToast('No .com domains found on page.');
    return;
  }
  document.getElementById('dynadotInput').value = domains.join('\n');
  showToast(`Extracted ${domains.length} .com domains from page.`);
}

function filterKeywords() {
  const keywordLines = document.getElementById('keywordSource').value.trim().split('\n');
  const domainSet = new Set(
    document.getElementById('dynadotInput').value.trim().split('\n').map(line => line.trim().toLowerCase())
  );

  const keywordToDomain = {};
  keywordLines.forEach(phrase => {
    const compacted = phrase.replace(/\s+/g, '').toLowerCase() + '.com';
    keywordToDomain[compacted] = phrase.trim();
  });

  const results = [];
  domainSet.forEach(domain => {
    if (keywordToDomain[domain]) {
      results.push(keywordToDomain[domain]);
    }
  });

  document.getElementById('filteredKeywords').value = results.join('\n');
}

function copyFilteredKeywords() {
  const output = document.getElementById('filteredKeywords').value;
  navigator.clipboard.writeText(output);
  showToast('Matched keywords copied to clipboard');
}

(function createOverlay(){
  if (document.getElementById('ldsOverlay')) return;

  const box = document.createElement('div');
  box.id = 'ldsOverlay';
  box.innerHTML = `
    <div id="ldsClose" onclick="document.getElementById('ldsOverlay').remove()" style="position:absolute;top:5px;right:10px;cursor:pointer;color:red;font-weight:bold;">✖</div>
    <h3>LDS Toolkit</h3>
    <button onclick="extractDomains()">📋 Extract .com Domains</button>
    <button onclick="extractKeywords()">📋 Extract Keywords</button>
    <h4>Paste Keywords from LDS (spaced)</h4>
    <textarea id="keywordSource" placeholder="Paste keyword list from LDS..."></textarea>
    <h4>Extract Filtered Domains from Dynadot Page</h4>
    <button onclick="extractDynadotDomains()">📋 Extract from Dynadot Page</button>
    <textarea id="dynadotInput" placeholder="Or paste available domains from Dynadot..."></textarea>
    <button onclick="filterKeywords()">🔍 Filter Matched Keywords</button>
    <h4>Matched Keywords</h4>
    <textarea id="filteredKeywords" readonly></textarea>
    <button onclick="copyFilteredKeywords()">📋 Copy Matched Keywords</button>
  `;
  Object.assign(box.style, {
    position: "fixed",
    top: "40px",
    right: "40px",
    background: "#fff",
    border: "2px solid #333",
    padding: "20px",
    zIndex: "99999",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    width: "400px",
    fontFamily: "sans-serif"
  });
  document.body.appendChild(box);
})();
