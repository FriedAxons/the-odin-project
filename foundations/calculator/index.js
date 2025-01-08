// Get all buttons and the display element
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".button");

let firstNum = null;
let secondNum = null;
let operator = null;
let waitingForSecondNumber = false;

// Functions for basic operations
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Error"; // Avoid division by zero
  }
  return a / b;
}

// Function to perform the operation
function operate(operator, a, b) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      return "Invalid operator";
  }
}

// Event listener for button clicks
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const buttonText = e.target.textContent;

    // Handle number buttons
    if (!isNaN(buttonText)) {
      if (waitingForSecondNumber) {
        display.value = buttonText; // Start fresh with the second number
        waitingForSecondNumber = false; // Stop waiting for second number
      } else {
        display.value += buttonText; // Append to the display for the first or second number
      }
    }
    // Handle operator buttons
    else if (
      buttonText === "+" ||
      buttonText === "-" ||
      buttonText === "*" ||
      buttonText === "/"
    ) {
      if (firstNum === null) {
        // First number and operator are entered
        firstNum = parseFloat(display.value); // Save the first number
        operator = buttonText; // Save the operator
        waitingForSecondNumber = true; // Now waiting for the second number
      } else if (waitingForSecondNumber) {
        operator = buttonText; // Update the operator without evaluating yet
      } else {
        secondNum = parseFloat(display.value); // Save the second number
        firstNum = operate(operator, firstNum, secondNum); // Perform the operation
        if (firstNum === "Error") {
          display.value = "Error";
          firstNum = null;
          operator = null;
          secondNum = null;
          waitingForSecondNumber = false;
          return;
        }
        firstNum = parseFloat(firstNum.toFixed(2)); // Round the result to 2 decimal places
        display.value = firstNum; // Display the result
        operator = buttonText; // Save the new operator
        secondNum = null; // Reset the second number
        waitingForSecondNumber = true; // Ready to enter a new second number
      }
    }
    // Handle equals button
    else if (buttonText === "=") {
      if (firstNum !== null && operator !== null && !waitingForSecondNumber) {
        secondNum = parseFloat(display.value); // Get the second number from the display
        firstNum = operate(operator, firstNum, secondNum); // Perform the operation
        if (firstNum === "Error") {
          display.value = "Error";
          firstNum = null;
          operator = null;
          secondNum = null;
          waitingForSecondNumber = false;

          // Disable all number and operator buttons
          buttons.forEach((button) => {
            if (
              !isNaN(button.textContent) ||
              button.textContent === "+" ||
              button.textContent === "-" ||
              button.textContent === "*" ||
              button.textContent === "/" ||
              button.textContent === "." ||
              button.textContent === "="
            ) {
              button.disabled = true;
            }
          });

          return; // Stop further code execution
        }
        firstNum = parseFloat(firstNum.toFixed(2)); // Round to 2 decimals
        display.value = firstNum; // Show the result
        operator = null; // Clear operator
        secondNum = null; // Clear second number
        waitingForSecondNumber = true; // Allow new operations
      } else if (firstNum !== null && operator !== null && secondNum === null) {
        // If second number is still null, just show the first number
        display.value = firstNum;
      }
    }
    // Handle clear button
    else if (buttonText === "C") {
      firstNum = null;
      secondNum = null;
      operator = null;
      display.value = ""; // Clear the display
      waitingForSecondNumber = false;

      // Re-enable all buttons
      buttons.forEach((button) => {
        button.disabled = false;
      });
    }
    // Handle decimal point button
    else if (buttonText === ".") {
      if (!display.value.includes(".")) {
        display.value += "."; // Add a decimal point if not already present
      }
    }
  });
});
