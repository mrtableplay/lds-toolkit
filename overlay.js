<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Keyword Toolkit</title>
  <style>
    #ldsOverlay {
      position: fixed;
      top: 40px;
      right: 40px;
      background: #fff;
      border: 2px solid #333;
      padding: 20px;
      z-index: 99999;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      width: 400px;
      font-family: sans-serif;
    }
    #ldsOverlay textarea {
      width: 100%;
      height: 100px;
      margin-bottom: 10px;
      font-family: monospace;
      font-size: 13px;
    }
    #ldsOverlay button {
      display: block;
      width: 100%;
      margin-bottom: 10px;
      padding: 8px 12px;
    }
    #ldsOverlay h4 {
      margin: 10px 0 5px;
    }
    #ldsToast {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #28a745;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      font-family: sans-serif;
      font-size: 14px;
      z-index: 100000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
  </style>
</head>
<body>
<div id="ldsOverlay">
  <div id="ldsClose" onclick="document.getElementById('ldsOverlay').remove()" style="position:absolute;top:5px;right:10px;cursor:pointer;color:red;font-weight:bold;">✖</div>
  <h3>Keyword Toolkit</h3>
  <button onclick="extractKeywords()">📋 Extract KW - Lean Domain Search.com</button>
  <button onclick="extractDomains()">📋 Extract .com - Dynadot Bulk Search</button>

  <h4>1. Paste Keyword from LDS</h4>
  <textarea id="keywordSource" placeholder="Paste keyword list from LDS..."></textarea>

  <h4>2. Paste Filtered Domains from Dynadot Bulk Search</h4>
  <textarea id="dynadotInput" placeholder="Paste available domains from Dynadot..."></textarea>

  <button onclick="filterKeywords()">🔍 Filter Matched Keywords</button>

  <h4>3. Use Matched Keywords in Google Keyword Planner</h4>
  <textarea id="filteredKeywords" readonly></textarea>
  <button onclick="copyFilteredKeywords()">📋 Copy Matched Keywords</button>
</div>

<script>
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
    const unique = [...new Set(domains)].slice(0, 900);
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
    const unique = [...new Set(keywords)].slice(0, 900);
    navigator.clipboard.writeText(unique.join('\n'));
    showToast(`Copied ${unique.length} keywords to clipboard`);
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

  function createOverlay() {
    const old = document.getElementById('ldsOverlay');
    if (old) old.remove();
    const script = document.currentScript;
    const container = document.createElement('div');
    container.id = 'ldsOverlay';
    container.innerHTML = document.getElementById('ldsOverlay').innerHTML;
    document.body.appendChild(container);
  }

  createOverlay();
</script>
</body>
</html>
