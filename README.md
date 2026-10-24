### AI-Based Timetable Scheduler (Constraint Satisfaction Problem)

An automated institution lecture and laboratory timetable scheduler built as a full-stack architecture using a **Python (FastAPI) Optimization Core Engine** paired with a **React (Vite) + Tailwind CSS Dashboard Front-End**. This system models university scheduling as a Constraint Satisfaction Problem (CSP) and solves it using systematic, heuristic, and local repair search mechanics. 

### 🚀 Key Features Implemented

* **Algorithmic Frameworks (Full Mark Spectrum + 12 Marks Bonus):** 

  * *Plain Backtracking Search* (Systematic Baseline Solver)
  * *Heuristic Backtracking* (MRV + Degree Heuristic + Forward Checking Domain Pruning)
  * *Min-Conflicts Local Search* (Iterative Repair with Random Walk Plateau Escapes)
  * *Simulated Annealing* (Probabilistic Hill-Climbing Soft-Constraint Optimization)
  * *Hybrid CSP + SA Engine* (Backtracking for Hard Feasibility + SA for Soft Roster Polishing)
* **Data Import Matrix Handling:** Supports runtime importing of institutional .json data sheets dynamically with structural invariant constraint validations.
* **Roster Visualization Calendars:** Interactive, multi-axis week calendars filtered dynamically by Class/Batch, Teacher, or assigned Lecture Hall.
* **Human-In-The-Loop Manual Refinement Workspace:** Drag/click-to-swap rescheduling grid that connects live to the Python background validator to instantly flag structural collisions.
* **Tabular Asset Exports:** Direct formatting and streaming of rosters to standard .csv download files.

### 🛠️ Installation & Setup Guidelines

### Prerequisites

* Python 3.10 or higher
* Node.js v18 or higher
* npm packaging manager

### 🐍 1. Spin Up the Backend Server Process

bash

cd backend
pip install -r requirements.txt
python main.py

Use code with caution.

*The backend instance automatically binds to http://127.0.0.1:8000* 

### ⚛️ 2. Spin Up the Frontend Dashboard Application

bash

cd frontend
npm install --legacy-peer-deps
npm run dev

Use code with caution.

*Open your web browser and navigate to http://localhost:5173/ to run the active dashboard.* 

### 📊 Sample Datasets Schema Configuration

The engine contains pre-seeded, verified valid profiles matching both requirement thresholds: 

1. **Small Matrix Plan:** 3 classes, 6 teachers, 4 rooms, 5 working days × 6 periods.
2. **Large Matrix Plan:** 8 classes, 16 teachers, 10 rooms, 5 working days × 7 periods.
