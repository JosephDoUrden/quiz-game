// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const shareButton = document.getElementById("share-btn");
const progressBar = document.getElementById("progress");
const timerElement = document.getElementById("time-left");

/**
 * Quiz Application - Portfolio Project
 * Created by: Yusufhan Sacak
 * Version: 1.0.0
 *
 * Features:
 * - Multiple question categories
 * - Difficulty levels
 * - Timed questions with visual feedback
 * - Score analytics
 * - Dynamic confetti celebration
 * - Social sharing capabilities
 */

// Enhanced quiz questions with professional content across multiple categories
const quizData = {
  webDevelopment: [
    {
      question: "Which technology is primarily used for styling web pages?",
      answers: [
        { text: "HTML", correct: false },
        { text: "JavaScript", correct: false },
        { text: "CSS", correct: true },
        { text: "PHP", correct: false },
      ],
      difficulty: "easy",
      category: "Web Development",
      explanation:
        "CSS (Cascading Style Sheets) is the standard technology for styling web pages.",
    },
    {
      question: "What does API stand for in web development?",
      answers: [
        { text: "Application Programming Interface", correct: true },
        { text: "Automated Programming Integration", correct: false },
        { text: "Advanced Programming Implementation", correct: false },
        { text: "Application Process Integration", correct: false },
      ],
      difficulty: "easy",
      category: "Web Development",
      explanation:
        "API stands for Application Programming Interface, which allows different software applications to communicate with each other.",
    },
    {
      question: "Which of these is a JavaScript framework?",
      answers: [
        { text: "Django", correct: false },
        { text: "Flask", correct: false },
        { text: "Ruby on Rails", correct: false },
        { text: "Vue.js", correct: true },
      ],
      difficulty: "medium",
      category: "Web Development",
      explanation:
        "Vue.js is a progressive JavaScript framework for building user interfaces.",
    },
    {
      question: "What is the purpose of responsive web design?",
      answers: [
        { text: "To make websites load faster", correct: false },
        { text: "To adapt to different screen sizes", correct: true },
        { text: "To improve SEO ranking", correct: false },
        { text: "To add animations to websites", correct: false },
      ],
      difficulty: "easy",
      category: "Web Development",
      explanation:
        "Responsive web design ensures websites look good on all devices by adapting to different screen sizes.",
    },
    {
      question:
        "Which technology enables real-time communication between a web client and server?",
      answers: [
        { text: "HTTP", correct: false },
        { text: "WebSockets", correct: true },
        { text: "REST", correct: false },
        { text: "GraphQL", correct: false },
      ],
      difficulty: "hard",
      category: "Web Development",
      explanation:
        "WebSockets provide a persistent connection between client and server for real-time data exchange.",
    },
  ],

  dataScience: [
    {
      question:
        "Which algorithm is NOT commonly used in classification problems?",
      answers: [
        { text: "K-Means", correct: true },
        { text: "Random Forest", correct: false },
        { text: "Support Vector Machine", correct: false },
        { text: "Logistic Regression", correct: false },
      ],
      difficulty: "medium",
      category: "Data Science",
      explanation:
        "K-Means is a clustering algorithm, not a classification algorithm.",
    },
    {
      question: "What does LSTM stand for in deep learning?",
      answers: [
        { text: "Long Short-Term Memory", correct: true },
        { text: "Large Scale Training Model", correct: false },
        { text: "Linear Statistical Transform Method", correct: false },
        { text: "Layered System Training Method", correct: false },
      ],
      difficulty: "hard",
      category: "Data Science",
      explanation:
        "Long Short-Term Memory networks are a type of recurrent neural network capable of learning long-term dependencies.",
    },
    {
      question:
        "Which Python library is primarily used for data visualization?",
      answers: [
        { text: "NumPy", correct: false },
        { text: "Pandas", correct: false },
        { text: "Matplotlib", correct: true },
        { text: "SciPy", correct: false },
      ],
      difficulty: "easy",
      category: "Data Science",
      explanation:
        "Matplotlib is a comprehensive library for creating static, animated, and interactive visualizations in Python.",
    },
  ],

  cybersecurity: [
    {
      question: "What type of attack attempts to exhaust system resources?",
      answers: [
        { text: "Phishing", correct: false },
        { text: "SQL Injection", correct: false },
        { text: "DoS (Denial of Service)", correct: true },
        { text: "Man-in-the-middle", correct: false },
      ],
      difficulty: "medium",
      category: "Cybersecurity",
      explanation:
        "DoS attacks flood systems with traffic to exhaust resources and prevent legitimate users from accessing services.",
    },
    {
      question:
        "Which encryption algorithm is considered most secure as of 2023?",
      answers: [
        { text: "MD5", correct: false },
        { text: "SHA-1", correct: false },
        { text: "DES", correct: false },
        { text: "AES-256", correct: true },
      ],
      difficulty: "hard",
      category: "Cybersecurity",
      explanation:
        "AES-256 (Advanced Encryption Standard with 256-bit key) is currently one of the most secure encryption algorithms available.",
    },
  ],
};

// Combine all questions into a single array
let quizQuestions = [
  ...quizData.webDevelopment,
  ...quizData.dataScience,
  ...quizData.cybersecurity,
];

// Analytics data
let analytics = {
  categoryPerformance: {},
  difficultyPerformance: {},
  averageTimePerQuestion: 0,
  totalTimeTaken: 0,
  questionsAnswered: 0,
};

// QUIZ STATE VARS
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
let timer;
let timeLeft = 15; // Time in seconds for each question
let timerInterval;

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// event listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);
shareButton.addEventListener("click", shareResults);

function startQuiz() {
  // reset vars
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  startScreen.classList.remove("active");
  setTimeout(() => {
    quizScreen.classList.add("active");
    showQuestion();
  }, 300);
}

function showQuestion() {
  // reset state
  answersDisabled = false;
  resetTimer();

  const currentQuestion = quizQuestions[currentQuestionIndex];

  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  questionText.textContent = currentQuestion.question;

  // Update category badge
  const categoryBadge = document.getElementById("current-category");
  if (categoryBadge) {
    categoryBadge.textContent = currentQuestion.category || "General";

    // Adjust position to prevent overlap
    const questionWidth = questionText.offsetWidth;
    const badgeWidth = categoryBadge.offsetWidth;

    if (badgeWidth > questionWidth / 3) {
      categoryBadge.style.top = "-0.5rem";
    } else {
      categoryBadge.style.top = "0.75rem";
    }
  }

  answersContainer.innerHTML = "";

  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.correct = answer.correct;
    button.dataset.index = index;

    // Add letter indicators (A, B, C, D)
    const letterIndicator = document.createElement("span");
    letterIndicator.textContent = String.fromCharCode(65 + index) + ": ";
    letterIndicator.style.marginRight = "8px";
    letterIndicator.style.opacity = "0.7";
    button.prepend(letterIndicator);

    button.addEventListener("click", selectAnswer);

    // Add staggered animation
    button.style.opacity = "0";
    button.style.transform = "translateY(20px)";

    answersContainer.appendChild(button);

    setTimeout(() => {
      button.style.transition = "all 0.3s ease";
      button.style.opacity = "1";
      button.style.transform = "translateY(0)";
    }, 100 * index);
  });

  // Start the timer
  startTimer();
}

function startTimer() {
  timeLeft = 15;
  timerElement.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 5) {
      timerElement.style.color = "#f72585";
    } else {
      timerElement.style.color = "";
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeOut();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerElement.style.color = "";
}

function timeOut() {
  answersDisabled = true;

  // Show correct answer when time runs out
  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
  });

  setTimeout(() => {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1500);
}

function selectAnswer(event) {
  // optimization check
  if (answersDisabled) return;

  answersDisabled = true;
  resetTimer();

  const selectedButton = event.target.closest(".answer-btn");
  const isCorrect = selectedButton.dataset.correct === "true";

  // Here we use querySelectorAll to get all buttons
  answersContainer.querySelectorAll(".answer-btn").forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }

    // Disable hover effects
    button.style.pointerEvents = "none";
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;

    // Add visual feedback for correct answer
    createConfetti(selectedButton);
  }

  setTimeout(() => {
    currentQuestionIndex++;

    // Update progress bar immediately for smoother transition
    const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
    progressBar.style.width = progressPercent + "%";

    // check if there are more questions or if the quiz is over
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1500);
}

function createConfetti(button) {
  // Create 30 confetti particles
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    const size = Math.random() * 8 + 4;

    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.position = "absolute";
    confetti.style.borderRadius = "50%";
    confetti.style.zIndex = "1000";

    // Position relative to the button
    const rect = button.getBoundingClientRect();
    const containerRect = quizScreen.getBoundingClientRect();

    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top + rect.height / 2;

    confetti.style.left = `${x}px`;
    confetti.style.top = `${y}px`;

    quizScreen.appendChild(confetti);

    // Animate the confetti
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 5 + 3;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    animate(confetti, vx, vy, 0, 0.1, 1);
  }
}

function animate(confetti, vx, vy, rotation, gravity, opacity) {
  let x = parseInt(confetti.style.left);
  let y = parseInt(confetti.style.top);

  x += vx;
  y += vy;
  vy += gravity;
  opacity -= 0.02;
  rotation += 5;

  confetti.style.left = `${x}px`;
  confetti.style.top = `${y}px`;
  confetti.style.opacity = opacity;
  confetti.style.transform = `rotate(${rotation}deg)`;

  if (opacity > 0) {
    requestAnimationFrame(() =>
      animate(confetti, vx, vy, rotation, gravity, opacity)
    );
  } else {
    confetti.remove();
  }
}

function getRandomColor() {
  const colors = [
    "#4361ee",
    "#3f8efc",
    "#4cc9f0",
    "#f72585",
    "#7209b7",
    "#3a0ca3",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function showResults() {
  resetTimer();
  quizScreen.classList.remove("active");
  setTimeout(() => {
    resultScreen.classList.add("active");

    finalScoreSpan.textContent = score;

    const percentage = (score / quizQuestions.length) * 100;

    if (percentage === 100) {
      resultMessage.textContent = "Outstanding! You're a true expert!";
    } else if (percentage >= 80) {
      resultMessage.textContent = "Great job! Excellent knowledge!";
    } else if (percentage >= 60) {
      resultMessage.textContent = "Good effort! Keep improving!";
    } else if (percentage >= 40) {
      resultMessage.textContent = "Not bad! More practice will help!";
    } else {
      resultMessage.textContent = "Keep learning! You'll get better!";
    }
  }, 300);
}

function restartQuiz() {
  resultScreen.classList.remove("active");
  setTimeout(() => {
    startQuiz();
  }, 300);
}

function shareResults() {
  const text = `I scored ${score} out of ${quizQuestions.length} on QuizMaster Pro! Can you beat my score?`;

  // Check if Web Share API is available
  if (navigator.share) {
    navigator
      .share({
        title: "My QuizMaster Pro Results",
        text: text,
        url: window.location.href,
      })
      .catch((err) => {
        console.log("Error sharing:", err);
        fallbackShare(text);
      });
  } else {
    fallbackShare(text);
  }
}

function fallbackShare(text) {
  // Fallback for browsers that don't support Web Share API
  alert("Share this result:\n\n" + text);
}
