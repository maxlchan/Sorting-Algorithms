import { checkInput, putDataRandom } from "./dataInput";

const $buttonConfirm = document.querySelector("#button-confirm");
const $buttonRandom = document.querySelector("#button-random");
const $sortingSpace = document.querySelector("#sorting-space");
const TIME_GENERAL = 600;
const TIME_CSS_TRANSFORM = 500;
const TIME_END = 1500;
const RATE_POSITION_CHANGE = "100%";

async function bubbleSort(nodes) {
  for (let i = 0; i < nodes.length - 1; i++) {
    let sortCount = 0;

    for (let j = 0; j < nodes.length - 1 - i; j++) {
      const leftNode = nodes[j];
      const rightNode = nodes[j + 1];
      const isLeftLarge = Number(leftNode.dataset.value) > Number(rightNode.dataset.value);

      hightlightNode(leftNode, rightNode);
      await wait(TIME_GENERAL);

      if (isLeftLarge) {
        await wait(TIME_GENERAL);
        changeVisualPoistion(leftNode, rightNode);
        await wait(TIME_CSS_TRANSFORM);
        changeDomPoistion(leftNode, rightNode);

        sortCount++;
      }

      await wait(TIME_GENERAL);
      unhighlightNode(leftNode, rightNode);
      await wait(TIME_GENERAL);
    }

    if (!sortCount) break;
  }

  showBubbleSortEnd();
  $buttonConfirm.addEventListener("click", checkInput);
  $buttonRandom.addEventListener("click", putDataRandom);
}

function hightlightNode(leftNode, rightNode) {
  const leftBar = leftNode.children[0];
  const rightBar = rightNode.children[0];

  leftBar.classList.add("highlight");
  rightBar.classList.add("highlight");
}

function changeVisualPoistion(leftNode, rightNode) {
  leftNode.style.transform = `translate(${RATE_POSITION_CHANGE})`;
  rightNode.style.transform = `translate(-${RATE_POSITION_CHANGE}`;
}

function changeDomPoistion(leftNode, rightNode) {
  leftNode.classList.remove("transition-effect");
  rightNode.classList.remove("transition-effect");
  leftNode.style.transform = "none";
  rightNode.style.transform = "none";
  $sortingSpace.insertBefore(rightNode, leftNode);
}

function unhighlightNode(leftNode, rightNode) {
  leftNode.classList.add("transition-effect");
  rightNode.classList.add("transition-effect");
  leftNode.children[0].classList.remove("highlight");
  rightNode.children[0].classList.remove("highlight");
}

async function showBubbleSortEnd() {
  const nodes = Array.from($sortingSpace.children);

  nodes.forEach( node => {
    node.children[0].classList.add("highlight");
  })

  await wait(TIME_END);

  nodes.forEach( node => {
    node.children[0].classList.remove("highlight");
  })
}

function wait(timeType) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeType);
  });
}

export { bubbleSort, wait };
