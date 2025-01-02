let countspan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets .spans");
let quizarea = document.querySelector(".quiz-area");
let answers = document.querySelector(".answers-area");
let submit = document.querySelector(".submit-button");
let countdown = document.querySelector(".countdown");
let currentindex = 0;
let correctanswers = 0;

function getquetions() {
  let myrequest = new XMLHttpRequest();
  myrequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let questionsobject = JSON.parse(this.responseText);
      let questionscount = questionsobject.length;
      createbullets(questionscount);
      addquestion(questionsobject[currentindex], questionscount);
      submit.onclick = () => {
        let correctanswer = questionsobject[currentindex].correct_answer;
        currentindex++;
        checkanswer(questionscount, correctanswer);
        setTimeout(() => {
          quizarea.innerHTML = "";
          answers.innerHTML = "";
          countspan.innerHTML -= 1;
          addquestion(questionsobject[currentindex], questionscount);
          activebullets();
          showresults(questionscount);
        }, 2000);
      };
    }
  };
  myrequest.open("GET", "html-questions.json", true);
  myrequest.send();
}

getquetions();

function createbullets(num) {
  countspan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    bullets.appendChild(span);
    if (i == 0) {
      span.classList.add("active");
    }
  }
}

function addquestion(obj, count) {
  if (currentindex < count) {
    let question = document.createElement("h2");
    question.innerHTML = obj.question;
    quizarea.appendChild(question);
    for (let i = 1; i <= 4; i++) {
      let answersplace = document.createElement("div");
      answersplace.className = "answer";
      let radioinput = document.createElement("input");
      radioinput.type = "radio";
      radioinput.id = `answer_${i}`;
      radioinput.name = "questions";
      radioinput.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        radioinput.checked = true;
      }
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      label.innerHTML = obj[`answer_${i}`];
      answersplace.appendChild(radioinput);
      answersplace.appendChild(label);
      answers.appendChild(answersplace);
    }
  }
}

function checkanswer(count, correctanswer) {
  let answers = document.getElementsByName("questions");
  let choosenanswer;
  for (let i = 0; i < answers.length; i++) {
    choosenanswer = answers[i].dataset.answer;
    if (answers[i].checked) {
      if (correctanswer === choosenanswer) {
        answers[i].parentElement.classList.add("correct");
        correctanswers++;
      } else {
        answers[i].parentElement.classList.add("wrong");
        for (let j = 0; j < answers.length; j++) {
          if (answers[j].dataset.answer === correctanswer) {
            answers[j].parentElement.classList.add("correct");
          }
        }
      }
    }
  }
}

function activebullets() {
  let bulletsspans = document.querySelectorAll(".bullets .spans span");
  bulletsspans.forEach((span, i) => {
    if (currentindex === i) {
      span.classList.add("active");
    }
  });
}

function showresults(count) {
  if (correctanswers === count) {
    quizarea.remove();
    submit.remove();
    bullets.remove();
    countdown.remove();
    let results = document.createElement("div");
    results.className = "results";
    let h = document.createElement("h3");
    h.innerHTML = `جامد فشخ ${correctanswers}  من ${count}`;
    results.appendChild(h);
    answers.appendChild(results);
  }
}
