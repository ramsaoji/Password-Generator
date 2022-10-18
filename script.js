const lengthSlider = document.querySelector(".pass-length input"),
options = document.querySelectorAll(".option input"),
passwordInput = document.querySelector(".input-box input"),
copyIcon = document.querySelector(".input-box span"),
passIndicator = document.querySelector(".pass-indicator"),
generateBtn = document.querySelector(".generate-btn");

const characters = { //object of letters,numbers & symbols
    lowercase : "abcdefghijklmnopqrstuvwxyz",
    uppercase : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers : "0123456789",
    symbols : "!@#$%^&*-_+?~"
}

//Generating random password
const generatePassword = () => {

    let staticPassword = "",
    randomPassword = "",
    excludeDuplicate = false;
    passLength = lengthSlider.value;

    options.forEach(option => { //looping through each option's checkbox
        if(option.checked){ // if checkbox is checked

            if(option.id !== "exc-duplicate" && option.id !== "spaces"){
                staticPassword += characters[option.id]; //adding a particular key value from characters object to staticPassword
            } else if(option.id === "spaces"){ //if checkbox id is spaces
                staticPassword += `  ${staticPassword}  `; // adding spaces at the beginning & end of staticPassword
            } else { // else pass true value to excludeDuplicate flag
                excludeDuplicate = true;
            }
        }
    })

    for(let i = 0; i < passLength; i++){

        randomPassword += staticPassword[Math.floor(Math.random() * staticPassword.length)];
    }

    //if excludeDuplicate is true then get unique values from randomPassword
    if(excludeDuplicate){
        randomPassword = (Array.from(new Set(randomPassword.split("")))).join("");
    }

    passwordInput.value = randomPassword; //passing randomPassword to passwordInput field

}

const updatePassIndicator = () => {
    //if lengthSlider value is less than 8 then pass "weak" as passIndicator id else if lengthSlider value is less than 16 then pass "medium" as id else pass "strong" as id
    passIndicator.id = lengthSlider.value <= 8 ? "weak" : lengthSlider.value <= 16 ? "medium" : "strong";
}

//Updating password length slider value to the password length (span) value.
const updateSlider = () => {
    document.querySelector(".details span").innerHTML = lengthSlider.value;
    generatePassword();
    updatePassIndicator();
}
updateSlider();

const copyPassword = () => {
    navigator.clipboard.writeText(passwordInput.value); // copying randomPassword to clipboard
    copyIcon.innerHTML = "check"; // chenging copy icon to tick

    setTimeout(() => { //after 1.5 sec changing tick icon back to copy icon
        copyIcon.innerHTML = "copy_all";
    }, 1500);
}

copyIcon.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);