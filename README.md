# 🌳 Graph Hierarchy Analyzer

A full-stack web application that parses directed edge relationships, detects cycles, and visualizes hierarchical tree structures in real time.

---

## 🚀 Live Demo

- **Frontend:** [graph-hierarchy-analyzer.vercel.app](https://graph-hierarchy-analyzer.vercel.app)
- **Backend API:** [graph-backend-gqoe.onrender.com](https://graph-backend-gqoe.onrender.com)

---

## 📌 Features

- Parse directed edges (e.g., `A->B, B->C`)
- Validate input format using regex
- Detect cycles in graph structures
- Build and visualize hierarchy trees
- Detect duplicate edges
- Identify invalid inputs
- Summary insights — total trees, total cycles, largest tree root
- Clean and interactive UI

---

## 🛠️ Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React.js (Vite), CSS, Axios |
| Backend    | Node.js, Express.js |
| Deployment | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
Graph-Hierarchy-Analyzer/
├── backend/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/DurgaSravanthiP/Graph-Hierarchy-Analyzer.git
cd Graph-Hierarchy-Analyzer
```

### 2. Backend

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

---

## 🔌 API

### `POST /bfhl`

**Request:**

```json
{
  "data": ["A->B", "B->C", "A->D"]
}
```

**Response:**

```json
{
  "user_id": "durgasravanthi_11052006",
  "email_id": "durgasravanthipeddoju@srmap.edu.in",
  "college_roll_number": "AP23110011597",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": { "C": {} },
          "D": {}
        }
      },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

---

## 🧠 How It Works

1. Input edges are validated using regex
2. Duplicate and invalid edges are filtered
3. Graph is built using an adjacency list
4. DFS is used to detect cycles and build hierarchical trees
5. Summary statistics are generated

---

## ⚠️ Notes

- Input format must be `A->B`
- Backend on Render (free tier) may take 30–50 seconds to wake up on first request

---

## 👩‍💻 Author

**Durga Sravanthi**
B.Tech CSE, SRM University AP
