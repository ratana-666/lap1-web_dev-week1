// DOMS ELEMENTS  ---------------------------------------------------------
const dom_quiz = document.querySelector("#quiz");
const dom_question = document.querySelector("#question");
const dom_choiceA = document.querySelector("#A");
const dom_choiceB = document.querySelector("#B");
const dom_choiceC = document.querySelector("#C");
const dom_choiceD = document.querySelector("#D");
const dom_score = document.querySelector("#score");
const dom_start = document.querySelector("#start");

dom_start.addEventListener("click", onStart);

// DATA  ---------------------------------------------------------
let questions = []; // This will be loaded from localStorage or defaults

const defaultQuestions = [
  {
    id: "default-1",
    title: "What does HTML stand for?",
    answerA: "Hi Thierry More Laught",
    answerB: "How To move Left",
    answerC: "Hypertext Markup Language",
    answerD: "Ho Theary Missed the Laundry !",
    correct: "answerC",
  },
  {
    id: "default-2",
    title: "What does CSS stand for?",
    answerA: "Cisco and Super Start",
    answerB: "Cascading Style Sheets",
    answerC: "Ci So Sa",
    answerD: "I don't know !",
    correct: "answerB",
  },
  {
    id: "default-3",
    title: "What does JS stand for?",
    answerA: "Javascript",
    answerB: "Junior stars",
    answerC: "Justing Star",
    answerD: "RonanScript",
    correct: "answerA",
  },
];

let runningQuestionIndex = 0;
let score = 0;

// FUNCTIONS ---------------------------------------------------------

// Load questions from localStorage or use defaults
function loadQuestionsFromLocalStorage() {
  try {
    const storedQuestions = localStorage.getItem('quizQuestions');
    if (storedQuestions) { // Only proceed if a string exists
      const parsedQuestions = JSON.parse(storedQuestions);
      if (Array.isArray(parsedQuestions)) {
        questions = parsedQuestions;
      } else {
        console.warn("localStorage 'quizQuestions' is not a valid array, resetting to defaults.");
        questions = defaultQuestions;
        localStorage.setItem('quizQuestions', JSON.stringify(defaultQuestions));
      }
    } else { // localStorage is null, so seed with defaults
      questions = defaultQuestions;
      localStorage.setItem('quizQuestions', JSON.stringify(defaultQuestions));
    }
  } catch (e) { // JSON parsing error
    console.error("Failed to parse questions from localStorage, resetting to defaults:", e);
    questions = defaultQuestions;
    localStorage.setItem('quizQuestions', JSON.stringify(defaultQuestions));
  }
}

// Hide a given element
function hide(element) {
  element.style.display = "none"
}

function show(element) {
  element.style.display = "block"
}

function onStart() {
  // Ensure questions are loaded before starting
  loadQuestionsFromLocalStorage();
  // Display the quiz view,
  hide(dom_start);
  show(dom_quiz);
  runningQuestionIndex = 0; // Reset index for a new quiz
  score = 0; // Reset score for a new quiz
  renderQuestion();
}

function renderQuestion() {
  if (questions.length === 0 || runningQuestionIndex >= questions.length) {
    renderSCore(); // Or show some other message
    return;
  }

  let q = questions[runningQuestionIndex];

  dom_question.textContent = q.title;
  dom_choiceA.textContent = q.answerA;
  dom_choiceB.textContent = q.answerB;
  dom_choiceC.textContent = q.answerC; // Corrected
  dom_choiceD.textContent = q.answerD; // Corrected
}

function checkAnswer(selectedChoiceLetter) { // 'A', 'B', 'C', 'D'
  let currentQ = questions[runningQuestionIndex];
  let correctAnswerKey = currentQ.correct; // e.g., "answerA"

  // Map the selected choice letter to the corresponding answer key
  let selectedAnswerKey;
  if (selectedChoiceLetter === 'A') selectedAnswerKey = 'answerA';
  else if (selectedChoiceLetter === 'B') selectedAnswerKey = 'answerB';
  else if (selectedChoiceLetter === 'C') selectedAnswerKey = 'answerC';
  else if (selectedChoiceLetter === 'D') selectedAnswerKey = 'answerD';

  if (selectedAnswerKey === correctAnswerKey) {
    score++;
  }
  runningQuestionIndex++;

  if (runningQuestionIndex < questions.length) {
    renderQuestion();
  } else {
    renderSCore();
  }
}

function renderSCore() {
  hide(dom_quiz);
  show(dom_score);
  let scorePerCent = 0;
  if (questions.length > 0) {
    scorePerCent = Math.round((score / questions.length) * 100);
  }
  
  let image = "../img/100.png";
  if (scorePerCent <= 20) {
    image = "../img/20.png";
  } else if (scorePerCent <= 40) {
    image = "../img/40.png";
  } else if (scorePerCent <= 60) {
    image = "../img/60.png";
  } else if (scorePerCent <= 80) {
    image = "../img/80.png";
  }

  dom_score.innerHTML = `
    <div class="flex items-center gap-10 mt-[150px]">
        <a><img class="w-[80px]" src="${image}" alt="score image"></a>
        <h1>Your score = ${scorePerCent}%</h1>
      </div>
  `;
}

// Initial setup on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  loadQuestionsFromLocalStorage();
  show(dom_start);
  hide(dom_quiz);
  hide(dom_score);
  
  // Attach event listeners to choices
  document.getElementById('A').onclick = () => checkAnswer('A');
  document.getElementById('B').onclick = () => checkAnswer('B');
  document.getElementById('C').onclick = () => checkAnswer('C');
  document.getElementById('D').onclick = () => checkAnswer('D');
});
