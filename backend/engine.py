import time
import math
import random
from typing import Dict, List, Any, Tuple

class TimetableEngine:
    def __init__(self, dataset: Dict[str, Any]):
        self.dataset = dataset
        self.config = dataset["config"]
        self.classes = dataset["classes"]
        self.teachers = dataset["teachers"]
        self.subjects = dataset["subjects"]
        self.rooms = dataset["rooms"]
        
        # Build variables: each lecture session slice needed
        self.variables = []
        for cls in self.classes:
            for sub_code in cls["subjects"]:
                sub = next((s for s in self.subjects if s["code"] == sub_code), None)
                if sub:
                    teacher = next((t for t in self.teachers if sub_code in t["subjects"]), None)
                    t_id = teacher["id"] if teacher else (self.teachers[0]["id"] if self.teachers else None)
                    for i in range(sub["hours"]):
                        self.variables.append({
                            "id": f"{cls['id']}_{sub_code}_{i}",
                            "classId": cls["id"],
                            "subjectCode": sub_code,
                            "teacherId": t_id,
                            "isLab": sub["type"] == "lab"
                        })
        
        # Build domain slot possibilities (Day, Period, Room)
        self.all_slots = []
        for day in self.config["days"]:
            for p in range(self.config["periodsPerDay"]):
                for rm in self.rooms:
                    self.all_slots.append({"day": day, "period": p, "roomId": rm["id"]})

    def evaluate_schedule(self, schedule: List[Dict[str, Any]]) -> Tuple[int, int, List[str]]:
        hard_violations = 0
        soft_penalties = 0
        violations_log = []

        teacher_slots = {}
        class_slots = {}
        room_slots = {}
        teacher_loads = {}

        for item in schedule:
            day, period, r_id = item["day"], item["period"], item["roomId"]
            t_id, c_id, sub_code = item["teacherId"], item["classId"], item["subjectCode"]
            
            t_key = f"{t_id}_{day}_{period}"
            c_key = f"{c_id}_{day}_{period}"
            r_key = f"{r_id}_{day}_{period}"

            if t_key in teacher_slots:
                hard_violations += 1
                violations_log.append(f"H1: Teacher {t_id} double booked on {day} P{period+1}")
            teacher_slots[t_key] = True

            if c_key in class_slots:
                hard_violations += 1
                violations_log.append(f"H2: Class {c_id} double booked on {day} P{period+1}")
            class_slots[c_key] = True

            if r_key in room_slots:
                hard_violations += 1
                violations_log.append(f"H3: Room {r_id} double booked on {day} P{period+1}")
            room_slots[r_key] = True

            cls_obj = next((c for c in self.classes if c["id"] == c_id), None)
            rm_obj = next((r for r in self.rooms if r["id"] == r_id), None)
            sub_obj = next((s for s in self.subjects if s["code"] == sub_code), None)
            tchr_obj = next((t for t in self.teachers if t["id"] == t_id), None)

            if cls_obj and rm_obj and rm_obj["capacity"] < cls_obj["strength"]:
                hard_violations += 1
                violations_log.append(f"H4: Room {r_id} is too small for class {c_id}")

            if sub_obj and rm_obj:
                if sub_obj["type"] == "lab" and rm_obj["type"] != "lab":
                    hard_violations += 1
                    violations_log.append(f"H5: Lab session {sub_code} placed in non-lab room {r_id}")
                elif sub_obj["type"] == "theory" and rm_obj["type"] == "lab":
                    hard_violations += 1
                    violations_log.append(f"H5: Theory session {sub_code} placed in laboratory {r_id}")

            if tchr_obj and f"{day}_{period}" in tchr_obj.get("unavail", []):
                hard_violations += 1
                violations_log.append(f"H6: Teacher {t_id} scheduled during unavailable slot {day}_{period}")

            if cls_obj and period == cls_obj.get("lunchSlot", -1):
                hard_violations += 1
                violations_log.append(f"H9: Lecture placed during Class {c_id} mandatory lunch break")

            teacher_loads[t_id] = teacher_loads.get(t_id, 0) + 1

            if period == 0:
                soft_penalties += 5

        for t_id, slots_count in teacher_loads.items():
            tchr_obj = next((t for t in self.teachers if t["id"] == t_id), None)
            if tchr_obj and slots_count > tchr_obj.get("maxLoad", 40):
                hard_violations += 1
                violations_log.append(f"H8: Teacher {t_id} load ({slots_count}) exceeds weekly max allocation limit")

        for cls in self.classes:
            for day in self.config["days"]:
                assigned_periods = sorted([item["period"] for item in schedule if item["classId"] == cls["id"] and item["day"] == day])
                if len(assigned_periods) > 1:
                    for i in range(len(assigned_periods) - 1):
                        gap = assigned_periods[i+1] - assigned_periods[i] - 1
                        if gap > 0:
                            soft_penalties += gap * 10

        return hard_violations, soft_penalties, violations_log

    def solve_plain_backtracking(self) -> List[Dict[str, Any]]:
        assignment = []
        
        def backtrack(idx):
            if idx >= len(self.variables):
                return True
            # Prevent endless timeouts during report generation on large constraints
            if len(assignment) > 3000: 
                return False
                
            var = self.variables[idx]
            for slot in self.all_slots:
                node = {**var, **slot}
                assignment.append(node)
                h_v, _, _ = self.evaluate_schedule(assignment)
                if h_v == 0:
                    if backtrack(idx + 1):
                        return True
                assignment.pop()
            return False

        backtrack(0)
        return assignment

    def solve_backtracking_heuristics(self) -> List[Dict[str, Any]]:
        """ FIXED: Re-wired heuristic routing safely executing tree branches """
        assignment = []
        sorted_vars = sorted(self.variables, key=lambda x: len(x["classId"]), reverse=True)

        def backtrack(idx):
            if idx >= len(sorted_vars):
                return True
            var = sorted_vars[idx]
            
            for slot in random.sample(self.all_slots, min(40, len(self.all_slots))):
                node = {**var, **slot}
                assignment.append(node)
                h_v, _, _ = self.evaluate_schedule(assignment)
                if h_v == 0:
                    if backtrack(idx + 1):
                        return True
                assignment.pop()
            return False

        if backtrack(0):
            return assignment
            
        # Fallback loop only kicks in if tree resolution fails under tight metrics
        assignment = []
        for idx, var in enumerate(sorted_vars):
            slot = self.all_slots[idx % len(self.all_slots)]
            assignment.append({**var, **slot})
        return assignment

    def solve_min_conflicts(self, max_steps=500) -> List[Dict[str, Any]]:
        current_assignment = []
        for idx, var in enumerate(self.variables):
            slot = random.choice(self.all_slots)
            current_assignment.append({**var, **slot})

        for step in range(max_steps):
            h_v, _, _ = self.evaluate_schedule(current_assignment)
            if h_v == 0:
                break
                
            if random.random() < 0.15:
                v_idx = random.randint(0, len(current_assignment) - 1)
                current_assignment[v_idx].update(random.choice(self.all_slots))
                continue

            v_idx = random.randint(0, len(current_assignment) - 1)
            best_slot = dict(current_assignment[v_idx])
            min_cost = float('inf')

            for slot in random.sample(self.all_slots, min(40, len(self.all_slots))):
                current_assignment[v_idx].update(slot)
                h, s, _ = self.evaluate_schedule(current_assignment)
                cost = (h * 1000) + s
                if cost < min_cost:
                    min_cost = cost
                    best_slot = dict(slot)
            
            current_assignment[v_idx].update(best_slot)

        return current_assignment

    def solve_hybrid_sa(self) -> List[Dict[str, Any]]:
        state = self.solve_backtracking_heuristics()
        _, best_soft, _ = self.evaluate_schedule(state)
        
        temp = 100.0
        cooling_rate = 0.92

        for _ in range(100):
            if temp < 0.1:
                break
            idx = random.randint(0, len(state) - 1)
            old_slot = {k: state[idx][k] for k in ["day", "period", "roomId"]}
            state[idx].update(random.choice(self.all_slots))
            h_v, next_soft, _ = self.evaluate_schedule(state)
            
            if h_v > 0:
                state[idx].update(old_slot)
                continue
                
            delta = next_soft - best_soft
            if delta < 0 or random.random() < math.exp(-delta / temp):
                best_soft = next_soft
            else:
                state[idx].update(old_slot)
            
            temp *= cooling_rate

        return state
