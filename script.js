const lengthSlider = document.querySelector(".pass-length input"),
  options = document.querySelectorAll(".option input"),
  passwordInput = document.querySelector(".input-box textarea"),
  copyIcon = document.querySelector(".input-box span"),
  passIndicator = document.querySelector(".pass-indicator"),
  resetIcon = document.querySelector(".pass-settings-title span");
(generateBtn = document.querySelector(".generate-btn")),
  (excludeDuplicateCheckbox = document.getElementById("exc-duplicate")),
  (upperCaseChekbox = document.getElementById("uppercase")),
  (numbersChekbox = document.getElementById("numbers")),
  (symbolsChekbox = document.getElementById("symbols"));

const characters = {
  //object of letters,numbers & symbols and regex
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "-!$%^&*()_+|~=`{}:<>?,;",
  lowercaseRegex: "(?=.*[a-z])",
  uppercaseRegex: "(?=.*[A-Z])",
  numbersRegex: "(?=.*\\d)",
  symbolsRegex: "(?=.*[-!$%^&*()_+\\|~=`{}\":'<>?,;./])",
  spaceRegex: "(?=.*[ ])",
  prefixRegexPattern: "^",
  suffixRegexPattern: ".+$",
};

//Generating password function
const generatePassword = () => {
  let staticPassword = "",
    randomPassword = "",
    excludeDuplicate = false,
    passLength = lengthSlider.value,
    regex = "^",
    regexExp = "";

  options.forEach((option) => {
    //looping through each option's checkbox

    if (option.checked) {
      // if checkbox is checked

      // Checking or Unchecking upper,number and symbols checkboxes depending on slider range and excludeDuplicateCheckbox as well as disabling excludeDuplicateCheckbox
      if (
        passLength > 20 &&
        passLength <= 25 &&
        excludeDuplicateCheckbox.checked == true
      ) {
        upperCaseChekbox.checked = true;
      } else if (
        passLength > 25 &&
        passLength <= 30 &&
        excludeDuplicateCheckbox.checked == true
      ) {
        upperCaseChekbox.checked = true;
        numbersChekbox.checked = true;
        symbolsChekbox.checked = true;
      } else if (passLength > 30) {
        excludeDuplicateCheckbox.checked = false;
        excludeDuplicateCheckbox.disabled = true;
      } else {
        excludeDuplicateCheckbox.disabled = false;
      }

      // if(passLength <= 20){
      //     excludeDuplicateCheckbox.disabled = false;
      // }
      // else if(upperCaseChekbox.checked == true && passLength <= 25){
      //     excludeDuplicateCheckbox.disabled = false;
      // }else if(passLength <= 25 && numbersChekbox.checked == true && symbolsChekbox.checked == true){
      //     excludeDuplicateCheckbox.disabled = false;
      // }
      // else if(upperCaseChekbox.checked == true && passLength > 25 && passLength <= 30 && numbersChekbox.checked == true && symbolsChekbox.checked == true){
      //     excludeDuplicateCheckbox.disabled = false;
      // }else{
      //     excludeDuplicateCheckbox.checked = false;
      //     excludeDuplicateCheckbox.disabled = true;
      // }

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
  for (let i = 0; i < passLength; i++) {
    randomPassword =
      randomPassword +
      staticPassword[Math.floor(Math.random() * staticPassword.length)];
  }

  //if excludeDuplicate is true then get unique values from randomPassword
  if (excludeDuplicate) {
    //getting unique values in randomPassword
    randomPassword = Array.from(new Set(randomPassword.split(""))).join("");

    // if(randomPassword.length < passLength) {
    //     generatePassword();
    //     return
    // }
  }

  //Validating Password with all applied filters using regexExp
  console.log("before - " + randomPassword);
  console.log(regexExp);
  if (regexExp.test(randomPassword)) {
    passwordInput.value = randomPassword;
  } else {
    generatePassword();
    return;
  }
};

//Updating Password Indicator with value = weak,medium and strong and changing its color from css accordingly
const updatePassIndicator = () => {
  //if lengthSlider value is less than 8 then pass "weak" as passIndicator id else if lengthSlider value is less than 16 then pass "medium" as id else pass "strong" as id
  passIndicator.id =
    lengthSlider.value <= 10
      ? "weak"
      : lengthSlider.value <= 20
      ? "medium"
      : "strong";
};

//Updating password length slider value to the password length (span) value.
const updateSlider = () => {
  //Changing textarea size according to the password length
  for (let i = 0; i <= lengthSlider.value; i++) {
    if (lengthSlider.value > 30 && lengthSlider.value < 60) {
      passwordInput.setAttribute("style", "height: 4rem");
    } else if (lengthSlider.value > 60) {
      passwordInput.setAttribute("style", "height: 5rem");
    } else {
      passwordInput.setAttribute("style", "height: 2.2rem");
    }
  }

  //blocking slider at minimum 5 length to get password with all filters if all are applied
  rangeValue = lengthSlider.value;
  if (rangeValue < 5) {
    lengthSlider.value = 5;
    return;
  }

  document.querySelector(".details span").innerHTML = lengthSlider.value;

  generatePassword();
  updatePassIndicator();
};
//Calling to show password for the 1st time when page loads
updateSlider();

//Copying Password to clipboard using copy icon
const copyPassword = () => {
  navigator.clipboard.writeText(passwordInput.value); // copying randomPassword to clipboard
  copyIcon.innerHTML = "check"; // chenging copy icon to tick

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

//Resetting all checkboxes on clickling reset icon
const resetPasswordSettings = () => {
  for (let i = 0; i < options.length; i++) {
    if (options[i].type === "checkbox" && options[i].id != "lowercase") {
      options[i].checked = false;
      excludeDuplicateCheckbox.disabled = false;
    }
  }
};

copyIcon.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", updateSlider);
resetIcon.addEventListener("click", resetPasswordSettings);
generateBtn.addEventListener("click", generatePassword);
