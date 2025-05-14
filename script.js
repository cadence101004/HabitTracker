// Elements
const monthTitle = document.getElementById("month-title");
const habitSelect = document.getElementById("habit-select");
const addHabitBtn = document.getElementById("add-habit-btn");
const resetHabitBtn = document.getElementById("reset-habit-btn");
const dayGrid = document.getElementById("day-grid");
const counter = document.getElementById("counter");
const affirmationBox = document.getElementById("affirmation");
const habitLabel = document.getElementById("habit-label");
const STREAK_MILESTONES = [5, 10, 15, 20, 25, 30];
const popupShownMilestones = {}; // track per habit

// Month setup
const today = new Date();
const month = today.toLocaleString("default", { month: "long" });
monthTitle.textContent = month;

// Constants
const DAYS_IN_MONTH = 30;
let currentHabit = "";
let habits = {};
const affirmations = [
  "You're doing a great job!",
  "Keep it up!",
  "One step at a time!",
  "You're building something great!",
  "Proud of you for showing up today!",
  "Look at you go!",
  "Small habits make big changes!"
];

// Load from localStorage
if (localStorage.getItem("habitData")) {
  habits = JSON.parse(localStorage.getItem("habitData"));
  Object.keys(habits).forEach(name => {
    const option = new Option(name, name);
    habitSelect.add(option);
  });
  if (habitSelect.value) {
    currentHabit = habitSelect.value;
    renderHabit(currentHabit);
  }
}

// Handle habit switching
habitSelect.addEventListener("change", () => {
  currentHabit = habitSelect.value;
  renderHabit(currentHabit);
});

// Handle adding a new habit
addHabitBtn.addEventListener("click", () => {
  const newHabit = prompt("Name your new habit:");
  if (newHabit && !habits[newHabit]) {
    habits[newHabit] = Array(DAYS_IN_MONTH).fill(false);
    const option = new Option(newHabit, newHabit);
    habitSelect.add(option);
    habitSelect.value = newHabit;
    currentHabit = newHabit;
    saveHabits();
    renderHabit(currentHabit);
  }
});

// Handle reset
resetHabitBtn.addEventListener("click", () => {
  if (!currentHabit) return;
  habits[currentHabit] = Array(DAYS_IN_MONTH).fill(false);
  saveHabits();
  renderHabit(currentHabit);
});

// Render a habit's days
function renderHabit(name) {
  dayGrid.innerHTML = "";
  habitLabel.textContent = name;
  const days = habits[name];
  let checked = 0;

  for (let i = 0; i < DAYS_IN_MONTH; i++) {
    const day = document.createElement("div");
    day.className = "day";
    day.textContent = i + 1;

    if (days[i]) {
      day.classList.add("checked");
      checked++;
    }

    day.addEventListener("click", () => {
        days[i] = !days[i];
      
        if (days[i]) {
          day.classList.add("checked");
          showAffirmation();
          checked++;
      
          // Check for streak and show popup if 5+ in a row
          const streak = checkStreakEndingHere(days, i);

        // Only show if this milestone hasn't been shown for this habit yet
        if (STREAK_MILESTONES.includes(streak) && !popupShownMilestones[`${currentHabit}-${streak}`]) {
            popupShownMilestones[`${currentHabit}-${streak}`] = true;
            showPopup(`You're on a ${streak}-day streak! Gudetama is proud! 🥚`);
        }
      
      
        } else {
          day.classList.remove("checked");
          checked--;
        }
      
        counter.textContent = `${checked}/${DAYS_IN_MONTH}`;
        saveHabits();
      });      

    dayGrid.appendChild(day);
  }

  counter.textContent = `${checked}/${DAYS_IN_MONTH}`;
  saveHabits();
}

// Save habits to localStorage
function saveHabits() {
  localStorage.setItem("habitData", JSON.stringify(habits));
}

// Show random affirmation
function showAffirmation() {
  const random = affirmations[Math.floor(Math.random() * affirmations.length)];
  affirmationBox.textContent = random;
}

function checkStreakEndingHere(arr, index) {
    let streak = 0;
    for (let i = index; i >= 0 && arr[i]; i--) {
      streak++;
    }
    return streak;
  }
  
  
  function showPopup(message) {
    const popup = document.getElementById("streak-popup");
    const msg = document.getElementById("popup-message");
    msg.textContent = message;
    popup.classList.remove("hidden");
  }
  
  document.getElementById("popup-close").addEventListener("click", () => {
    document.getElementById("streak-popup").classList.add("hidden");
  });
  