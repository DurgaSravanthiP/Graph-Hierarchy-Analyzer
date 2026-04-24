import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState("");

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await axios.post("http://localhost:5000/bfhl", {
        data: input.split(",").map((item) => item.trim()),
      });
      setResponse(res.data);
      setTimestamp(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setResponse(null);
    setTimestamp("");
  };

  const handleExample = (example) => {
    setInput(example);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  // 🌳 Recursive Tree Renderer with enhanced visuals
  const renderTree = (node, depth = 0) => {
    const keys = Object.keys(node);
    if (keys.length === 0) return null;

    return (
      <ul>
        {keys.map((key) => (
          <li key={key} style={{ animationDelay: `${depth * 0.05}s` }}>
            <span className="tree-node">
              <span className="node-dot" />
              {key}
            </span>
            {Object.keys(node[key]).length > 0 && renderTree(node[key], depth + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-badge">
          <span className="badge-dot" />
          Bajaj Finserv Health Dev Challenge
        </div>
        <h1>Graph Hierarchy Analyzer</h1>
        <p>
          Parse directed edge relationships, detect cycles, and visualize tree
          structures — all in real time.
        </p>
      </header>

      {/* ── Input Panel ── */}
      <section className="input-panel" id="input-section">
        <label className="input-label" htmlFor="edge-input">
          <span className="label-icon">⟶</span>
          Edge Relationships
        </label>

        <textarea
          id="edge-input"
          placeholder="Enter edges like  A->B, A->C, B->D, C->E"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
        />

        <div className="button-row">
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            id="submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Analyzing…
              </>
            ) : (
              <>
                Analyze Graph
                <span className="btn-icon">→</span>
              </>
            )}
          </button>

          {input && (
            <button className="btn-secondary" onClick={handleClear} id="clear-btn">
              ✕ Clear
            </button>
          )}
        </div>

        <div className="example-chips">
          <span>Try:</span>
          <button
            className="chip"
            onClick={() => handleExample("A->B, A->C, B->D, C->E")}
          >
            Simple tree
          </button>
          <button
            className="chip"
            onClick={() => handleExample("A->B, B->C, C->A")}
          >
            Cycle
          </button>
          <button
            className="chip"
            onClick={() =>
              handleExample("A->B, A->C, B->D, X->Y, X->Z, Y->W")
            }
          >
            Multi-root
          </button>
          <button
            className="chip"
            onClick={() => handleExample("A->B, A->B, C->D, 123, E->E")}
          >
            With errors
          </button>
        </div>
      </section>

      {/* ── Loading ── */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <span className="loading-text">Building hierarchies…</span>
        </div>
      )}

      {/* ── Results ── */}
      {response && !loading && (
        <div className="results" id="results-section">
          {/* Results Header */}
          <div className="results-header">
            <h2>
              <span className="icon">📊</span>
              Analysis Results
            </h2>
            {timestamp && <span className="results-timestamp">{timestamp}</span>}
          </div>

          {/* ── Summary Stats ── */}
          <section className="summary-section" id="summary-section">
            <div className="section-title">
              <span className="section-icon">📈</span>
              Summary
            </div>
            <div className="summary-grid">
              <div className="summary-card trees">
                <span className="summary-icon">🌲</span>
                <div className="summary-value">{response.summary.total_trees}</div>
                <div className="summary-label">Total Trees</div>
              </div>
              <div className="summary-card cycles">
                <span className="summary-icon">🔄</span>
                <div className="summary-value">{response.summary.total_cycles}</div>
                <div className="summary-label">Total Cycles</div>
              </div>
              <div className="summary-card root">
                <span className="summary-icon">👑</span>
                <div className="summary-value">
                  {response.summary.largest_tree_root || "—"}
                </div>
                <div className="summary-label">Largest Root</div>
              </div>
            </div>
          </section>

          {/* ── Hierarchies ── */}
          <section className="info-section" id="hierarchies-section">
            <div className="section-title">
              <span className="section-icon">🌳</span>
              Hierarchies
              <span className="section-count">
                {response.hierarchies.length}
              </span>
            </div>
            <div className="cards">
              {response.hierarchies.map((item, index) => (
                <div key={index} className="card">
                  <div className="card-header">
                    <span className="card-root">
                      <span className="root-node">{item.root}</span>
                      Root Node
                    </span>
                    {!item.has_cycle && (
                      <span className="card-depth">
                        Depth: {item.depth}
                      </span>
                    )}
                  </div>

                  {item.has_cycle ? (
                    <div className="cycle-badge">⚠️ Cycle Detected</div>
                  ) : (
                    <div className="tree-view">{renderTree(item.tree)}</div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Invalid Entries ── */}
          <section className="info-section" id="invalid-section">
            <div className="section-title">
              <span className="section-icon">⚠️</span>
              Invalid Entries
              <span className="section-count">
                {response.invalid_entries.length}
              </span>
            </div>
            <div className={`info-panel ${response.invalid_entries.length > 0 ? "error" : ""}`}>
              {response.invalid_entries.length > 0 ? (
                <div className="info-tags">
                  {response.invalid_entries.map((entry, i) => (
                    <span key={i} className="info-tag invalid">
                      {entry}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="info-empty">✓ No invalid entries found</div>
              )}
            </div>
          </section>

          {/* ── Duplicates ── */}
          <section className="info-section" id="duplicates-section">
            <div className="section-title">
              <span className="section-icon">🔁</span>
              Duplicate Edges
              <span className="section-count">
                {response.duplicate_edges.length}
              </span>
            </div>
            <div className={`info-panel ${response.duplicate_edges.length > 0 ? "warning" : ""}`}>
              {response.duplicate_edges.length > 0 ? (
                <div className="info-tags">
                  {response.duplicate_edges.map((edge, i) => (
                    <span key={i} className="info-tag duplicate">
                      {edge}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="info-empty">✓ No duplicates found</div>
              )}
            </div>
          </section>

          {/* ── User Footer ── */}
          <div className="user-footer" id="user-footer">
            <div className="footer-item">
              <span className="footer-label">User:</span>
              {response.user_id}
            </div>
            <span className="divider" />
            <div className="footer-item">
              <span className="footer-label">Email:</span>
              {response.email_id}
            </div>
            <span className="divider" />
            <div className="footer-item">
              <span className="footer-label">Roll:</span>
              {response.college_roll_number}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;