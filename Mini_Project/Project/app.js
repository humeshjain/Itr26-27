// app.js - React component (frontend logic)

const { useState, useCallback } = React;

// ----- helper: basic NLP utilities (client-side) -----
const analyzeText = (text) => {
  if (!text.trim()) {
    return {
      wordCount: 0,
      charCount: 0,
      sentenceCount: 0,
      avgWordLen: 0,
      sentiment: 'neutral',
      keywords: [],
    };
  }

  const clean = text.trim();
  const charCount = clean.length;

  const words = clean.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  const sentences = clean.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  const totalCharsInWords = words.reduce((acc, w) => acc + w.length, 0);
  const avgWordLen = wordCount > 0 ? +(totalCharsInWords / wordCount).toFixed(1) : 0;

  // simple sentiment
  const positiveWords = ['good', 'great', 'excellent', 'nice', 'love', 'wonderful', 'amazing', 'happy', 'best', 'awesome', 'fantastic', 'super'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'poor', 'sad', 'angry', 'horrible', 'disappointing', 'ugly', 'evil'];

  let posScore = 0, negScore = 0;
  words.forEach(w => {
    const lower = w.toLowerCase().replace(/[^a-z]/g, '');
    if (positiveWords.includes(lower)) posScore++;
    else if (negativeWords.includes(lower)) negScore++;
  });

  let sentiment = 'neutral';
  if (posScore > negScore) sentiment = 'positive';
  else if (negScore > posScore) sentiment = 'negative';

  // extract top keywords (frequency > 1, min length 3)
  const freq = {};
  words.forEach(w => {
    const key = w.toLowerCase().replace(/[^a-z]/g, '');
    if (key.length < 3) return;
    freq[key] = (freq[key] || 0) + 1;
  });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const topKeywords = sorted.slice(0, 5).map(([word, count]) => ({ word, count }));

  return {
    wordCount,
    charCount,
    sentenceCount,
    avgWordLen,
    sentiment,
    keywords: topKeywords,
  };
};

// ----- Main App component -----
const App = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState({
    wordCount: 0,
    charCount: 0,
    sentenceCount: 0,
    avgWordLen: 0,
    sentiment: 'neutral',
    keywords: [],
  });
  const [loading, setLoading] = useState(false);

  // call backend (Flask) or local analysis
  const handleAnalyze = useCallback(async () => {
    if (!text.trim()) {
      setAnalysis({
        wordCount: 0,
        charCount: 0,
        sentenceCount: 0,
        avgWordLen: 0,
        sentiment: 'neutral',
        keywords: [],
      });
      return;
    }

    // Try to call the Flask backend if available,
    // otherwise fallback to client-side analysis.
    // (This makes the project hybrid: frontend + backend ready)
    try {
      setLoading(true);
      const response = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        const data = await response.json();
        setAnalysis({
          wordCount: data.wordCount || 0,
          charCount: data.charCount || 0,
          sentenceCount: data.sentenceCount || 0,
          avgWordLen: data.avgWordLen || 0,
          sentiment: data.sentiment || 'neutral',
          keywords: data.keywords || [],
        });
      } else {
        // fallback to local analysis if backend fails
        const result = analyzeText(text);
        setAnalysis(result);
      }
    } catch (error) {
      // fallback to local analysis on network error
      const result = analyzeText(text);
      setAnalysis(result);
    } finally {
      setLoading(false);
    }
  }, [text]);

  const handleClear = () => {
    setText('');
    setAnalysis({
      wordCount: 0,
      charCount: 0,
      sentenceCount: 0,
      avgWordLen: 0,
      sentiment: 'neutral',
      keywords: [],
    });
  };

  const keywordChips = analysis.keywords.map((item, idx) => (
    <span className="chip" key={idx}>
      {item.word} <span style={{ opacity: 0.6, marginLeft: '4px' }}>({item.count})</span>
    </span>
  ));

  const sentimentClass = `sentiment-badge ${analysis.sentiment}`;

  return (
    <div className="app-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <h1>
          <i className="fas fa-robot" style={{ color: '#1f5570' }}></i> 
          Smart Text Analyzer
        </h1>
        <span style={{ background: '#e2ebf2', padding: '0.2rem 1.2rem', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 500, color: '#1f5570' }}>
          <i className="fas fa-code"></i> AI/ML · intern
        </span>
      </div>
      <div className="subhead">
        <i className="fas fa-microchip"></i> basic NLP: word count · sentiment · keyword extraction
      </div>

      {/* input section */}
      <div className="input-section">
        <label htmlFor="textInput"><i className="fas fa-pen-fancy" style={{ marginRight: '0.4rem', color: '#3f8db5' }}></i> Enter your text</label>
        <textarea 
          id="textInput"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type some text ... e.g. 'I love this project! It is amazing and very useful.'"
        />
        <div className="action-bar">
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>
              <i className="fas fa-chart-simple"></i> {loading ? 'Analyzing...' : 'Analyze'}
            </button>
            <button className="btn btn-outline" onClick={handleClear}>
              <i className="fas fa-eraser"></i> Clear
            </button>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#4b6f84', background: '#eaf1f7', padding: '0.2rem 1rem', borderRadius: '30px' }}>
            <i className="fas fa-lightbulb"></i> {text.length} chars
          </span>
        </div>
      </div>

      {/* stats grid */}
      <div className="stats-grid">
        <div className="stat-item">
          <div className="number">{analysis.wordCount}</div>
          <div className="label"><i className="fas fa-font"></i> Words</div>
        </div>
        <div className="stat-item">
          <div className="number">{analysis.charCount}</div>
          <div className="label"><i className="fas fa-keyboard"></i> Characters</div>
        </div>
        <div className="stat-item">
          <div className="number">{analysis.sentenceCount}</div>
          <div className="label"><i className="fas fa-grip-lines"></i> Sentences</div>
        </div>
        <div className="stat-item">
          <div className="number">{analysis.avgWordLen}</div>
          <div className="label"><i className="fas fa-ruler"></i> Avg. word len</div>
        </div>
      </div>

      {/* insight box */}
      <div className="insight-box">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.8rem' }}>
          <h3><i className="fas fa-face-smile"></i> Sentiment &amp; keywords</h3>
          <div className={sentimentClass}>
            <i className={`fas fa-${analysis.sentiment === 'positive' ? 'smile' : analysis.sentiment === 'negative' ? 'frown' : 'meh'}`}></i>
            {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
          </div>
        </div>

        <div style={{ marginTop: '0.8rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#2c5770', marginBottom: '0.3rem' }}>
            <i className="fas fa-tags"></i> Top keywords
          </div>
          <div className="keyword-chips">
            {keywordChips.length > 0 ? keywordChips : (
              <span style={{ color: '#6e8fa3', fontSize: '0.9rem', fontStyle: 'italic' }}>No keywords detected</span>
            )}
          </div>
        </div>
      </div>

      <div className="footer-note">
        <i className="fas fa-graduation-cap"></i> Intern AI/ML project · Python (Flask) + React 
        <span style={{ margin: '0 0.5rem' }}>·</span> 
        <i className="fas fa-code-branch"></i> multi-file integration
      </div>
    </div>
  );
};

// ----- mount React app -----
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);