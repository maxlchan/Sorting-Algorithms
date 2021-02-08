import { checkInput, putDataRandom } from "./dataInput";
import { wait } from "./bubbleSort";

const $buttonConfirm = document.querySelector("#button-confirm");
const $sortingSpace = document.querySelector("#sorting-space");
const $buttonRandom = document.querySelector("#button-random");
const animationQueue = [];
const COLOR_DATA = {
  RED: "#FF5722",
  ORANGE: "#FFC107",
  YELLOW: "#FFEB3B",
  OlIVINE: "#9CCC65",
  GREEN: "#26A69A",
  SKY_BLULE: "#26C6DA",
  BLUE: "#42A5F5",
  INDIGO: "#5C6BC0",
  PURPLE: "#7E57C2",
  LILAC: "#AB47BC",
};
const TIME_GENERAL = 700;
const TIME_CSS_TRANSFORM = 500;
const TIME_END = 1500;

function colorizeNode(nodes) {
  const colorValues = Object.values(COLOR_DATA);

  nodes.forEach((node, index) => {
    const nodeBar = node.children[0];
    nodeBar.style.backgroundColor = `${colorValues[index]}`;
  });
}

function mergeSort(nodes) {
  if (nodes.length < 2) return nodes;

  const sortedGroup = [];
  const middle = Math.floor(nodes.length / 2);
  const leftGroup = mergeSort(nodes.slice(0, middle));
  const rightGroup = mergeSort(nodes.slice(middle));

  animationQueue.push(
    pullDownNodes.bind(this, leftGroup.slice(), rightGroup.slice())
  );

  while (leftGroup.length && rightGroup.length) {
    const isLeftNodelarge =
      Number(leftGroup[0].dataset.value) > Number(rightGroup[0].dataset.value);

    if (isLeftNodelarge) {
      sortedGroup.push(rightGroup.shift());
    } else {
      sortedGroup.push(leftGroup.shift());
    }
  }

  while (leftGroup.length) sortedGroup.push(leftGroup.shift());
  while (rightGroup.length) sortedGroup.push(rightGroup.shift());

  animationQueue.push(pullUpNodes.bind(this, sortedGroup.slice()));

  return sortedGroup;
}

function pullDownNodes(leftGroup, rightGroup) {
  const colorCover = leftGroup[0].children[0].style.backgroundColor;

  setTimeout(() => {
    rightGroup.forEach((node, index) => {
      const nodeBar = node.children[0];

      nodeBar.style.backgroundColor = colorCover;
      node.style.top = "50%";
      node.dataset.index = leftGroup.length + index;
    });

    leftGroup.forEach((node, index) => {
      node.style.top = "50%";
      node.dataset.index = index;
    });

    animationQueue.shift();
    animationQueue[0]();
  }, TIME_GENERAL);
}

function pullUpNodes(group) {
  let initialIndex = 0;

  function pullUpCurrentNode(currentIndex) {
    if (currentIndex >= group.length) {
      changeElementPosition(group);

      return;
    }

    setTimeout(() => {
      const currentNode = group[currentIndex];
      const originalNodeIndex = Number(currentNode.dataset.index);
      const changedNodeIndex = currentIndex;
      const difference = 100 * (changedNodeIndex - originalNodeIndex);

      currentNode.style.top = "0%";
      currentNode.style.transform = `translate(${difference}%)`;

      currentIndex++;

      pullUpCurrentNode(currentIndex);
    }, TIME_GENERAL);
  }

  pullUpCurrentNode(initialIndex);
}

function changeElementPosition(group) {
  setTimeout(() => {
    const lastNode = group[group.length - 1];

    group.forEach((currentNode) => {
      currentNode.classList.remove("trasition-effect");
      currentNode.style.transform = "none";

      $sortingSpace.insertBefore(currentNode, lastNode);

      currentNode.classList.add("trasition-effect");
    });

    animationQueue.shift();

    if (!animationQueue.length) {
      showMergeSortEnd();
      $buttonConfirm.addEventListener("click", checkInput);
      $buttonRandom.addEventListener("click", putDataRandom);

      return;
    }

    animationQueue[0]();
  }, TIME_CSS_TRANSFORM);
}

async function showMergeSortEnd() {
  const nodes = Array.from($sortingSpace.children);

  await wait(TIME_CSS_TRANSFORM);

  nodes.forEach((node) => {
    node.children[0].classList.add("highlight");
  });

  await wait(TIME_END);

  nodes.forEach((node) => {
    node.children[0].classList.remove("highlight");
  });
}

export { colorizeNode, mergeSort, animationQueue };
