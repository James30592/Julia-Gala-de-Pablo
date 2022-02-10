const mblBreakpoint = 1023;

// Fade specified elements in on page load.
var onloadItems = document.querySelectorAll(".onload-item");

window.addEventListener("load", showStartItems(onloadItems));

function showStartItems(items) {
  items.forEach(function(item) {
    // Included to force render so that it always works.
    let x = item.clientHeight;
    item.style.opacity = 1;
  });
}



// Navbar hamburger button code.
const hmbgBtn = document.querySelector(".hamburger-btn");
const navMenuLinks = document.querySelector(".nav-menu-links");

var menuNowVisible = false;

hmbgBtn.addEventListener("click", function() {
  // Show the nav menu options.
  if (navMenuLinks.classList.contains("nav-menu-sm-hidden")) {
    navMenuLinks.classList.remove("nav-menu-sm-hidden");
    navMenuLinks.classList.remove("nav-menu-small-slide-off");
    menuNowVisible = true;

    // Stop this click immediately being caught by this event listener.
    setTimeout(function() {
        // If user clicks outside the nav menu, close it.
      document.addEventListener('click', function(event) {
        // User clicked somewhere other than a nav menu item, close the menu.
        hideNavMenu();
      }, {once : true});
    }, 10);
  }
});

function hideNavMenu () {
  navMenuLinks.classList.add("nav-menu-small-slide-off");
  menuNowVisible = false;
}

// Only make invisible after finishing transparency transition on fade out.
navMenuLinks.addEventListener('transitionend', function() {
  if (!menuNowVisible) {
    navMenuLinks.classList.add("nav-menu-sm-hidden");
  };
});



// To run page specific JS.
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
  backImg.style.transform = "scale(1.06) translate(-2.5%)";

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



// Slides pages code.
if (currPage === "slides") {
  const allSlides = document.querySelectorAll(".slide-container");
  const maxSlideNum = allSlides.length - 1;
  const slidesContainer = document.querySelector(".slides-container");
  const prevArrowBtn = document.querySelector(".up-arrow-btn");
  const nextArrowBtn = document.querySelector(".down-arrow-btn");
  const slidesNav = document.querySelector(".slides-nav");
  const eachSlidePerc = 100 / (maxSlideNum + 1);

  var currPos = 0;
  var currTranslate = 0;
  var slidesNavBtns = [];
  var slideMidPosns = [];

  var isMblScreen = false;
  if (window.innerWidth <= mblBreakpoint) {
    isMblScreen = true;
  };

  // Put all slides in initial positions and hide arrows as necessary.
  updateSlidePosns(currPos);
  // Force DOM render so can't see slides transitioning.
  let x = prevArrowBtn.clientHeight;


  // Now make each slide transition when moved and add relevant buttons to slides-nav.
  for (let i = 0; i <= maxSlideNum; i++) {
    let thisSlide = allSlides[i];
    initSlidesNavBtn(i, thisSlide);
    // Add this slide and it's mid-height posn to array.
    let thisSlideMidPosn = {
      slideNum: i,
      midPosn: ((2 * window.scrollY + thisSlide.getBoundingClientRect().top +
      thisSlide.getBoundingClientRect().bottom) / 2)
    };
    slideMidPosns.push(thisSlideMidPosn);
  }

  // Highlight slide 0 button in slides nav.
  document.querySelector('[data-slide-ref="0"').classList.add("slides-nav-btn-curr");

  nextArrowBtn.addEventListener("click", handleArrowBtns);
  prevArrowBtn.addEventListener("click", handleArrowBtns);
  document.addEventListener('keydown', handleArrowKeys);
  window.addEventListener('resize', handleScreenResize);
  document.addEventListener('scroll', scrollHandler);


  // Event handler for arrow button clicks.
  function handleArrowBtns() {
    if (this === nextArrowBtn) {
      if (currPos !== maxSlideNum) {
        updateSlidesAndNav(currPos + 1);
      };
    }
    else if (this === prevArrowBtn) {
      if (currPos !== 0) {
        updateSlidesAndNav(currPos - 1);
      };
    };
  }

  // Handles scrolling updating slides nav on mobile.
  function scrollHandler(event) {
    let currViewportMiddle = (window.scrollY + window.innerHeight / 2);

    // Reducer for finding closest slide for current scroll value.
    const findClosestSlide = (a, b) => {
      let aMidPosn = a.midPosn;
      let bMidPosn = b.midPosn;
      let answer = a;
      if (Math.abs(bMidPosn - currViewportMiddle) < Math.abs(aMidPosn - currViewportMiddle)) {
        answer = b;
      };
      return answer;
    };

    let newCurrPos = slideMidPosns.reduce(findClosestSlide).slideNum;
    //  If scrolled to new slide then update slides nav.
    if (!(newCurrPos === currPos)) {
      updateSlidesNav(newCurrPos);
      currPos = newCurrPos;
    };
  }

  // Create button and caption for each slide in the slides nav.
  function initSlidesNavBtn(slideIndex, slide) {
    // Add button to slides nav.
    let newNavSectNode = document.createElement("div");
    newNavSectNode.classList.add("slides-nav-btn");
    newNavSectNode.dataset.slideRef = slideIndex;
    slidesNav.appendChild(newNavSectNode);
    slidesNavBtns.push(newNavSectNode);
    newNavSectNode.addEventListener("click", handleNavClick);
    //  Add hover caption for the nav button.
    let newNavCaptionWrapper = document.createElement("div");
    newNavCaptionWrapper.classList.add("slides-nav-caption-wrapper");
    newNavSectNode.appendChild(newNavCaptionWrapper);
    let newNavBtnCaption = document.createElement("p");
    newNavBtnCaption.classList.add("slides-nav-btn-caption");
    newNavBtnCaption.innerHTML = slide.dataset.slideTitle;
    newNavCaptionWrapper.appendChild(newNavBtnCaption);
  }

  // Get updated top pixel positions for each slide.
  function updateSlidePxPosns(slides) {
    slides.forEach(function(slide) {
      slideMidPosns.find(aSlide => aSlide.slideNum === Number(slide.dataset.slideNum)).midPosn =
      ((2 * window.scrollY + slide.getBoundingClientRect().top + slide.getBoundingClientRect().bottom) / 2);
    });
  }

  // Event listener for if window resized across 1024pixel breakpoint.
  function handleScreenResize() {
    let newWidth = window.innerWidth;
    let wasMblScreen = isMblScreen;
    if (newWidth <= mblBreakpoint && !isMblScreen) {
      // Window has gone from desktop to mobile size.
      // Reset the translation of the slides container to 0.
      slidesContainer.style.transition = "none";
      updateSlidesAndNav(0);
      updateSlidePxPosns(allSlides);
      isMblScreen = true;
      slidesContainer.style.transition = "transform 1s";
    }
    else if (newWidth > mblBreakpoint && isMblScreen) {
      // Window has gone from mobile to desktop size.
      isMblScreen = false;
    };
    if (wasMblScreen && isMblScreen) {
      updateSlidePxPosns(allSlides);
    };
  };

  function handleNavClick () {
    let slidesNavBtnRef = Number(this.dataset.slideRef);
    // Desktop version of slides nav handler.
    if (!isMblScreen) {
      updateSlidesAndNav(slidesNavBtnRef);
    }
    // Mobile version.
    else {
      scrolltoSection(slidesNavBtnRef);
    };
  }

  function scrolltoSection(sectionNum) {
    document.querySelector('[data-slide-num="' + sectionNum + '"]').scrollIntoView();
  }

  function updateSlidesAndNav (newCurrPos) {
      updateSlidesNav(newCurrPos);
      updateSlidePosns(newCurrPos);
      currPos = newCurrPos;
  }

  // Update slide positions and amend buttons as necessary.
  function updateSlidePosns (newCurrPos) {
    // Translate the whole slide flex container by the right amount.
    let newTranslate = -(eachSlidePerc * (newCurrPos - currPos)) + currTranslate;
    slidesContainer.style.transform = "translateY(" + newTranslate + "%)";
    currTranslate = newTranslate;
    // If on the first or last slide then fully hide the relevant arrow button so can't slide too far.
    if (newCurrPos === 0) {
      prevArrowBtn.classList.add("hidden-and-transp");
    }
    if (newCurrPos === maxSlideNum) {
      nextArrowBtn.classList.add("hidden-and-transp");
    }
    // If just moved off first or last slide then show the relevant arrow button again.
    if ((currPos === 0) && (newCurrPos !== 0)) {
      prevArrowBtn.classList.remove("hidden-and-transp");
    }
    if ((currPos === maxSlideNum) && (newCurrPos !== maxSlideNum)) {
      nextArrowBtn.classList.remove("hidden-and-transp");
    }
  }

  // Highlights the correct slides nav button for the currently viewed slide.
  function updateSlidesNav (newCurrPos) {
    document.querySelector('[data-slide-ref="' + currPos + '"]').classList.remove("slides-nav-btn-curr");
    document.querySelector('[data-slide-ref="' + newCurrPos + '"]').classList.add("slides-nav-btn-curr");
  }

  // Event listeners for keyboard keys.
  function handleArrowKeys(event) {
    if (!isMblScreen) {
      if ((event.key === "ArrowUp") && (currPos !== 0)) {
        updateSlidesAndNav(currPos - 1);
      };
      if ((event.key === "ArrowDown") && (currPos !== maxSlideNum)) {
        updateSlidesAndNav(currPos + 1);
      };
    };
  }
}


// Scripts for news page grid, show / hide details text box on click.
if (document.querySelector("body").dataset.page === "news") {
  const newsSections = document.querySelectorAll(".news-grid-section");
  var sectionsAndText = [];
  var isMblScreenNews = false;
  if (window.innerWidth <= mblBreakpoint) {
    isMblScreenNews = true;
  };
  window.addEventListener('resize', handleScreenResizeNews);

  newsSections.forEach(function(section) {
    let thisTextBox = section.querySelector(".news-grid-text-box");
    if (thisTextBox != null) {
      sectionsAndText.push({
        section: section,
        textBox: thisTextBox,
        caption: section.querySelector(".caption-wrapper")
      });
      section.addEventListener("click", toggleDetails);
      if (isMblScreen) {
        thisTextBox.classList.add("hidden");
        thisTextBox.classList.add("transp");
      };
    }
  });

  function toggleDetails() {
    if (isMblScreen) {
      let thisSectionAndText = sectionsAndText.find(s => s.section === this);
      let thisTextBox = thisSectionAndText.textBox;
      let thisCaption = thisSectionAndText.caption;
      if (thisTextBox.classList.contains("hidden")) {
        // Show details.
        thisTextBox.classList.remove("hidden");
        thisTextBox.classList.remove("transp");
        if (!(thisCaption == null)) {
          thisCaption.classList.add("transp");
        };
      }
      else {
        // Hide details.
        thisTextBox.classList.add("transp");
        setTimeout(function() {
          thisTextBox.classList.add("hidden");
        }, 500);
        if (!(thisCaption == null)) {
          thisCaption.classList.remove("transp");
        };
      }
    }
  }

  // Event listener for if window resized across 1024pixel breakpoint.
  function handleScreenResizeNews() {
    console.log(isMblScreenNews);
    let newWidth = window.innerWidth;
    if (newWidth <= mblBreakpoint && !isMblScreenNews) {
      // Window has gone from desktop to mobile size.
      console.log("gone mobile");
      isMblScreenNews = true;
      sectionsAndText.forEach(function(sectionAndText) {
        sectionAndText.textBox.classList.add("hidden");
        sectionAndText.textBox.classList.add("transp");
      });
    }
    else if (newWidth > mblBreakpoint && isMblScreenNews) {
      // Window has gone from mobile to desktop size.
      console.log("gone desktop");
      isMblScreenNews = false;
      sectionsAndText.forEach(function(sectionAndText) {
        sectionAndText.textBox.classList.remove("transp");
        sectionAndText.textBox.classList.remove("hidden");
      });
    };
  };
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
    emailLink.classList.toggle("hidden-and-transp");
  });
}
