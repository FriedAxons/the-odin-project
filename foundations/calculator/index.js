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
    } else if (buttonText === "➔") {
      // Handle backspace button
      display.value = display.value.slice(0, -1); // Remove the last character
      if (display.value === "") {
        display.value = "";
      }
    }
  });
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  const key = e.key;

  console.log(`Key pressed: ${key}`); // Debugging key press

  if (key === "c" || key === "C") {
    // Clear the display and re-enable buttons
    firstNum = null;
    secondNum = null;
    operator = null;
    display.value = ""; // Clear the display
    waitingForSecondNumber = false;

    // Re-enable all buttons
    enableButtons();
  }
  // If the display has "Error", disable further key inputs, but allow "C" to reset everything
  else if (display.value === "Error") {
    if (key === "c" || key === "C") {
      // Clear the display and re-enable buttons
      firstNum = null;
      secondNum = null;
      operator = null;
      display.value = ""; // Clear the display
      waitingForSecondNumber = false;

      // Re-enable all buttons
      enableButtons();
    }
    return; // Prevent further input if "Error" is shown unless it's the "C" key
  }

  // Handle number keys
  if (!isNaN(key)) {
    // If waiting for the second number, reset the display
    if (waitingForSecondNumber) {
      display.value = key;
      waitingForSecondNumber = false;
    } else {
      display.value += key; // Append number to the display
    }
  }
  // Handle operator keys
  else if (key === "+" || key === "-" || key === "*" || key === "/") {
    if (firstNum === null) {
      // If first number hasn't been entered yet, save it
      firstNum = parseFloat(display.value);
      operator = key;
      waitingForSecondNumber = true;
    } else if (waitingForSecondNumber) {
      // If we're waiting for the second number, update the operator
      operator = key;
    } else {
      // If both numbers have been entered, calculate and update display
      secondNum = parseFloat(display.value);
      firstNum = operate(operator, firstNum, secondNum);

      // Handle error case
      if (firstNum === "Error") {
        display.value = "Error";
        firstNum = null;
        operator = null;
        secondNum = null;
        waitingForSecondNumber = false;

        // Disable all number and operator buttons
        disableButtons();

        return; // Stop further code execution
      }

      // Round and update display
      firstNum = parseFloat(firstNum.toFixed(2));
      display.value = firstNum;
      operator = key;
      secondNum = null;
      waitingForSecondNumber = true;
    }
  }
  // Handle equals key (Enter key)
  else if (key === "Enter" || key === "=") {
    if (firstNum !== null && operator !== null && !waitingForSecondNumber) {
      secondNum = parseFloat(display.value);
      firstNum = operate(operator, firstNum, secondNum);

      // Handle error case
      if (firstNum === "Error") {
        display.value = "Error";
        firstNum = null;
        operator = null;
        secondNum = null;
        waitingForSecondNumber = false;

        // Disable all number and operator buttons
        disableButtons();

        return; // Stop further code execution
      }

      firstNum = parseFloat(firstNum.toFixed(2));
      display.value = firstNum;
      operator = null;
      secondNum = null;
      waitingForSecondNumber = true;
    } else if (firstNum !== null && operator !== null && secondNum === null) {
      display.value = firstNum; // If no second number, just show the first number
    }
  }
  // Handle backspace key
  else if (key === "Backspace") {
    display.value = display.value.slice(0, -1);
    if (display.value === "") {
      display.value = "";
    }
  }
  // Handle decimal point
  else if (key === ".") {
    if (!display.value.includes(".")) {
      display.value += "."; // Add decimal if not present
    }
  }
});

// Function to disable all number and operator buttons
function disableButtons() {
  const buttons = document.querySelectorAll(".button");
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
}

// Function to enable all number and operator buttons
function enableButtons() {
  const buttons = document.querySelectorAll(".button");
  buttons.forEach((button) => {
    button.disabled = false;
  });
}
