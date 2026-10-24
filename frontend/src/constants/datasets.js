export const SAMPLE_DATASETS = {
  small: {
    name: "Small Dataset (3 Classes, 6 Teachers, 4 Rooms, 5x6 Grid)",
    config: { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], periodsPerDay: 6, lunchPeriod: 3 },
    classes: [
      { id: "C1", name: "B.Tech CSE-A", strength: 50, lunchSlot: 3, subjects: ["CS201", "CS202", "CS203", "CS204L"] },
      { id: "C2", name: "B.Tech CSE-B", strength: 45, lunchSlot: 3, subjects: ["CS201", "CS202", "CS205", "CS206L"] },
      { id: "C3", name: "B.Tech AI-A", strength: 55, lunchSlot: 3, subjects: ["CS201", "AI201", "AI202L", "CS203"] }
    ],
    teachers: [
      { id: "T1", name: "Dr. Sharma", subjects: ["CS201"], maxLoad: 12, unavail: ["Mon_0", "Fri_5"] },
      { id: "T2", name: "Prof. Verma", subjects: ["CS202", "CS203"], maxLoad: 15, unavail: ["Wed_2"] },
      { id: "T3", name: "Dr. Gupta", subjects: ["CS204L", "CS206L"], maxLoad: 10, unavail: [] },
      { id: "T4", name: "Prof. Rao", subjects: ["CS205", "AI201"], maxLoad: 14, unavail: ["Thu_0"] },
      { id: "T5", name: "Dr. Patel", subjects: ["AI202L"], maxLoad: 8, unavail: [] },
      { id: "T6", name: "Prof. Singh", subjects: ["CS203"], maxLoad: 10, unavail: [] }
    ],
    subjects: [
      { code: "CS201", name: "Data Structures", hours: 4, type: "theory" },
      { code: "CS202", name: "Discrete Math", hours: 4, type: "theory" },
      { code: "CS203", name: "Computer Architecture", hours: 3, type: "theory" },
      { code: "CS204L", name: "Data Structures Lab", hours: 2, type: "lab" },
      { code: "CS205", name: "OOP with C++", hours: 4, type: "theory" },
      { code: "CS206L", name: "OOP Lab", hours: 2, type: "lab" },
      { code: "AI201", name: "Intro to AI", hours: 4, type: "theory" },
      { code: "AI202L", name: "AI & Search Lab", hours: 2, type: "lab" }
    ],
    rooms: [
      { id: "R101", name: "LH-101", capacity: 60, type: "classroom" },
      { id: "R102", name: "LH-102", capacity: 60, type: "classroom" },
      { id: "R103", name: "LH-103", capacity: 50, type: "classroom" },
      { id: "L201", name: "AI Computing Lab", capacity: 60, type: "lab" }
    ]
  }
};
