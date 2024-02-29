"use strict";
let fromResponseString;
let fetchPromise = fetch("http://localhost:8080/public/index.html");
let responsePromise = fetchPromise.then(response => response.text());
responsePromise.then((stringText) => {
    fromResponseString = stringText;
});
let imagesArray = [];
setTimeout(function () {
    let stringLikeArrray = fromResponseString.slice(fromResponseString.indexOf("["));
    let stringAccumulator = "";
    for(let i = 0; i < stringLikeArrray.length; i++) {
        if(stringLikeArrray[i] !== "[" && stringLikeArrray[i] !== "]" && stringLikeArrray[i] !== "\"") {
            stringAccumulator += stringLikeArrray[i];
        }
    }
    let commasAmount = (stringAccumulator.match(/,/g) || []).length;
    let commasPositions = [];
    for(let i = 0; i < commasAmount; i++) {
        if(i === 0) {
            commasPositions.push(stringAccumulator.indexOf(","));
        }
        else if(i === commasAmount - 1) {
            commasPositions.push(stringAccumulator.lastIndexOf(","));
        }
        else {
            commasPositions.push(stringAccumulator.indexOf(",", commasPositions[i - 1] + 1));
        }
    }
    for(let i = 0; i < commasPositions.length + 1; i++) {
        if(i === 0) {
            imagesArray.push("images/asset/" + stringAccumulator.slice(0, commasPositions[i]));
        }
        else if(i === commasPositions.length) {
            imagesArray.push("images/asset/" + stringAccumulator.slice(commasPositions[i - 1] + 1));
        }
        else {
            imagesArray.push("images/asset/" + stringAccumulator.slice(commasPositions[i - 1] + 1, commasPositions[i]));
        }
    }
}, 1000);
let imageSection = document.querySelector(".body__images-container");
window.addEventListener("load", function () {
    imageSection.style.backgroundImage = "url(\"images/asset/bugatti.jpeg\")";
    let freeText = document.querySelector("script").nextSibling;
    freeText.replaceWith("");
});
let preloadDiv = document.querySelector(".body__preload");
let backgroundImages = "";
setTimeout(function () {
    imagesArray.forEach((item, index, array) => {
        if(index === array.length - 1) {
            backgroundImages += `url(\"${item}\")`;
        }
        else {
            backgroundImages += `url(\"${item}\"), `;
        }
    });
    preloadDiv.style.backgroundImage = backgroundImages;
}, 1100);
let nextSlideButton = document.querySelector(".body__next-slide");
let previousSlideButton = document.querySelector(".body__previous-slide");
function changeSlide(direction) {
    let currentImage = window.getComputedStyle(imageSection).getPropertyValue("background-image");
    if(currentImage.includes("cross-fade")) {
        return;
    }
    else {
        let abbreviatedImageLink = currentImage.slice(currentImage.indexOf("images"), currentImage.lastIndexOf("\""));
        let currentImagePosition = imagesArray.indexOf(abbreviatedImageLink);
        if(direction === "right") {
            if(imagesArray[currentImagePosition + 1] === undefined) {
                imageSection.style.backgroundImage = `url(\"${imagesArray[0]}\")`;
            }
            else {
                imageSection.style.backgroundImage = `url(\"${imagesArray[currentImagePosition + 1]}\")`;
            }
        }
        else {
            if(imagesArray[currentImagePosition - 1] === undefined) {
                imageSection.style.backgroundImage = `url(\"${imagesArray[imagesArray.length - 1]}\")`;
            }
            else {
                imageSection.style.backgroundImage = `url(\"${imagesArray[currentImagePosition - 1]}\")`;
            }
        }
    }
}
nextSlideButton.addEventListener("click", function () {
    changeSlide("right");
});
document.documentElement.addEventListener("keydown", function (event) {
    if(event.code === "Tab") {
        event.preventDefault();
        nextSlideButton.style.outline = "2px solid black";
        changeSlide("right");
    }
});
document.documentElement.addEventListener("click", function () {
    nextSlideButton.style.outline = "none";
});
previousSlideButton.addEventListener("click", function () {
    changeSlide("left");
});