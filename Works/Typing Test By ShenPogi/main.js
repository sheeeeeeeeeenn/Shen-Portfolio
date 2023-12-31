let text_samples_arr = [
  "Push yourself, because no one else is going to do it for you.",
  "Failure is the condiment that gives success its flavor.",
  "Wake up with determination. Go to bed with satisfaction.",
  "It's going to be hard, but hard does not mean impossible.",
  "Learning never exhausts the mind.",
  "The only way to do great work is to love what you do.",
];

let time_text = document.querySelector(".time");
let wpm_text = document.querySelector(".wpm");
let acc_text = document.querySelector(".accuracy");
let act_text = document.querySelector(".text");
let inp_area = document.querySelector(".inp_box");

document.addEventListener("keydown", (e) => {
  if (e.key === "Control") {
    startTest();
    inp_area.focus();
  }
});

const TIME_LIMIT = 25;

let timeElapsed = 0;
let timeLeft = TIME_LIMIT;
let errors = 0;
let charactersTyped = 0;
let wordsTyped = 0;
let currentText = "";
let textNo = 0;
let userTypedInput;
let userTypedInputArr;
let actTextArr;
let totalErrors = 0;
let timer = null;
let wpm = 0;
let accuracy = 0;
let accArr = [];

function updateText() {
  act_text.textContent = null;
  currentText = text_samples_arr[textNo];

  currentText.split("").forEach((char) => {
    const charSpan = document.createElement("span");
    charSpan.innerText = char;
    act_text.appendChild(charSpan);
  });
  console.log(textNo);
  if (textNo < text_samples_arr.length - 1) textNo++;
  else textNo = 0;
}

function processCurrentText() {
  userTypedInput = inp_area.value;
  userTypedInputArr = userTypedInput.split("");

  charactersTyped++;

  actTextArr = act_text.querySelectorAll("span");

  actTextArr.forEach((char, idx) => {
    let typedChar = userTypedInputArr[idx];

    if (typedChar == null) {
      char.classList.remove("correct_char");
      char.classList.remove("incorrect_char");
    } else if (typedChar === char.innerText) {
      char.classList.add("correct_char");
      char.classList.remove("incorrect_char");
    } else {
      char.classList.remove("correct_char");
      char.classList.add("incorrect_char");

      errors++;
    }
  });

  //   update accuracy text
  let correctCharacters = charactersTyped - (totalErrors + errors);
  let accuracyVal = (correctCharacters / charactersTyped) * 100;
  accArr.push(Math.round(accuracyVal));
  acc_text.textContent = Math.round(accuracyVal) + "%";

  if (userTypedInput.length == currentText.length) {
    updateText();
    totalErrors += errors;
    inp_area.value = "";
  }
}

function startTest() {
  resetValues();
  updateText();

  // clear old timer and start afresh
  clearInterval(timer);

  timer = setInterval(updateTimer, 1000);
}

function resetValues() {
  timeLeft = TIME_LIMIT;
  timeElapsed = 0;
  errors = 0;
  totalErrors = 0;
  accuracy = 0;
  charactersTyped = 0;
  textNo = 0;
  inp_area.disabled = false;
  wpm = 0;

  inp_area.value = "";
  act_text.textContent = "Click on the area below to start the test.";
  time_text.textContent = timeLeft + "s";
  wpm_text.textContent = null;
  acc_text.textContent = null;
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;

    timeElapsed++;
    time_text.textContent = timeLeft + "s";
  } else finishTest();
}

function finishTest() {
  // stop the timer
  clearInterval(timer);

  //disable the input area
  inp_area.disabled = true;

  // show final text

  act_text.textContent = "Click on restart to start a new test!";

  wpm = Math.round((charactersTyped / 5 / timeElapsed) * 60);

  wpm_text.textContent = wpm;
  let sum = accArr.reduce((acc, curr) => acc + curr);
  acc_text.textContent = parseInt(sum / accArr.length);
  console.log(wpm);
}

   // Function to show the SweetAlert2 rating dialog
   function showRatingDialog() {
    Swal.fire({
        title: 'Rate Now',
        html: `
            <div id="rating-container">
                <i class="star far fa-star" data-rating="1"></i>
                <i class="star far fa-star" data-rating="2"></i>
                <i class="star far fa-star" data-rating="3"></i>
                <i class="star far fa-star" data-rating="4"></i>
                <i class="star far fa-star" data-rating="5"></i>
            </div>
            <div id="rating-text">Select a rating</div>`,
        showCancelButton: true,
        showConfirmButton: false,
    });

    const ratingText = document.getElementById('rating-text');
    const stars = document.querySelectorAll('.star');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.getAttribute('data-rating');
            Swal.close();
            showThankYouMessage(rating);
        });

        star.addEventListener('mouseover', () => {
            const rating = star.getAttribute('data-rating');
            updateRatingText(rating);
            applyHoverEffect(rating);
        });

        star.addEventListener('mouseout', () => {
            resetStars();
            ratingText.innerText = 'Select a rating';
        });
    });

    function updateRatingText(rating) {
        let ratingDescription = '';
        switch (parseInt(rating)) {
            case 1:
                ratingDescription = 'Poor';
                break;
            case 2:
                ratingDescription = 'Unsatisfactory';
                break;
            case 3:
                ratingDescription = 'Satisfactory';
                break;
            case 4:
                ratingDescription = 'Very Satisfactory';
                break;
            case 5:
                ratingDescription = 'Outstanding';
                break;
            default:
                ratingDescription = 'Select a rating';
        }
        ratingText.innerText = ratingDescription;
    }

    function applyHoverEffect(rating) {
        resetStars();
        for (let i = 1; i <= rating; i++) {
            const star = document.querySelector(`.star[data-rating="${i}"]`);
            star.classList.add('fas');
            star.classList.remove('far');
        }
    }

    function resetStars() {
        stars.forEach(star => {
            star.classList.add('far');
            star.classList.remove('fas');
        });
    }
}

// Function to show the "THANK YOU" message with the selected rating
function showThankYouMessage(rating) {
    Swal.fire({
        text: `THANK YOU FOR RATING MY APPLICATION! You rated it as ${ratingDescription(rating)}.`,
        onClose: () => {
            // Redirect to the main page after the dialog is closed
            window.location.href = '../index2.html';
        }
    });
}

function ratingDescription(rating) {
    switch (parseInt(rating)) {
        case 1:
            return 'Poor';
        case 2:
            return 'Unsatisfactory';
        case 3:
            return 'Satisfactory';
        case 4:
            return 'Very Satisfactory';
        case 5:
            return 'Outstanding';
        default:
            return 'Unknown';
    }
}

document.getElementById('rateButton').addEventListener('click', showRatingDialog);