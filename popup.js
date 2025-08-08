// Global variables to store API keys
let apiKey = null;
let cx = null;
let geminiKey = null;

// Check if API keys are already stored
function checkStoredKeys() {
  chrome.storage.sync.get(['googleApiKey', 'googleCx', 'geminiApiKey'], (result) => {
    if (result.googleApiKey && result.googleCx && result.geminiApiKey) {
      // Keys are stored, show fact checking interface
      apiKey = result.googleApiKey;
      cx = result.googleCx;
      geminiKey = result.geminiApiKey;
      showFactCheckInterface();
    } else {
      // Keys not stored, show setup interface
      showSetupInterface();
    }
  });
}

// Show the setup interface
function showSetupInterface() {
  document.getElementById('setupSection').style.display = 'block';
  document.getElementById('factCheckSection').style.display = 'none';
}

// Show the fact checking interface
function showFactCheckInterface() {
  document.getElementById('setupSection').style.display = 'none';
  document.getElementById('factCheckSection').style.display = 'block';
}

// Save API keys to chrome storage
document.getElementById("saveKeysBtn").addEventListener("click", async () => {
  const googleApiKey = document.getElementById("googleApiKey").value.trim();
  const googleCx = document.getElementById("googleCx").value.trim();
  const geminiApiKey = document.getElementById("geminiApiKey").value.trim();
  const setupMessage = document.getElementById("setupMessage");

  if (!googleApiKey || !googleCx || !geminiApiKey) {
    setupMessage.innerHTML = '<span style="color: red;">Please fill in all API keys.</span>';
    return;
  }

  // Store the keys
  chrome.storage.sync.set({
    googleApiKey: googleApiKey,
    googleCx: googleCx,
    geminiApiKey: geminiApiKey
  }, () => {
    // Update global variables
    apiKey = googleApiKey;
    cx = googleCx;
    geminiKey = geminiApiKey;
    
    setupMessage.innerHTML = '<span style="color: green;">Keys saved successfully! Loading fact checker...</span>';
    
    // Switch to fact checking interface after a short delay
    setTimeout(() => {
      showFactCheckInterface();
    }, 1000);
  });
});

// Fact checking functionality
document.getElementById("checkBtn").addEventListener("click", async () => {
  const query = document.getElementById("inputText").value.trim();
  const resultEl = document.getElementById("result");

  if (!query) {
    resultEl.textContent = "Please enter some text.";
    return;
  }

  // Check if API keys are available
  if (!apiKey || !cx || !geminiKey) {
    resultEl.textContent = "API keys not configured. Please set up your API keys first.";
    showSetupInterface();
    return;
  }

  resultEl.innerHTML = "🔎 Searching...";

  try {
    // Step 1: Get search results
    const searchRes = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`);
    const data = await searchRes.json();

    if (!data.items || data.items.length === 0) {
      resultEl.textContent = "No sources found.";
      return;
    }

    // Step 2: Build evidence snippets
    const evidence = data.items.slice(0, 5).map((item, i) =>
      `${i + 1}. Title: ${item.title}\nSnippet: ${item.snippet}`
    ).join("\n\n");

    // Step 3: Build Gemini prompt
    const prompt = `
You are a fact-checking assistant.

The user submitted the following claim:

"${query}"

Here are search result snippets from reliable sources:
${evidence}

Based on the above, is the claim likely:
- True
- False
- Disputed or Unclear?

Reply with a short explanation, and end with a single verdict in this format:
Verdict: True / False / Disputed
    `.trim();

    resultEl.innerHTML = "🤖 Asking Gemini...";

    // Step 4: Send to Gemini
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const geminiData = await geminiRes.json();
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";

    const verdictMatch = text.match(/Verdict:\s*(True|False|Disputed)/i);
    const verdict = verdictMatch ? verdictMatch[1].toUpperCase() : "UNKNOWN";

    let supportingSources;

    if (verdict === "TRUE" || verdict === "FALSE") {
      supportingSources = data.items
        .filter(item =>
          text.toLowerCase().includes(item.title.toLowerCase()) ||
          text.toLowerCase().includes(item.snippet.toLowerCase())
        )
        .slice(0, 2);
    }

    // Fallback for Disputed/Unknown or if no matches
    if (!supportingSources || supportingSources.length === 0) {
      supportingSources = data.items.slice(0, 2);
    }

    // Generate the HTML once
    const sourcesHTML = supportingSources.map(src => `
      <li><a href="${src.link}" target="_blank">${src.title}</a></li>
    `).join("");

    // Step 5: Display result
    resultEl.innerHTML = `
      <strong>Gemini Verdict:</strong> <span style="color:${verdictColor(verdict)}">${verdict}</span><br><br>
      <div style="font-size: 14px; margin-bottom: 10px;">${text}</div>
      <strong>Top Sources:</strong>
      <ul>${sourcesHTML}</ul>
    `;

  } catch (err) {
    resultEl.textContent = `Error: ${err.message}`;
  }
});

// Optional helper: choose a color based on verdict
function verdictColor(v) {
  switch (v.toUpperCase()) {
    case "TRUE": return "green";
    case "FALSE": return "red";
    case "DISPUTED": return "orange";
    default: return "gray";
  }
}

// Initialize the extension
document.addEventListener('DOMContentLoaded', () => {
  checkStoredKeys();
});
