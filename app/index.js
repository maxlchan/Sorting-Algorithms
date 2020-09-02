// Load application styles
import "../assets/styles/index.less";
import { reject } from "lodash";

const $buttonConfirm = document.querySelector("#button-confirm");
const $inputData = document.querySelector("#input-data");
const $questionDataWrap = document.querySelector("#question-data-wrap");
const $selectionBubbleSort = document.querySelector("#select-bubble-sort");
const $selectionMergeSort = document.querySelector("#select-merge-sort");
const $sortingSpace = document.querySelector("#sorting-space");
const $buttonStartSorting = document.querySelector("#button-start");
const colorData = [
  "#FF5722",
  "#FFC107",
  "#FFEB3B",
  "#9CCC65",
  "#26A69A",
  "#26C6DA",
  "#42A5F5",
  "#5C6BC0",
  "#7E57C2",
  "#AB47BC",
];
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
  if (!$inputData.value) {
    throwGuide("Put the numbers you want to sort");
    return;
  }

  const inputData = $inputData.value.split(",");

  if (isNaN(inputData.join(""))) {
    throwGuide("Put the 'number' according to the format");
    return;
  }

  const isOverRange = inputData.some(
    (currentNumber) => +currentNumber < 1 || +currentNumber > 25
  );

  if (isOverRange) {
    throwGuide("Put the number from 1 and to 25");
    return;
  }

  if (inputData.length > 10) {
    throwGuide("Put 10 or fewer items to be sorted");
    return;
  }

  visualizeData(inputData);
}

function visualizeData(data) {
  if (isGuided) {
    const $guideMessage = document.querySelector(".guide-message");
    $guideMessage.parentNode.removeChild($guideMessage);
    isGuided = false;
  }

  $sortingSpace.innerHTML = "";

  data.forEach((number) => {
    const node = createNode(number);
    $sortingSpace.appendChild(node);
  });

  $sortingSpace.style.opacity = "100%";
  $buttonStartSorting.classList.remove("display-none");
}

function createNode(number) {
  const node = document.createElement("div");
  node.classList.add("node");
  node.dataset.value = number;

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

async function bubbleSort(nodes) {
  // nodes = Array.from(nodes);         <------- 이 부분입니다 켄님!!!! 늘 고생이 많으십니다!!!!
  // debugger;
  for (let i = 0; i < nodes.length - 1; i++) {
    let sortCount = 0;

    for (let j = 0; j < nodes.length - 1 - i; j++) {
      const currentNumber = nodes[j];
      const nextNode = nodes[j + 1];

      await hightlightNode(currentNumber, nextNode);
      sortCount += await compareNode(currentNumber, nextNode);
      await unhighlightNode(currentNumber, nextNode);
    }

    if (!sortCount) break;
  }

  $buttonConfirm.addEventListener("click", checkInputValidation);
}

function hightlightNode(currentNode, nextNode) {
  return new Promise((resolve, reject) => {
    const currentBar = currentNode.children[0];
    const nextBar = nextNode.children[0];

    setTimeout(() => {
      currentBar.classList.add("highlight");
      nextBar.classList.add("highlight");
      resolve();
    }, 700);
  });
}

function unhighlightNode(currentNode, nextNode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      currentNode.children[0].classList.remove("highlight");
      nextNode.children[0].classList.remove("highlight");
      resolve();
    }, 700);
  });
}

function compareNode(currentNode, nextNode) {
  return new Promise((resolve, reject) => {
    let isSorted = false;

    setTimeout(() => {
      if (+currentNode.dataset.value > +nextNode.dataset.value) {
        $sortingSpace.insertBefore(nextNode, currentNode);
        isSorted = true;
      }

      isSorted ? resolve(1) : resolve(0);
    }, 700);
  });
}

function colorizeNode(nodes) {
  nodes.forEach((node, index) => {
    node.children[0].style.backgroundColor = `${colorData[index]}`;
  });
}

async function mergeSort(nodes) {
  if (nodes.length < 2) {
    return nodes;
  }
  const sortedGroup = [];
  const middle = Math.floor(nodes.length / 2);
  const leftGroup = await mergeSort(nodes.slice(0, middle));
  const rightGroup = await mergeSort(nodes.slice(middle));
  console.log(leftGroup[0]);
  await down(leftGroup[0], rightGroup[0]);
  while (leftGroup.length && rightGroup.length) {
    if (+leftGroup[0].dataset.value < +rightGroup[0].dataset.value) {
      sortedGroup.push(leftGroup.shift());
    } else {
      sortedGroup.push(rightGroup.shift());
    }
  }

  while (leftGroup.length) sortedGroup.push(leftGroup.shift());
  while (rightGroup.length) sortedGroup.push(rightGroup.shift());

  return sortedGroup;
}

function down(left, right) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      right.children[0].style.backgroundColor = left.children[0].style.backgroundColor;
      left.style.top = "50%";
      right.style.top = "50%";
    }, 1000);

  });
}

function checkSortType() {
  const nodes = $sortingSpace.children;

  if ($selectionBubbleSort.checked) {
    bubbleSort(nodes);
  }

  if ($selectionMergeSort.checked) {
    colorizeNode(Array.from(nodes));
    mergeSort(Array.from(nodes));
  }

  $buttonStartSorting.classList.add("display-none");
  $buttonConfirm.removeEventListener("click", checkInputValidation);
}

$buttonConfirm.addEventListener("click", checkInputValidation);
$buttonStartSorting.addEventListener("click", checkSortType);
