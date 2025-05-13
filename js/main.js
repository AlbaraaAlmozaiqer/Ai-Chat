let sideNavigation = document.querySelector(".sideNavigation");
let sideBarToggle = document.querySelector(".fa-bars");
let startContentUl = document.querySelector(".startContent ul");
let inputArea = document.querySelector(".inputArea input");
let sendRequest = document.querySelector(".fa-paper-plane");
let chatHistory = document.querySelector(".chatHistory ul");
let startContent = document.querySelector(".startContent");
let chatContent = document.querySelector(".chatContent");
let results = document.querySelector(".results");

let promptQuestion = [
  {
    question: "Write a thank you note to my subscribers",
    icon: "fa-solid fa-wand-magic-sparkles",
  },
  {
    question: "Write a Sample Code to learn JavaScript",
    icon: "fa-solid fa-code",
  },
  {
    question: "How to become a Full Stack Developer",
    icon: "fa-solid fa-laptop-code",
  },
  {
    question: "How to become a Front-end Developer",
    icon: "fa-solid fa-database",
  },
];

window.addEventListener("load", function () {
  promptQuestion.forEach((data) => {
    let item = document.createElement("li");
    item.addEventListener("click", () => {
      getGeminiResponse(data.question, true);
    });
    item.innerHTML = `<div class="promptSuggestion">
        <p>${data.question}</p>
        <div class="icon"><i class="${data.icon}"></i></div>
        </div>`;

    startContentUl.append(item);
  });
});

sideBarToggle.addEventListener("click", () => {
  sideNavigation.classList.toggle("expandClose");
});

inputArea.addEventListener("keyup", (e) => {
  if (e.target.value.length > 0) {
    sendRequest.style.display = "inline";
  } else {
    sendRequest.style.display = "none";
  }
});

sendRequest.addEventListener("click", function () {
  getGeminiResponse(inputArea.value, true);
  console.log(inputArea.value)
});
function getGeminiResponse(question, appendHistory) {
  if(appendHistory){
  let historyLi = document.createElement("li");
  historyLi.addEventListener("click", function(e) {
    getGeminiResponse(question, false);
  });
  historyLi.innerHTML = `<i class="fa-regular fa-message"></i>${question}`;
  chatHistory.append(historyLi);
  }
  results.innerHTML = "";
  inputArea.value = "";
  startContent.style.display = "none";
  chatContent.style.display = "block";

  let resultsTitle = `<div class="resultsTitle">
        <img src="./img/IMG_9933 (1)Post.jpg"/>
        <p>${question}</p>
    </div> `;

  let resultsData = `<div class="resultsData">
      <img src="./img/sparkling_6742248.png"/>
      <div class="loader">
        <div class="animatedBG"></div>
        <div class="animatedBG"></div>
        <div class="animatedBG"></div>
      </div>
    </div>`;

  results.innerHTML += resultsTitle;
  results.innerHTML += resultsData;

  let AIURL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAX_MJbdro9vUvqcps73vBBQ_5vgX9NeaI";
  fetch(AIURL, {
    method: "POST",
    body: JSON.stringify({
      contents: [{ parts: [{ text: question }] }],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(".results .resultsData").remove();

      let responseData = jsonEscape(data.candidates[0].content.parts[0].text);
      console.log(responseData);
      let responseArray = responseData.split("**");
      let newResponse = "";

      for (let i = 0; i < responseArray.length; i++) {
        if (i == 0 || i%2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<strong>" + responseArray[i] + "</strong>";
        }
        
      }

      results.innerHTML += `
      <div class="resultResponse">
        <img src="./img/sparkling_6742248.png"/>
        <p id="typeEffect">${newResponse}</p>
      </div>`;
    }).catch(error => {
      results.innerHTML += 'Error: '

    });
    
}

function newChat() {
  startContent.style.display = "block";
  chatContent.style.display = "none";
}


function jsonEscape(str) {
  return str.replace(new RegExp("\r?\n\n", "g"), "<br>")
  .replace(new RegExp("\r?\n", "g"), "<br>");
}