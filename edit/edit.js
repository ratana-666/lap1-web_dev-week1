document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const questionsDialog = document.getElementById('questions-dialog');
  const createQuestionBtn = document.getElementById('create-question-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const saveQuestionBtn = document.getElementById('save-question-btn');
  const questionsList = document.getElementById('questions-container');
  const restoreBtn = document.getElementById('restore-defaults-btn');
  const dialogHeader = document.getElementById('dialog-header');
  const questionTitleInput = document.getElementById('question-title');
  const answerAInput = document.getElementById('answerA');
  const answerBInput = document.getElementById('answerB');
  const answerCInput = document.getElementById('answerC');
  const answerDInput = document.getElementById('answerD');
  const correctChoiceInputs = document.querySelectorAll('input[name="correct"]');

  let questions = [];

  // --- LOCAL STORAGE MANAGEMENT ---
  const loadQuestions = () => {
    try {
      const storedQuestions = localStorage.getItem('quizQuestions');
      questions = storedQuestions ? JSON.parse(storedQuestions) : [];
    } catch (e) {
      console.error("Failed to parse questions from localStorage:", e);
      questions = [];
    }
  };

  const saveQuestions = () => {
    try {
      localStorage.setItem('quizQuestions', JSON.stringify(questions));
    } catch (e) {
      console.error("Failed to save questions to localStorage:", e);
    }
  };

  // --- UTILITY FUNCTIONS ---
  const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const getCorrectAnswerValue = () => {
    for (const input of correctChoiceInputs) if (input.checked) return input.value;
    return null;
  };

  const setCorrectAnswerValue = (value) => {
    for (const input of correctChoiceInputs) {
      if (input.value === value) {
        input.checked = true;
        return;
      }
    }
  };

  // --- DIALOG MANAGEMENT ---
  const clearDialog = () => {
    questionTitleInput.value = '';
    answerAInput.value = '';
    answerBInput.value = '';
    answerCInput.value = '';
    answerDInput.value = '';
    correctChoiceInputs.forEach(input => input.checked = false);
    saveQuestionBtn.removeAttribute('data-editing-id');
    dialogHeader.textContent = 'Create Question';
  };

  const populateDialog = (question) => {
    questionTitleInput.value = question.title;
    answerAInput.value = question.answerA;
    answerBInput.value = question.answerB;
    answerCInput.value = question.answerC;
    answerDInput.value = question.answerD;
    setCorrectAnswerValue(question.correct);
    saveQuestionBtn.setAttribute('data-editing-id', question.id);
    dialogHeader.textContent = 'Edit Question';
  };

  const openDialog = (question = null) => {
    clearDialog();
    if (question) populateDialog(question);
    questionsDialog.classList.remove('hidden');
  };

  const closeDialog = () => {
    questionsDialog.classList.add('hidden');
    clearDialog();
  };

  // --- CRUD FUNCTIONS ---
  const addQuestion = () => {
    const newQuestion = {
      id: generateUniqueId(),
      title: questionTitleInput.value,
      answerA: answerAInput.value,
      answerB: answerBInput.value,
      answerC: answerCInput.value,
      answerD: answerDInput.value,
      correct: getCorrectAnswerValue()
    };
    questions.push(newQuestion);
    saveQuestions();
    renderQuestions();
    closeDialog();
  };

  const updateQuestion = (id) => {
    const qIndex = questions.findIndex(q => q.id === id);
    if (qIndex > -1) {
      questions[qIndex] = {
        id,
        title: questionTitleInput.value,
        answerA: answerAInput.value,
        answerB: answerBInput.value,
        answerC: answerCInput.value,
        answerD: answerDInput.value,
        correct: getCorrectAnswerValue()
      };
      saveQuestions();
      renderQuestions();
      closeDialog();
    }
  };

  const deleteQuestion = (id) => {
    questions = questions.filter(q => q.id !== id);
    saveQuestions();
    renderQuestions();
  };

  // --- RENDER QUESTIONS LIST ---
  const renderQuestions = () => {
    if (!questionsList) return;

    const validQuestions = questions.filter(q => q && q.id && typeof q.title !== 'undefined');

    if (validQuestions.length === 0) {
      questionsList.innerHTML = '<p class="text-gray-500">No questions found. Create a question or restore defaults.</p>';
      return;
    }

    questionsList.innerHTML = ''; // clear list
    validQuestions.forEach(question => {
      const questionElement = document.createElement('div');
      questionElement.className = 'flex justify-between items-center bg-gray-100 p-3 mb-2 rounded-md shadow-sm';
      questionElement.innerHTML = `
        <span class="font-medium">${question.title}</span>
        <div class="space-x-2">
          <button class="edit-btn bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition" data-id="${question.id}">Edit</button>
          <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition" data-id="${question.id}">Delete</button>
        </div>
      `;
      questionsList.appendChild(questionElement);
    });
  };

  // --- EVENT LISTENERS ---
  if (createQuestionBtn) createQuestionBtn.addEventListener('click', () => openDialog());
  if (cancelBtn) cancelBtn.addEventListener('click', () => closeDialog());

  if (saveQuestionBtn) {
    saveQuestionBtn.addEventListener('click', () => {
      const editingId = saveQuestionBtn.getAttribute('data-editing-id');
      editingId ? updateQuestion(editingId) : addQuestion();
    });
  }

  if (questionsList) {
    questionsList.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
        const questionToEdit = questions.find(q => q.id === e.target.dataset.id);
        if (questionToEdit) openDialog(questionToEdit);
      } else if (e.target.classList.contains('delete-btn')) {
        deleteQuestion(e.target.dataset.id);
      }
    });
  }

  if (restoreBtn) {
    restoreBtn.addEventListener('click', () => {
      // Simply clear storage without confirm alerts
      localStorage.removeItem('quizQuestions');
      questions = [];
      renderQuestions();
    });
  }

  if (questionsDialog) {
    // Close modal if clicking outside
    questionsDialog.addEventListener('click', (e) => {
      if (e.target === questionsDialog) closeDialog();
    });
  }

  // --- INITIAL LOAD ---
  loadQuestions();
  renderQuestions();
});
