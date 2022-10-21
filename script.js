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
  optionsPassphrase = document.querySelectorAll(".options-passphrase .option input"),
  wordSeperatorInput = document.querySelector(".wordSeperator .wordSeparatorInput"),
  hidePassphraseSettingsContainer = document.querySelector(".pass-settings .passphraseSettingsContainer"),
  hideOptionsPassword = document.querySelector(".pass-settings .options-password");

/////////////////////////////////////////////////////////////

let jsonDataArray = [];
//Fetching json data from json file
async function fetchFun() {
  await fetch("./json/custom_words.json")
    .then((res) => res.json())
    .then((data) => {
      //filtering word having length greater than 3
      data.forEach((word) => {
        if (word.length > 3) {
          jsonDataArray.push(word);
        }
      });
    });
}
fetchFun(); //Calling for 1st time

// console.log(jsonDataArray);

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
    // console.log(words);

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

    if (wordSeperatorInputValue == "") {
      //Setting Default Seprator as space if no input given
      randomPassphrase = uniqueWords.join(wordSeperatorDefault);
    } else {
      randomPassphrase = uniqueWords.join(wordSeperatorInputValue);
    }

    passwordInput.value = randomPassphrase;
  }
  randomPassphraseLoop(); //Calling for 1st time
  // });
};

////////////////////////////////////////////////////////////////

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

    // if(randomPassword.length < lengthSlider.value) {
    //     generatePassword();
    //     return
    // }
  }

  //Validating Password with all applied filters using regexExp
  if (regexExp.test(randomPassword)) {
    passwordInput.value = randomPassword;
  } else {
    generatePassword();
    return;
  }
};

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

//Updating password length slider value to the password length (span) value.

const updateSlider = () => {
  let rangeValue;

  if (selectBox.value == "Password") {
    //blocking slider at minimum 5 length to get password with all filters if all are applied
    rangeValue = lengthSlider.value;
    if (rangeValue < 5) {
      lengthSlider.value = 5;
      passLengthSpan.innerText = lengthSlider.value;
      return;
    }

    generatePassword();
    updatePassIndicator();

    passLengthSpan.innerText = lengthSlider.value;

    //Changing textarea size according to the password length
    let heightLimit = 10; /* Maximum height: 10rem */
    passwordInput.style.height = ""; /* Reset the height*/
    passwordInput.style.height =
      Math.min(passwordInput.scrollHeight / 15.4987654, heightLimit) + "rem";
  } else {
    rangeValue = lengthSlider.value;

    if (rangeValue < 3) {
      lengthSlider.value = 3;
      passLengthSpan.innerText = lengthSlider.value;
      return;
    }

    generatePassphrase();
    updatePassIndicator();

    passLengthSpan.innerText = lengthSlider.value;

    if (lengthSlider.value < 4) {
      passwordInput.style.height = "3.5rem";
    } else if (lengthSlider.value >= 4 && lengthSlider.value < 8) {
      passwordInput.style.height = "4rem";
    } else if (lengthSlider.value >= 8 && lengthSlider.value <= 12) {
      passwordInput.style.height = "5rem";
    } else if (lengthSlider.value > 12) {
      passwordInput.style.height = "7.35542rem";
    }
  }
};

//Copying Password to clipboard using copy icon
const copyPassword = () => {
  navigator.clipboard.writeText(passwordInput.value); // copying randomPassword to clipboard
  copyIcon.innerHTML = "check"; // changing copy icon to tick

  setTimeout(() => {
    //after 1.5 sec changing tick icon back to copy icon
    copyIcon.innerHTML = "copy_all";
  }, 1500);
};

//Calling generatePassword on every checkbox selected
for (let i = 0; i < options.length; i++) {
  if (options[i].type === "checkbox") {
    options[i].onclick = generatePassword;
  }
}

//Calling generatePassphrase on every checkbox selected
for (let i = 0; i < optionsPassphrase.length; i++) {
  if (optionsPassphrase[i].type === "checkbox") {
    optionsPassphrase[i].onclick = generatePassphrase;
  }
}

//Resetting all checkboxes and all other things on clickling reset icon
const resetPasswordSettings = () => {
  for (let i = 0; i < options.length; i++) {
    if (options[i].type === "checkbox" && options[i].id != "lowercase") {
      options[i].checked = false;
      excludeDuplicateCheckbox.disabled = false;
      lengthSlider.value = 15;
      // generatePassphrase();
      updateSlider();
    }
  }
};
const resetPassphraseSettings = () => {
  for (let i = 0; i < optionsPassphrase.length; i++) {
    if (optionsPassphrase[i].type === "checkbox") {
      optionsPassphrase[i].checked = false;
      wordSeperatorInput.value = "-";
      lengthSlider.value = 3;
      // generatePassword();
      updateSlider();
    }
  }
};

const callResetSettings = () => {
  if (selectBox.value == "Password") {
    resetPasswordSettings();
  } else {
    resetPassphraseSettings();
  }
};

//Call GenerateBtn depending on password or passphrase
const callGenerateBtn = () => {
  if (selectBox.value == "Password") {
    generatePassword();
  } else {
    generatePassphrase();
  }
};

////////////////////////////////

const selectPassType = () => {
  //called once by default(on first reload)

  if (selectBox.value == "Password") {
    resetPassphraseSettings();
    selectBox.value == "Password";
    hideOptionsPassword.style.display = "flex";
    hidePassphraseSettingsContainer.style.display = "none";
    lengthSlider.max = 100;
    lengthSlider.value = 15;
    passLengthSpan.innerText = lengthSlider.value;
    passLengthTitle.innerText = "Password Length";
    passSettingsTitle.innerText = "Password Settings";
    generateBtn.innerText = "Generate Password";
    updateSlider();
  } else {
    resetPasswordSettings();
    hideOptionsPassword.style.display = "none";
    hidePassphraseSettingsContainer.style.display = "block";
    lengthSlider.max = 20;
    lengthSlider.value = 3;
    passLengthSpan.innerText = lengthSlider.value;
    passLengthTitle.innerText = "Passphrase Length";
    passSettingsTitle.innerText = "Passphrase Settings";
    generateBtn.innerText = "Generate Passphrase";
    updateSlider();
  }
  // alert(selectBox.value);
};

//Calling by default when page loads START
selectBox.value = "Password";
selectPassType();
//Calling by default when page loads END

///////////////////////////////

copyIcon.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", updateSlider);
// lengthSlider.addEventListener("click", updateSlider);
resetIcon.addEventListener("click", callResetSettings);
generateBtn.addEventListener("click", callGenerateBtn);
selectBox.addEventListener("change", selectPassType);
wordSeperatorInput.addEventListener("input", generatePassphrase);
