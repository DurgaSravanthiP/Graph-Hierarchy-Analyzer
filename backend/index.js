require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// MAIN API (your task)
app.post("/bfhl", (req, res) => {
  const input = req.body.data || [];

  const validEdges = [];
  const invalid_entries = [];
  const duplicate_edges = [];

  const seen = new Set();

  // ✅ STEP 1: Validation + Duplicate check
  input.forEach((item) => {
    const trimmed = item.trim();

    const regex = /^[A-Z]->[A-Z]$/;

    if (!regex.test(trimmed) || trimmed[0] === trimmed[3]) {
      invalid_entries.push(item);
    } else {
      if (seen.has(trimmed)) {
        if (!duplicate_edges.includes(trimmed)) {
          duplicate_edges.push(trimmed);
        }
      } else {
        seen.add(trimmed);
        validEdges.push(trimmed);
      }
    }
  });

  // ✅ STEP 2: Build Graph
  const graph = {};
  const childSet = new Set();

  validEdges.forEach((edge) => {
    const [parent, child] = edge.split("->");

    if (!graph[parent]) graph[parent] = [];
    graph[parent].push(child);

    childSet.add(child);
  });

  // ✅ STEP 3: Find Roots
  const nodes = new Set([
    ...validEdges.map((e) => e[0]),
    ...validEdges.map((e) => e[3]),
  ]);

  let roots = [...nodes].filter((node) => !childSet.has(node));

  // If no root (cycle case)
  if (roots.length === 0) {
    roots = [[...nodes].sort()[0]];
  }

  // ✅ STEP 4: DFS for Tree + Cycle
  const buildTree = (node, visited) => {
    if (visited.has(node)) {
      return { cycle: true };
    }

    visited.add(node);

    let tree = {};
    let maxDepth = 1;

    if (graph[node]) {
      for (let child of graph[node]) {
        const result = buildTree(child, new Set(visited));

        if (result.cycle) return { cycle: true };

        tree[child] = result.tree;
        maxDepth = Math.max(maxDepth, 1 + result.depth);
      }
    }

    return { tree, depth: maxDepth };
  };

  const hierarchies = [];
  let total_trees = 0;
  let total_cycles = 0;

  let maxDepth = 0;
  let largest_tree_root = "";

  const visitedGlobal = new Set();

  [...nodes].forEach((node) => {
    if (visitedGlobal.has(node)) return;

    const result = buildTree(node, new Set());

    const markVisited = (n) => {
      if (visitedGlobal.has(n)) return;
      visitedGlobal.add(n);

      if (graph[n]) {
        graph[n].forEach(markVisited);
      }
    };

    markVisited(node);

    if (result.cycle) {
      total_cycles++;

      hierarchies.push({
        root: node,
        tree: {},
        has_cycle: true,
      });
    } else {
      total_trees++;

      if (
        result.depth > maxDepth ||
        (result.depth === maxDepth && node < largest_tree_root)
      ) {
        maxDepth = result.depth;
        largest_tree_root = node;
      }

      hierarchies.push({
        root: node,
        tree: { [node]: result.tree },
        depth: result.depth,
      });
    }
  });

  // ✅ FINAL RESPONSE
  res.json({
    user_id: "durgasravanthi_11052006",
    email_id: "durgasravanthipeddoju@srmap.edu.in",
    college_roll_number: "AP23110011597",

    hierarchies,
    invalid_entries,
    duplicate_edges,

    summary: {
      total_trees,
      total_cycles,
      largest_tree_root,
    },
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
