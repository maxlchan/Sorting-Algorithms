const $inputData = document.querySelector("#input-data");
const $questionDataWrap = document.querySelector("#question-data-wrap");
const $sortingSpace = document.querySelector("#sorting-space");
const $buttonStartSorting = document.querySelector("#button-start");
const $buttonRandom = document.querySelector("#button-random");
let isGuided = false;

function throwGuide(text) {
  if (isGuided) {
    const $guideMessage = document.querySelector(".guide-message");
    $guideMessage.textContent = text;

    return;
  }

  const $guideMessage = document.createElement("p");
  $guideMessage.textContent = text;
  $guideMessage.classList.add("guide-message");
  $buttonStartSorting.classList.add("display-none");

  $questionDataWrap.appendChild($guideMessage);
  isGuided = true;
}

function checkInputValidation() {
  const inputData = $inputData.value.split(",");
  const isLengthRangeOver = inputData.length < 2 || inputData.length > 10;
  const isNumberRangeOver = inputData.some(
    (currentNumber) => Number(currentNumber) < 1 || Number(currentNumber) > 25
  );

  if (!$inputData.value) {
    throwGuide("Put the numbers you want to sort");
    return;
  }

  if (isNaN(inputData.join(""))) {
    throwGuide("Put the 'number' according to the format");
    return;
  }

  if (isLengthRangeOver) {
    throwGuide("Put between 2 and 10 items");
    return;
  }

  if (isNumberRangeOver) {
    throwGuide("Put the number between from 1 and to 25");
    return;
  }

  visualizeData(inputData);
}

function visualizeData(data) {
  if (isGuided) {
    const $guideMessage = document.querySelector(".guide-message");
    $questionDataWrap.removeChild($guideMessage);
    isGuided = false;
  }

  $sortingSpace.innerHTML = "";

  data.forEach((number, index) => {
    const node = createNode(number, index);
    $sortingSpace.appendChild(node);
  });

  $sortingSpace.style.opacity = "100%";
  $buttonStartSorting.classList.remove("display-none");
}

function createNode(number, index) {
  const node = document.createElement("div");
  node.classList.add("node");
  node.classList.add("transition-effect");
  node.dataset.value = number;
  node.dataset.index = index;

  const text = document.createElement("span");
  text.classList.add("node-element");
  text.textContent = number;

  const bar = document.createElement("span");
  bar.classList.add("node-element");
  bar.classList.add("node-bar");
  bar.style.height = `${4 * number}%`;

  node.appendChild(bar);
  node.appendChild(text);

  return node;
}

function putDataRandom() {
  const randomDataNum = Math.ceil(Math.random() * 8) + 1;
  const randomData = Array(randomDataNum)
    .fill(0)
    .map((data) => data + Math.ceil(Math.random() * 24));

  $inputData.value = randomData.join(",");
  visualizeData(randomData);
}

$buttonRandom.addEventListener("click", putDataRandom);

export { checkInputValidation, putDataRandom };
