// Load application styles
import "../assets/styles/index.less";
import { checkInputValidation, putDataRandom } from "./dataInput";
import { bubbleSort } from "./bubbleSort";
import { colorizeNode, mergeSort, animationQueue } from "./mergeSort";

const $selectionBubbleSort = document.querySelector("#select-bubble-sort");
const $selectionMergeSort = document.querySelector("#select-merge-sort");
const $sortingSpace = document.querySelector("#sorting-space");
const $buttonConfirm = document.querySelector("#button-confirm");
const $buttonStartSorting = document.querySelector("#button-start");
const $buttonRandom = document.querySelector("#button-random");

function checkSortType() {
  const nodes = $sortingSpace.children;

  if ($selectionBubbleSort.checked) {
    bubbleSort(nodes);
  }

  if ($selectionMergeSort.checked) {
    const nodesArray = Array.from(nodes);

    colorizeNode(nodesArray);
    mergeSort(nodesArray);

    animationQueue[0]();
  }

  $buttonStartSorting.classList.add("display-none");
  $buttonConfirm.removeEventListener("click", checkInputValidation);
  $buttonRandom.removeEventListener("click", putDataRandom);
}

$buttonConfirm.addEventListener("click", checkInputValidation);
$buttonStartSorting.addEventListener("click", checkSortType);
