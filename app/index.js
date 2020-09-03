// Load application styles
import "../assets/styles/index.less";

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
    (currentNumber) => currentNumber < 1 || currentNumber > 25
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
  node.classList.add("trasition-effect");
  node.dataset.value = number;
  node.dataset.absoluteIndex = index;

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
  for (let i = 0; i < nodes.length - 1; i++) {
    let sortCount = 0;

    for (let j = 0; j < nodes.length - 1 - i; j++) {
      const currentNode = nodes[j];
      const nextNode = nodes[j + 1];

      await hightlightNode(currentNode, nextNode);
      sortCount += await compareNode(currentNode, nextNode);
      await unhighlightNode(currentNode, nextNode);
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
    }, 500);
  });
}

function unhighlightNode(currentNode, nextNode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      currentNode.children[0].classList.remove("highlight");
      nextNode.children[0].classList.remove("highlight");
      resolve();
    }, 500);
  });
}

function compareNode(currentNode, nextNode) {
  return new Promise((resolve, reject) => {
    let isSorted = false;
    currentNode.classList.add("trasition-effect");
    nextNode.classList.add("trasition-effect");

    setTimeout(() => {
      if (Number(currentNode.dataset.value) > Number(nextNode.dataset.value)) {
        currentNode.style.transform = "translate(100%)";
        nextNode.style.transform = "translate(-100%)";
        isSorted = true;

        setTimeout(() => {
          $sortingSpace.insertBefore(nextNode, currentNode);
          currentNode.classList.remove("trasition-effect");
          nextNode.classList.remove("trasition-effect");
          currentNode.style.transform = "none";
          nextNode.style.transform = "none";
        }, 500);
      }

      isSorted ? resolve(1) : resolve(0);
    }, 500);
  });
}

function colorizeNode(nodes) {
  nodes.forEach((node, index) => {
    node.children[0].style.backgroundColor = `${colorData[index]}`;
  });
}

function mergeSort(nodes) {
  if (nodes.length < 2) {
    return nodes;
  }

  const sortedGroup = [];
  const middle = Math.floor(nodes.length / 2);
  const leftGroup = mergeSort(nodes.slice(0, middle));
  const rightGroup = mergeSort(nodes.slice(middle));

  mergeSortQueue.push(
    pullDownBar.bind(this, leftGroup.slice(), rightGroup.slice())
  );

  while (leftGroup.length && rightGroup.length) {
    if (
      Number(leftGroup[0].dataset.value) < Number(rightGroup[0].dataset.value)
    ) {
      sortedGroup.push(leftGroup.shift());
    } else {
      sortedGroup.push(rightGroup.shift());
    }
  }

  while (leftGroup.length) {
    sortedGroup.push(leftGroup.shift());
  }
  while (rightGroup.length) {
    sortedGroup.push(rightGroup.shift());
  }

  mergeSortQueue.push(pullUpBar.bind(this, sortedGroup.slice()));
  return sortedGroup;
}

function pullDownBar(leftGroup, rightGroup, currentQueueIndex) {
  const leftGroupColor = leftGroup[0].children[0].style.backgroundColor;

  setTimeout(() => {
    rightGroup.forEach((node, index) => {
      node.children[0].style.backgroundColor = leftGroupColor;
      node.style.top = "50%";
      node.dataset.index = leftGroup.length + index;
    });

    leftGroup.forEach((node, index) => {
      node.style.top = "50%";
      node.dataset.index = index;
    });

    currentQueueIndex++;
    if (currentQueueIndex >= mergeSortQueue.length) return;
    mergeSortQueue[currentQueueIndex](currentQueueIndex);
  }, 1000);
}

function findleftNodesLength(node) {
  let leftNodeCount = 0;

  function find(node) {
    if (!node) return;
    leftNodeCount++;
    find(node.previousSibling);
  }

  find(node.previousSibling);
  return leftNodeCount;
}

function pullUpBar(nodes, currentQueueIndex) {
  let currentIndex = 0;

  const existingFirstNode = nodes.find((node) => node.dataset.index === "0");
  const leftNodesLength = findleftNodesLength(existingFirstNode);

  function pullUpCurrentBar(currentIndex) {
    if (currentIndex >= nodes.length) {
      currentQueueIndex++;
      if (currentQueueIndex >= mergeSortQueue.length) {
        $buttonConfirm.addEventListener("click", checkInputValidation);
        return;
      }
      mergeSortQueue[currentQueueIndex](currentQueueIndex);
      return;
    }

    setTimeout(() => {
      const currentNode = nodes[currentIndex];
      const originalNodeIndex = Number(currentNode.dataset.absoluteIndex);
      const changedNodeIndex = currentIndex + leftNodesLength;
      const difference = 100 * (changedNodeIndex - originalNodeIndex);

      currentNode.style.top = "0%";
      currentNode.style.transform = `translate(${difference}%)`;
      // debugger;
      // console.log(nodes[currentIndex + 1]);
      // console.log(currentNode);
      // $sortingSpace.insertBefore(nodes[currentIndex + 1], currentNode);
      currentIndex++;
      pullUpCurrentBar(currentIndex);
    }, 1000);
  }

  pullUpCurrentBar(currentIndex);
}

function checkSortType() {
  const nodes = $sortingSpace.children;

  if ($selectionBubbleSort.checked) {
    bubbleSort(nodes);
  }

  if ($selectionMergeSort.checked) {
    let index = 0;
    colorizeNode(Array.from(nodes));
    mergeSort(Array.from(nodes));
    mergeSortQueue[index](index);
  }

  $buttonStartSorting.classList.add("display-none");
  $buttonConfirm.removeEventListener("click", checkInputValidation);
}

const mergeSortQueue = [];
$buttonConfirm.addEventListener("click", checkInputValidation);
$buttonStartSorting.addEventListener("click", checkSortType);
