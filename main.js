let categoryElement = document.querySelector(".header .category span");
let answerElement = document.querySelectorAll(".question-box .answers .answer");
let nextBtnElement = document.querySelector(".question-box button.next");
let score = 0;
let scoreElement = document.querySelector(".details-side .score span");
let questionsNumber = 1;
let questionsNumberElement = document.querySelector(
  ".details-side .quiz-number .current"
);
let randomArray = [];
let LS = window.localStorage;
let answers = document.querySelectorAll(".question-box .answer");
let spans = document.querySelectorAll(".spans span");
let minE = document.querySelector(".countdown .min");
let secE = document.querySelector(".countdown .sec");
let correctSound = document.querySelector(".correct-sound");
let wrongSound = document.querySelector(".wrong-sound");
LS.setItem("category", "Programming");
categoryElement.innerHTML = LS.getItem("category");
let copyrightDateElement = document.querySelector(".copyright .time");
let copyrightDate = new Date();
function getData() {
  let data = new XMLHttpRequest();
  data.open("GET", "./questions.json");
  data.send();
  data.onreadystatechange = () => {
    if (data.readyState === 4 && data.status === 200) {
      let dataJson = JSON.parse(data.responseText);
      let categoryNames = Object.keys(dataJson);
      // call function to create the categories list and change the category.
      createCategorySelection(categoryNames, dataJson);
      // click the category element to change the category again.
      let correctAnswer = chooseRandomQuestion(dataJson);
      categoryElement.onclick = () => {
        getDefaultValues(answers, categoryNames, dataJson);
        createCategorySelection(categoryNames, dataJson);
      };
      // check if click on any answer make the next button abel to click.
      answerElement.forEach((ans) => {
        ans.onclick = () => {
          nextBtnElement.removeAttribute("disabled");
        };
      });
      // checked the answer if correct or not when click the button.
      nextBtnElement.onclick = () => {
        nextBtn(correctAnswer, dataJson, categoryNames);
      };
      copyrightDateElement.innerHTML = copyrightDate.getFullYear();
    }
  };
}
getData();
// to sort the answers different every time.
function randomAnswers(answers) {
  let answersList = [];
  let answersNumber = Object.keys(answers).length;
  while (answersList.length < 4) {
    let random = Math.floor(Math.random() * answersNumber);
    if (!answersList.includes(random)) {
      answersList.push(random);
    }
  }
  for (let i = 0; i < answersList.length; i++) {
    answerElement[i].lastElementChild.innerHTML = answers[`Answer-${i + 1}`];
    answerElement[i].firstElementChild.setAttribute("value", i + 1);
  }
}
// countdown function to count down.
let countdown;
function countDown(categoryNames, dataJson) {
  clearInterval(countdown);
  countdown = setInterval(() => {
    secE.innerHTML -= 1;
    if (secE.textContent === "0" && minE.innerHTML > 0) {
      minE.innerHTML -= 1;
      secE.innerHTML = 30;
    } else if (secE.textContent === "0" && minE.innerHTML === "0") {
      clearInterval(countdown);
      popUpFinish(categoryNames, dataJson);
    }
  }, 1000);
}
// the action for button when clicking on.
function nextBtn(correctAnswer, dataJson, categoryNames) {
  nextBtnElement.innerHTML = "Next";
  answers.forEach((ans) => {
    if (ans.firstElementChild.checked) {
      if (ans.lastElementChild.textContent === correctAnswer) {
        correctSound.play();
        // add correct effect for the answer.
        ans.classList.add("correct");
        // prevent the click abelety to the choices.
        answers.forEach((ans) => {
          ans.firstElementChild.setAttribute("disabled", "");
        });
        // add one to score.
        score++;
        scoreElement.innerHTML = score;
        nextBtnElement.onclick = () => {
          correctAnswer = chooseRandomQuestion(dataJson);
          getDefaultValues(answers, categoryNames, dataJson);
          nextBtnElement.onclick = () => {
            nextBtn(correctAnswer, dataJson, categoryNames);
          };
        };
      } else {
        wrongSound.play();
        ans.classList.add("wrong");
        answers.forEach((ans) => {
          if (ans.lastElementChild.textContent === correctAnswer) {
            ans.classList.add("correct");
          }
          ans.firstElementChild.setAttribute("disabled", "");
          nextBtnElement.onclick = () => {
            correctAnswer = chooseRandomQuestion(dataJson);
            getDefaultValues(answers, categoryNames, dataJson);
            nextBtnElement.onclick = () => {
              nextBtn(correctAnswer, dataJson, categoryNames);
            };
          };
        });
      }
    }
  });
}
// the pop up element that should be appearing when the question finished to give us the details.
function popUpFinish(categoryNames, dataJson) {
  let overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);
  let popup = document.createElement("div");
  popup.className = "popup";
  let popupH = document.createElement("h1");
  popupH.className = "popupH";
  popupH.innerHTML =
    score == 10
      ? "Excellent"
      : score > 8
      ? "Very Good"
      : score >= 5
      ? "Good"
      : score < 5
      ? "Bad"
      : "";
  popup.appendChild(popupH);
  let popuptext = document.createElement("p");
  popuptext.className = "popuptext";
  popuptext.innerHTML = `you answered ${score} from 10 questions.`;
  popup.appendChild(popuptext);
  let popupBtn = document.createElement("button");
  popupBtn.className = "popupBtn";
  popupBtn.innerHTML = "New Game";
  popup.appendChild(popupBtn);
  document.body.appendChild(popup);
  popupBtn.onclick = () => {
    popup.remove();
    overlay.remove();
    createCategorySelection(categoryNames, dataJson);
  };
}
// to give us the default values when calling it.
function getDefaultValues(answers, categoryNames, dataJson) {
  if (questionsNumber === 10) {
    popUpFinish(categoryNames, dataJson);
    spans[questionsNumber - 1].classList.remove("active");
    spans[questionsNumber - 1].classList.add("deal");
  } else {
    questionsNumber++;
    questionsNumberElement.innerHTML = questionsNumber;
    spans[questionsNumber - 2].classList.remove("active");
    spans[questionsNumber - 2].classList.add("deal");
    spans[questionsNumber - 1].classList.add("active");
  }
  answers.forEach((ans) => {
    ans.classList.remove("correct");
    ans.classList.remove("wrong");
    ans.firstElementChild.removeAttribute("checked");
    ans.firstElementChild.removeAttribute("disabled");
    ans.firstElementChild.checked = false;
    nextBtnElement.setAttribute("disabled", "");
    nextBtnElement.innerHTML = "Check";
  });
}
// to choose random question every time.
function chooseRandomQuestion(dataJson) {
  let questionElement = document.querySelector(".question-box .question");
  let category = LS.getItem("category");
  let questions = dataJson[category];
  let randomNumber = Math.round(Math.random() * (questions.length - 1));
  randomArray.includes(randomNumber)
    ? chooseRandomQuestion(dataJson)
    : randomArray.push(randomNumber);
  let question = questions[randomNumber];
  let myQuestion = question["Question"];
  questionElement.innerHTML = myQuestion;
  let answers = question["Answers"];
  let correctAnswer = question["Correct-answer"];
  randomAnswers(answers);
  return correctAnswer;
}
// function to change the category
function createCategorySelection(categoryNames, dataJson) {
  let overlay = document.createElement("div");
  overlay.className = "overlay";
  let items = document.createElement("div");
  items.className = "items";
  let heading = document.createElement("div");
  heading.className = "heading";
  heading.innerHTML = "Quiz Game";
  items.appendChild(heading);
  let box = document.createElement("div");
  box.className = "box";
  categoryNames.forEach((category) => {
    let item = document.createElement("div");
    item.className = `item ${category}`;
    item.innerHTML = category;
    box.appendChild(item);
  });
  items.appendChild(box);
  document.body.appendChild(items);
  document.body.appendChild(overlay);
  document.querySelectorAll(".items .box .item").forEach((item) => {
    item.addEventListener("click", () => {
      score = 0;
      scoreElement.innerHTML = score;
      questionsNumber = 1;
      questionsNumberElement.innerHTML = questionsNumber;
      minE.innerHTML = "5";
      secE.innerHTML = "01";
      countDown(categoryNames, dataJson);
      spans.forEach((span) => {
        span.classList.remove("deal");
        span.classList.remove("active");
      });
      spans[0].classList.add("active");
      LS.setItem("category", item.textContent);
      categoryElement.innerHTML = LS.getItem("category");
      items.remove();
      overlay.remove();
      let correctAnswer = chooseRandomQuestion(dataJson);
      nextBtnElement.onclick = () => {
        nextBtn(correctAnswer, dataJson, categoryNames);
      };
    });
  });
}
