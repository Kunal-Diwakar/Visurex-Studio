function Hero() {
  const frames = {
    currentIndex: 0,
    maxIndex: 538, // Updated to match the new image range
  };

  const canvas = document.querySelector(".canvas");
  const context = canvas.getContext("2d");

  let imagesLoaded = 0;
  const images = [];

  function preloadImages() {
    for (let i = 1; i <= frames.maxIndex; i++) {
      const imgUrl = `/Pics/frame_${i
        .toString()
        .padStart(4, "0")}.jpg`; // Ensure correct padding
      const img = new Image();
      img.src = imgUrl;
      img.alt = "Hero";

      img.onload = function () {
        imagesLoaded++;
        if (imagesLoaded === frames.maxIndex) {
          loadImage(frames.currentIndex); // Load first image once all images are preloaded
          startAnimation(); // Start animation after all images are loaded
        }
      };

      img.onerror = function () {
        console.error(`Error loading image: ${imgUrl}`); // Log loading errors
        // Even if there's an error, increment the loaded count to avoid hanging
        imagesLoaded++;
        if (imagesLoaded === frames.maxIndex) {
          loadImage(frames.currentIndex);
          startAnimation();
        }
      };

      images.push(img); // Push images into the array
    }
  }

  function loadImage(index) {
    if (index >= 0 && index < images.length) {
      // Ensure index is within array bounds
      const img = images[index];

      // Set canvas size to match window size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Calculate scaling for "object-fit: cover" effect
      const scale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height
      ); // Use max to ensure it covers the canvas

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      const offsetX = (canvas.width - newWidth) / 2; // Center horizontally
      const offsetY = (canvas.height - newHeight) / 2; // Center vertically

      // Clear and redraw image on the canvas with "cover" effect
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
    } else {
      console.error("Image not found in array for index:", index); // Debug if the image isn't found
    }
  }

  function startAnimation() {
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".Hero-container",
        start: "top top",
        scrub: 2,
        end: "bottom bottom",
      },
    });

    function updateFrame(index) {
      return {
        currentIndex: index,
        ease: "linear",
        onUpdate: function () {
          loadImage(Math.floor(frames.currentIndex));
        },
      };
    }

    tl.to(frames, updateFrame(40), "a") // 538 / 1345 ~ 0.4 scaling factor
  .to(".animate1, .nav-item-page", { opacity: 0, ease: "linear" }, "a")

  .to(frames, updateFrame(80), "b")
  .to(".animate2", { opacity: 1, ease: "linear" }, "b")
  .to(frames, updateFrame(120), "c")
  .to(".animate2", { opacity: 1, ease: "linear" }, "c")
  .to(frames, updateFrame(160), "d")
  .to(".animate2", { opacity: 0, ease: "linear" }, "d")

  .to(frames, updateFrame(200), "e")
  .to(".animate3", { opacity: 1, ease: "linear" }, "e")
  .to(frames, updateFrame(240), "f")
  .to(".animate3", { opacity: 1, ease: "linear" }, "f")
  .to(frames, updateFrame(280), "g")
  .to(".animate3", { opacity: 0, ease: "linear" }, "g")

  .to(frames, updateFrame(320), "h")
  .to(".canvas", { scale: 0.5, ease: "linear" }, "h")

  .to(frames, updateFrame(360), "i")
  .to(".animate4", { opacity: 1, ease: "expo" }, "i")
  .to(frames, updateFrame(400), "j")
  .to(".line", { width: 180, ease: "expo" }, "j")
  .to(frames, updateFrame(480), "k")
  .to(".animate4", { scale: 2, ease: "circ" }, "k")
  .to(frames, updateFrame(538), "l")
  .to(".canvas", { scale: 1, ease: "circ" }, "l");
  }

  window.addEventListener("resize", function () {
    loadImage(Math.floor(frames.currentIndex));
  });

  preloadImages();
}


function lenis() {
  const lenis = new Lenis();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

function About() {
  gsap.registerPlugin(ScrollTrigger);

  const splitTypes = document.querySelectorAll(".About-text-2"); // Use querySelectorAll to get multiple elements

  splitTypes.forEach((element) => {
    const text = new SplitType(element, { types: "chars" }); // Create the SplitType on the element

    gsap.from(text.chars, {
      scrollTrigger: {
        trigger: element, // Use the element for the scroll trigger
        start: "top 80%",
        end: "top 20%",
        scrub: true,
        markers: false,
      },
      opacity: 0.2,
      stagger: 0.1,
    });
  });
}

function Contact() {
  const galleryImages = document.querySelectorAll(".section-gallery-figure");
  const progress = [];

  // Initialize positions and animation
  const init = () => {
    galleryImages.forEach((image, index) => {
      // Initialize progress for each image with an offset to start off-screen
      progress[index] = -200 * index;
      image.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out"; // Smooth transitions for re-entry
    });

    requestAnimationFrame(animateGallery); // Start animation loop
    pageLoadAnimation(); // Start the page load animation
  };

  // Main gallery animation
  const animateGallery = () => {
    const windowHeight = window.innerHeight;

    galleryImages.forEach((image, index) => {
      const mediaHeight = image.getBoundingClientRect().height;

      // Increment the image's vertical progress
      progress[index] += 0.4;

      // Reset position if it moves out of view at the bottom
      if (progress[index] > windowHeight + mediaHeight) {
        progress[index] = -mediaHeight - 100; // Start slightly off-screen
      }

      // Apply transform for position and scale
      image.style.transform = `translate3d(${getXPos(index)}vw, ${
        progress[index]
      }px, ${getZPos(index)}vw)`;

      // Apply fade-in effect when images are near the visible area
      const opacity =
        progress[index] > -mediaHeight * 0.8 && progress[index] < windowHeight
          ? 1
          : 0;
      image.style.opacity = opacity;
    });

    // Request the next animation frame
    requestAnimationFrame(animateGallery);
  };

  // Calculate X position with variety
  const getXPos = (index) => {
    const positions = [15, 70, 25, 40, 85, 10];
    return positions[index % positions.length]; // Repeat positions if there are more images
  };

  // Calculate Z position for depth effect
  const getZPos = (index) => {
    const positions = [0, 10, -18, 8, -10, 2];
    return positions[index % positions.length];
  };

  const pageLoadAnimation = () => {
    const title = document.querySelector(".section-title > h1");
    const paragraph = document.querySelector(".section-para > p");

    // Set initial positions for animation
    gsap.set(title, { y: -100, opacity: 0 }); // Move title up and make it invisible
    gsap.set(paragraph, { y: 50, opacity: 0 }); // Move paragraph down and make it invisible

    // Animate title and paragraph on page load
    gsap.to(title, {
      duration: 2,
      y: 0,
      opacity: 1,
      ease: "power2.out",
    });
    gsap.to(paragraph, {
      duration: 2,
      y: 0,
      opacity: 1,
      ease: "power2.out",
      delay: 0.3, // Delay to create a stagger effect
    });
  };

  // Start the animation when the page loads
  window.addEventListener("load", init);
}

function footer() {
  // Register GSAP plugin for scroll animations
  gsap.registerPlugin(ScrollTrigger);

  // Animate Footer on Scroll
  gsap.fromTo(
    "#animatedFooter",
    { y: 50 }, // Initial state: hidden and shifted down
    {
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#animatedFooter",
        start: "top bottom", // Trigger when footer enters the viewport
        toggleActions: "play none none reverse", // Play animation when scrolled into view
      },
    }
  );
}



lenis();
Hero();
About();
Contact();
footer();