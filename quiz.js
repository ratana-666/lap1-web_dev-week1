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
let questions = [
  {
    title: "What does HTML stand for?",
    choiceA: "Hi Thierry More Laught",
    choiceB: "How To move Left",
    choiceC: "Ho Theary Missed the Laundry !",
    choiceD: "Hypertext Markup Language",
    correct: "D",
  },
  {
    title: "What does CSS stand for?",
    choiceA: "Cisco and Super Start",
    choiceB: "Ci So Sa",
    choiceC: "Cascading Style Sheets ",
    choiceD: "I don't know !",
    correct: "C",
  },
  {
    title: "What does JS stand for?",
    choiceA: "Junior stars",
    choiceB: "Justing Star",
    choiceC: "Javascript",
    choiceD: "RonanScript",
    correct: "C",
  },
];
let runningQuestionIndex = 0;
let score = 0;

// FUNCTIONS ---------------------------------------------------------

// Hide a given element
function hide(element) {
  // TODO
  element.style.display = "none"
}

function show(element) {
  // TODO
  element.style.display = "block"
}

function onStart() {
  // Render the current question
  // Display the quiz view,
  hide(dom_start);
  show(dom_quiz);
  renderQuestion();
}

function renderQuestion() {
  // Render the current question on the quiz view
  let q = questions[runningQuestionIndex];

  dom_question.textContent = q.title;
  dom_choiceA.textContent = q.choiceA;
  dom_choiceB.textContent = q.choiceB;
  dom_choiceC.textContent = q.choiceC;
  dom_choiceD.textContent = q.choiceD;
}

function checkAnswer(answer) {
  // Update the score, display the next question or the score view
  let currentQ = questions[runningQuestionIndex];
  if(answer == currentQ.correct){
    score++;
  }
  runningQuestionIndex++;

  if(runningQuestionIndex < questions.length){
    renderQuestion();
  }else{
    renderSCore();
  }
}

function renderSCore() {
  // calculate the amount of question percent answered by the user
  // choose the image based on the scorePerCent
  hide(dom_quiz);
  show(dom_score);
  let scorePerCent = Math.round((score/questions.length) * 100);
  
  let image = "img/100.png";
  if(scorePerCent <= 20){
    image = "img/20.png";
  }else if(scorePerCent <= 40){
    image = "img/40.png";
  }else if(scorePerCent <= 60){
    image = "img/60.png";
  }else if(scorePerCent <= 80){
    image = "img/80.png";
  }

  dom_score.innerHTML= `
  <img src = ${image}>
  <h2>Your score = ${scorePerCent}% <h2>
  `
}

// FUNCTIONS ---------------------------------------------------------
show(dom_start);
hide(dom_quiz);
hide(dom_score);
