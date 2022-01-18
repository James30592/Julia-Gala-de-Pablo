test edit...

var onloadItems = document.querySelectorAll(".onload-item");

window.addEventListener("load", showStartItems(onloadItems));

function showStartItems(items) {
  items.forEach(function(item) {
    // Included to force render so that it always works.
    let x = item.clientHeight;
    item.style.opacity = 1;
  });
}


var currPage = document.querySelector("body").dataset.scripts

// Slide show background for home page.
if (currPage === "home") {
  const backImg = document.querySelector(".back-img");
  const backgroundImgs = [
    "images/home/SilverPosterPrize_Shizuoka2021 - flipped.jpg",
    "images/home/Cytometry_v7_nochannel_conspectusgraphic.jpg",
    "images/home/SciX2021.jpg",
    "images/home/ToC_v4.jpg",
    "images/home/SPEC2018 - small.jpg"];

  var currIndex = 0;

  setInterval(changeBackground, 8000);
  setTimeout (function () {
    backImg.style.transform = "scale(1.06) translate(-2.5%)";
  }, 10);

  function changeBackground() {
    currIndex = (currIndex + 1) % backgroundImgs.length;
    var currBackground = backgroundImgs[currIndex];
    backImg.style.opacity = 0;

    // Update background image once previous has faded out.
    setTimeout(function(){
      backImg.setAttribute("src", currBackground);
      backImg.style.transition = "opacity 1.7s";

      // Reset the position...
      backImg.style.transform = "scale(1.06) translate(0)";
      // Before fading the new image in.
      backImg.style.opacity = 1;
      // This line is important because it forces a DOM render ("by requesting a visual style property"). Without this the below transition on transform is not applied and the element fades in already in it's leftmost position.
      let x = backImg.clientHeight;
      // Then allow the new image to transition on moving.
      backImg.style.transition = "opacity 1.7s, transform 8s linear";
      // And move it leftwards slightly.
      backImg.style.transform = "scale(1.06) translate(-2.5%)";
    }, 1700);
  }
}


// Code for slides pages.
if (currPage === "slides") {
  var currSlide = 0;
  // Max slide index.
  var maxSlides = document.querySelectorAll(".slide-container").length - 1;
  console.log(maxSlides);

  const leftArrowBtn = document.querySelector(".left-arrow-btn");
  const rightArrowBtn = document.querySelector(".right-arrow-btn");


  rightArrowBtn.addEventListener("click", handleRightArrow);
  leftArrowBtn.addEventListener("click", handleLeftArrow);

  function handleRightArrow () {
    rightArrowBtn.removeEventListener("click", handleRightArrow);
    leftArrowBtn.removeEventListener("click", handleLeftArrow);
    currSlide ++;
    // Make new slide now on the screen and move previous slide off the screen..
    document.querySelector(".slide-" + currSlide).classList.remove("next-slide");
    document.querySelector(".slide-" + (currSlide - 1)).classList.add("prev-slide");
    // Update old prev slide.
    if (currSlide >= 2) {
      document.querySelector(".slide-" + (currSlide - 2)).classList.remove("prev-slide");
      document.querySelector(".slide-" + (currSlide - 2)).classList.add("fully-hidden");
    }
    if (currSlide === maxSlides) {
      rightArrowBtn.classList.add("hidden");
    } else {
      // Prepare next slide.
      document.querySelector(".slide-" + (currSlide + 1)).classList.add("next-slide");
      document.querySelector(".slide-" + (currSlide + 1)).classList.remove("fully-hidden");
      if (currSlide === 1) {
        leftArrowBtn.classList.remove("hidden");
      }
    }
    setTimeout (function () {
      rightArrowBtn.addEventListener("click", handleRightArrow);
      leftArrowBtn.addEventListener("click", handleLeftArrow);
    }, 1000);
  }

  function handleLeftArrow () {
    rightArrowBtn.removeEventListener("click", handleRightArrow);
    leftArrowBtn.removeEventListener("click", handleLeftArrow);
    currSlide --;
    // Make new slide now on the screen and move previous slide off the screen..
    document.querySelector(".slide-" + currSlide).classList.remove("prev-slide");
    document.querySelector(".slide-" + (currSlide + 1)).classList.add("next-slide");
    // Update old next slide.
    if ((maxSlides - currSlide) >= 2) {
      document.querySelector(".slide-" + (currSlide + 2)).classList.remove("next-slide");
      document.querySelector(".slide-" + (currSlide + 2)).classList.add("fully-hidden");
    }
    if (currSlide === 0) {
      leftArrowBtn.classList.add("hidden");
    } else {
        // Prepare prev slide.
        document.querySelector(".slide-" + (currSlide - 1)).classList.add("prev-slide");
        document.querySelector(".slide-" + (currSlide - 1)).classList.remove("fully-hidden");
        if (currSlide === (maxSlides - 1)) {
          rightArrowBtn.classList.remove("hidden");
        }
    }
    setTimeout (function () {
      rightArrowBtn.addEventListener("click", handleRightArrow);
      leftArrowBtn.addEventListener("click", handleLeftArrow);
    }, 1000);
  }
}


// Email hider on contact page.
if (currPage === "contact") {
  const showEmailBtn = document.querySelector(".show-mail-btn");
  const emailLink = document.querySelector(".email-address");

  const emlPt1 = "jgal";
  const emlPt2 = "gmail.com";
  const emlPt3 = "ablo";
  const emlPt4 = "adep";
  const emlPt5 = "@";

  const emPre1 = "ilt";
  const emPre2 = "ma";
  const emPre3 = "o:";

  showEmailBtn.addEventListener("click", function(){
    var allParts = emlPt1 + emlPt4 + emlPt3 + emlPt5 + emlPt2;
    var allPres = emPre2 + emPre1 + emPre3;
    emailLink.innerHTML = allParts;
    emailLink.setAttribute("href", allPres + allParts);
    emailLink.classList.toggle("hidden");
  });
}
