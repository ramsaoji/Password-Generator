const lengthSlider = document.querySelector(".pass-length input"),
  options = document.querySelectorAll(".options-password .option input"),
  passwordInput = document.querySelector(".input-box textarea"),
  copyIcon = document.querySelector(".input-box span"),
  passIndicator = document.querySelector(".pass-indicator"),
  passLengthSpan = document.querySelector(".details span"),
  passLengthTitle = document.querySelector(".details .title"),
  passSettingsTitle = document.querySelector(".pass-settings-title .title"),
  resetIcon = document.querySelector(".pass-settings-title span"),
  generateBtn = document.querySelector(".generate-btn"),
  excludeDuplicateCheckbox = document.getElementById("exc-duplicate"),
  upperCaseChekbox = document.getElementById("uppercase"),
  numbersChekbox = document.getElementById("numbers"),
  symbolsChekbox = document.getElementById("symbols"),
  selectBox = document.getElementById("select-pass-type"),
  optionsPassphrase = document.querySelectorAll(
    ".options-passphrase .option input"
  ),
  wordSeperatorInput = document.querySelector(
    ".wordSeperator .wordSeparatorInput"
  ),
  hidePassphraseSettingsContainer = document.querySelector(
    ".pass-settings .passphraseSettingsContainer"
  ),
  hideOptionsPassword = document.querySelector(
    ".pass-settings .options-password"
  ),
  wrapper = document.querySelector(".wrapper"),
  wrapperError = document.querySelector(".wrapper-error"),
  wrapperErrorMsg = document.querySelector(".wrapper-error p");

////////////////////////////////////////////////////////////////

//GENERATE PASSWORD START

const characters = {
  //object of letters,numbers & symbols and regex
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  //symbols: "-!$%^&*()_+|~=`{}:<>?,;"
  symbols: "@%&!^#*$",
  lowercaseRegex: "(?=.*[a-z])",
  uppercaseRegex: "(?=.*[A-Z])",
  numbersRegex: "(?=.*\\d)",
  //symbolsRegex: "(?=.*[-!$%^&*()_+\\|~=`{}\":'<>?,;./])"
  symbolsRegex: "(?=.*[@%&!^#*$])",
  spaceRegex: "(?=.*[ ])",
  prefixRegexPattern: "^",
  suffixRegexPattern: ".+$",
};

//Generating password function
const generatePassword = () => {
  let staticPassword = "",
    randomPassword = "",
    excludeDuplicate = false,
    regex = "^",
    regexExp = "";

  options.forEach((option) => {
    //looping through each option's checkbox

    if (option.checked) {
      // if checkbox is checked

      // Checking or Unchecking upper,number and symbols checkboxes depending on slider range and excludeDuplicateCheckbox as well as disabling excludeDuplicateCheckbox
      if (
        lengthSlider.value > 20 &&
        lengthSlider.value <= 25 &&
        excludeDuplicateCheckbox.checked == true
      ) {
        upperCaseChekbox.checked = true;
      } else if (
        lengthSlider.value > 25 &&
        lengthSlider.value <= 30 &&
        excludeDuplicateCheckbox.checked == true
      ) {
        upperCaseChekbox.checked = true;
        numbersChekbox.checked = true;
        symbolsChekbox.checked = true;
      } else if (lengthSlider.value > 30) {
        excludeDuplicateCheckbox.checked = false;
        excludeDuplicateCheckbox.disabled = true;
      } else {
        excludeDuplicateCheckbox.disabled = false;
      }

      // Appending regex from characters object to regex variable depending on conditions
      if (option.id == "lowercase") {
        regex += characters.lowercaseRegex;
      } else if (option.id == "uppercase") {
        regex += characters.uppercaseRegex;
      } else if (option.id == "numbers") {
        regex += characters.numbersRegex;
      } else if (option.id == "symbols") {
        regex += characters.symbolsRegex;
      } else if (option.id == "spaces") {
        regex += characters.spaceRegex;
      }

      if (option.id !== "exc-duplicate" && option.id !== "spaces") {
        staticPassword += characters[option.id]; //adding a particular key value from characters object to staticPassword
      } else if (option.id === "spaces") {
        //if checkbox id is spaces
        staticPassword += `  ${staticPassword}  `; // adding spaces at the beginning & end of staticPassword
      } else {
        // else pass true value to excludeDuplicate flag
        excludeDuplicate = true;
      }
    }
  });

  //Finally appending suffix to regex variable
  regex += characters.suffixRegexPattern;

  //Converting string in regex variable to real regex
  regexExp = new RegExp(regex);

  //Generating randomPassword depending upon staticVariable string and its length
  for (let i = 0; i < lengthSlider.value; i++) {
    randomPassword +=
      staticPassword[Math.floor(Math.random() * staticPassword.length)];
  }

  //if excludeDuplicate is true then get unique values from randomPassword
  if (excludeDuplicate) {
    //getting unique values in randomPassword
    randomPassword = Array.from(new Set(randomPassword.split(""))).join("");

    if (randomPassword.length < lengthSlider.value) {
      generatePassword();
      return;
    }
  }

  //Validating Password with all applied filters using regexExp
  if (regexExp.test(randomPassword)) {
    passwordInput.value = randomPassword;
  } else {
    generatePassword();
    return;
  }
};

//GENERATE PASSWORD END

/////////////////////////////////////////////////////////////

//GENERATE PASSPHRASE START

//Words API for fetching words

let jsonDataArray = [];
//Fetching json data from json file
async function fetchWords() {
  await fetch("./json/words.json")
    .then((res) => res.json())
    .then((data) => {
      //filtering word having length greater than 3
      data.forEach((word) => {
        if (word.length > 3) {
          jsonDataArray.push(word);
        }
      });
      //checking if jsonDataArray contains at least 20 words
      if (jsonDataArray.length > 20) {
        resetPassphraseSettings();
      } else {
        wrapper.style.display = "none";
        wrapperError.style.display = "block";
        setTimeout(() => {
          wrapper.style.display = "block";
          wrapperError.style.display = "none";
          selectBox.value = "Password";
          selectPassType();
        }, 1500);
      }
    })
    .catch((error) => {
      wrapper.style.display = "none";
      wrapperError.style.display = "block";
      setTimeout(() => {
        wrapper.style.display = "block";
        wrapperError.style.display = "none";
        selectBox.value = "Password";
        selectPassType();
      }, 1500);
    });
}

//generatePassphrase Function
const generatePassphrase = () => {
  let randomPassphrase = "";
  let words = [];
  let wordSeperatorDefault = "-";
  let wordSeperatorInputValue = wordSeperatorInput.value;
  let randomNumber;
  let appendWordNumber;

  //Generate randomPassphraseLoop
  function randomPassphraseLoop() {
    let uniqueWords;

    for (let i = 0; i < lengthSlider.value; i++) {
      words.push(
        jsonDataArray[Math.floor(Math.random() * jsonDataArray.length)]
      );
    }

    uniqueWords = Array.from(new Set(words)); //Getting unique words in uniquewords array

    if (uniqueWords.length < lengthSlider.value) {
      words = []; //Emptying words array
      randomPassphraseLoop();
      return;
    }

    //Capitalize Start

    function capitalizeFirstLetter(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }

    //Capitalize End

    optionsPassphrase.forEach((option) => {
      if (option.checked) {
        if (option.id == "capitalise") {
          uniqueWords = uniqueWords.map(capitalizeFirstLetter);
        }

        if (option.id == "incNumber") {
          randomNumber = Math.floor(Math.random() * 9);
          appendWordNumber = Math.floor(Math.random() * uniqueWords.length);
          uniqueWords[appendWordNumber] =
            uniqueWords[appendWordNumber] + randomNumber;
        }
      }
    });

    if (wordSeperatorInputValue == null) {
      //Setting Default Seprator as space if no input given
      randomPassphrase = uniqueWords.join(wordSeperatorDefault);
    } else {
      randomPassphrase = uniqueWords.join(wordSeperatorInputValue);
    }

    passwordInput.value = randomPassphrase;
  }
  randomPassphraseLoop(); //Calling for 1st time
};

//GENERATE PASSPHRASE END

//updatePassIndicator Function
//Updating Password Indicator with value = weak,medium and strong and changing its color from css accordingly
const updatePassIndicator = () => {
  let weakValue, mediumValue;

  if (selectBox.value == "Password") {
    weakValue = 10;
    mediumValue = 20;
  } else {
    weakValue = 3;
    mediumValue = 6;
  }
  //if lengthSlider value is less than 8 then pass "weak" as passIndicator id else if lengthSlider value is less than 16 then pass "medium" as id else pass "strong" as id

  passIndicator.id =
    lengthSlider.value <= weakValue
      ? "weak"
      : lengthSlider.value <= mediumValue
      ? "medium"
      : "strong";
};

//changeTextareaSize Function
//Changing textarea size according to the password/passphrase length
const changeTextareaSize = () => {
  let heightLimit = 6.71021; /* Maximum height: 6.71021remrem */
  passwordInput.style.height = ""; /* Reset the height*/
  passwordInput.style.height =
    Math.min(passwordInput.scrollHeight / 15.4987654, heightLimit) + "rem";
};

//updateSliderPassword Function
const updateSliderPassword = () => {
  //blocking slider at minimum 5 length to get password with all filters if all are applied
  lengthSlider.min = 5;
  generatePassword();
  updatePassIndicator();

  //Updating password length slider value to the password length (span) value.
  passLengthSpan.innerText = lengthSlider.value;

  changeTextareaSize();
};

//updateSliderPassphrase Function
const updateSliderPassphrase = () => {
  //blocking slider at minimum 3 length for passphrase
  lengthSlider.min = 3;

  generatePassphrase();
  updatePassIndicator();

  //Updating password length slider value to the password length (span) value.
  passLengthSpan.innerText = lengthSlider.value;

  changeTextareaSize();
};

//copyPassword Function
//Copying Password to clipboard using copy icon
const copyPassword = () => {
  navigator.clipboard.writeText(passwordInput.value); // copying randomPassword to clipboard
  copyIcon.innerHTML = "check"; // changing copy icon to tick

  setTimeout(() => {
    //after 1.5 sec changing tick icon back to copy icon
    copyIcon.innerHTML = "copy_all";
  }, 1500);
};

//Calling updateSliderPassword on every checkbox selected for password
for (let i = 0; i < options.length; i++) {
  if (options[i].type === "checkbox") {
    options[i].onclick = updateSliderPassword;
  }
}

//Calling updateSliderPassphrase on every checkbox selected for passphrase
for (let i = 0; i < optionsPassphrase.length; i++) {
  if (optionsPassphrase[i].type === "checkbox") {
    optionsPassphrase[i].onclick = updateSliderPassphrase;
  }
}

//resetPasswordSettings Function
//Resetting all checkboxes and all other things for password on clickling reset icon
const resetPasswordSettings = () => {
  for (let i = 0; i < options.length; i++) {
    if (options[i].type === "checkbox" && options[i].id != "lowercase") {
      options[i].checked = false;
      excludeDuplicateCheckbox.disabled = false;
      lengthSlider.value = 15;
      updateSliderPassword();
    }
  }
};

//resetPassphraseSettings Function
//Resetting all checkboxes and all other things for passphrase on clickling reset icon
const resetPassphraseSettings = () => {
  for (let i = 0; i < optionsPassphrase.length; i++) {
    if (optionsPassphrase[i].type === "checkbox") {
      optionsPassphrase[i].checked = false;
      wordSeperatorInput.value = "-";
      lengthSlider.value = 3;
      updateSliderPassphrase();
    }
  }
};

//Call resetBtn event depending on password or passphrase
const callResetSettings = () => {
  if (selectBox.value == "Password") {
    resetPasswordSettings();
  } else {
    resetPassphraseSettings();
  }
};

//Call generateBtn depending on password or passphrase
const callGenerateBtn = () => {
  if (selectBox.value == "Password") {
    updateSliderPassword();
  } else {
    updateSliderPassphrase();
  }
};

//selectPassType Function
const selectPassType = () => {
  //called once by default(on first reload)

  if (selectBox.value == "Password") {
    resetPasswordSettings();
    selectBox.value == "Password";
    hideOptionsPassword.style.display = "flex";
    hidePassphraseSettingsContainer.style.display = "none";
    lengthSlider.max = 100;
    lengthSlider.value = 15;
    passLengthSpan.innerText = lengthSlider.value;
    passLengthTitle.innerText = "Password Length";
    passSettingsTitle.innerText = "Password Settings";
    generateBtn.innerText = "Generate Password";
  } else {
    hideOptionsPassword.style.display = "none";
    hidePassphraseSettingsContainer.style.display = "block";
    lengthSlider.max = 20;
    lengthSlider.value = 3;
    passLengthSpan.innerText = lengthSlider.value;
    passLengthTitle.innerText = "Passphrase Length";
    passSettingsTitle.innerText = "Passphrase Settings";
    generateBtn.innerText = "Generate Passphrase";
    fetchWords();
  }
};

//Calling by default when page loads START
selectBox.value = "Password";
selectPassType();
//Calling by default when page loads END

//All Event Listners
copyIcon.addEventListener("click", copyPassword);
resetIcon.addEventListener("click", callResetSettings);
generateBtn.addEventListener("click", callGenerateBtn);
selectBox.addEventListener("change", selectPassType);

lengthSlider.addEventListener("input", () => {
  if (selectBox.value == "Password") {
    updateSliderPassword();
  } else {
    updateSliderPassphrase();
  }
});

lengthSlider.addEventListener("click", () => {
  if (selectBox.value == "Password") {
    updateSliderPassword();
  } else {
    updateSliderPassphrase();
  }
});

wordSeperatorInput.addEventListener("input", () => {
  if (wordSeperatorInput.value.length >= null) {
    wordSeperatorInput.value = wordSeperatorInput.value.slice(0, 1);
    updateSliderPassphrase();
  }
});
