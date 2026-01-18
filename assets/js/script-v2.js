'use strict';

/*-----------------------------------*\
  #SIDEBAR TOGGLE
\*-----------------------------------*/

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    sidebar.classList.toggle("active");
  });
}

/*-----------------------------------*\
  #THEME TOGGLE
\*-----------------------------------*/

const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem("theme") || "dark";
html.setAttribute("data-theme", currentTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

/*-----------------------------------*\
  #NAVIGATION
\*-----------------------------------*/

const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Navigate to page function
function navigateToPage(targetPage) {
  // Remove active class from all pages and links
  pages.forEach(page => page.classList.remove("active"));
  navigationLinks.forEach(link => link.classList.remove("active"));
  
  // Add active class to target page
  const targetPageElement = document.querySelector(`[data-page="${targetPage}"]`);
  if (targetPageElement) {
    targetPageElement.classList.add("active");
  }
  
  // Add active class to corresponding nav link
  navigationLinks.forEach(link => {
    if (link.innerHTML.toLowerCase() === targetPage) {
      link.classList.add("active");
    }
  });
  
  // Scroll to top
  window.scrollTo(0, 0);
  
  // Save current page to localStorage
  localStorage.setItem("currentPage", targetPage);
}

// Add click event to all nav links
navigationLinks.forEach(link => {
  link.addEventListener("click", function () {
    const targetPage = this.innerHTML.toLowerCase();
    navigateToPage(targetPage);
  });
});

// Restore last visited page on load
window.addEventListener("DOMContentLoaded", function () {
  const savedPage = localStorage.getItem("currentPage");
  if (savedPage) {
    navigateToPage(savedPage);
  }
});

/*-----------------------------------*\
  #SCROLL TO TOP BUTTON
\*-----------------------------------*/

const scrollToTopBtn = document.getElementById("scrollToTop");

window.addEventListener("scroll", function () {
  if (scrollToTopBtn) {
    if (window.scrollY > 400) {
      scrollToTopBtn.classList.add("active");
    } else {
      scrollToTopBtn.classList.remove("active");
    }
  }
});

if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/*-----------------------------------*\
  #STATISTICS COUNTER ANIMATION
\*-----------------------------------*/

function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-count"));
  const duration = 2000; // 2 seconds
  const step = target / (duration / 16); // 60 FPS
  let current = 0;
  
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Intersection Observer for counter animation
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.textContent === "0") {
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

// Observe all stat numbers
const statNumbers = document.querySelectorAll(".stat-number[data-count]");
statNumbers.forEach(stat => counterObserver.observe(stat));

/*-----------------------------------*\
  #PROJECT FILTERING
\*-----------------------------------*/

const filterBtns = document.querySelectorAll("[data-filter-btn]");
const projectItems = document.querySelectorAll(".project-item");

if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const filterValue = this.getAttribute("data-filter-btn");
      
      // Remove active class from all buttons
      filterBtns.forEach(btn => btn.classList.remove("active"));
      
      // Add active class to clicked button
      this.classList.add("active");
      
      // Filter projects
      projectItems.forEach(item => {
        const category = item.getAttribute("data-category");
        
        if (filterValue === "all" || category === filterValue) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    });
  });
}

/*-----------------------------------*\
  #GALLERY FILTERING
\*-----------------------------------*/

const galleryFilterBtns = document.querySelectorAll("[data-gallery-filter]");
const galleryItems = document.querySelectorAll(".gallery-item");

if (galleryFilterBtns.length > 0) {
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const filterValue = this.getAttribute("data-gallery-filter");
      
      // Remove active class from all buttons
      galleryFilterBtns.forEach(btn => btn.classList.remove("active"));
      
      // Add active class to clicked button
      this.classList.add("active");
      
      // Filter gallery items
      galleryItems.forEach(item => {
        const category = item.getAttribute("data-gallery-category");
        
        if (filterValue === "all" || category === filterValue) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    });
  });
}

/*-----------------------------------*\
  #CONTACT FORM
\*-----------------------------------*/

const contactForm = document.getElementById("contactForm");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formSuccess = document.getElementById("formSuccess");

// Form validation
function validateForm() {
  let isValid = true;
  
  formInputs.forEach(input => {
    if (input.value.trim() === "") {
      isValid = false;
    }
  });
  
  if (formBtn) {
    formBtn.disabled = !isValid;
    formBtn.style.opacity = isValid ? "1" : "0.6";
  }
  
  return isValid;
}

// Add input event listeners
formInputs.forEach(input => {
  input.addEventListener("input", validateForm);
});

// Form submission
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate form submission (replace with actual form submission logic)
      formBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon><span>Sending...</span>';
      formBtn.disabled = true;
      
      setTimeout(() => {
        // Show success message
        if (formSuccess) {
          formSuccess.classList.add("show");
        }
        
        // Reset form
        contactForm.reset();
        
        // Reset button
        formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
        formBtn.disabled = true;
        formBtn.style.opacity = "0.6";
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          if (formSuccess) {
            formSuccess.classList.remove("show");
          }
        }, 5000);
      }, 2000);
    }
  });
}

// Initialize form validation state
validateForm();

/*-----------------------------------*\
  #DOWNLOAD RESUME BUTTON
\*-----------------------------------*/

const downloadCvBtn = document.querySelector(".download-cv-btn");

if (downloadCvBtn) {
  downloadCvBtn.addEventListener("click", function () {
    // Replace this with your actual resume file path
    const resumePath = "./assets/resume/Surya_Resume.pdf";
    
    // Create temporary link and trigger download
    const link = document.createElement("a");
    link.href = resumePath;
    link.download = "Surya_Resume.pdf";
    
    // For demonstration, show an alert if file doesn't exist
    // Remove this and uncomment the download code when you have the actual file
    // alert("Resume download");
    
    // Uncomment these lines when you have the actual resume file:
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  });
}

/*-----------------------------------*\
  #SMOOTH SCROLL FOR ANCHOR LINKS
\*-----------------------------------*/

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    
    // Only prevent default for hash links that aren't empty
    if (href !== "#" && href.length > 1) {
      e.preventDefault();
      
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }
  });
});

/*-----------------------------------*\
  #LAZY LOADING IMAGES - FIXED
\*-----------------------------------*/

const images = document.querySelectorAll("img[loading='lazy']");

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      
      // Ensure image is always visible
      img.style.opacity = "1";
      img.removeAttribute("loading");
      
      observer.unobserve(img);
    }
  });
}, {
  rootMargin: "100px"
});

images.forEach(img => {
  // Set initial opacity to 1 to prevent fade-out issues
  img.style.opacity = "1";
  imageObserver.observe(img);
});

/*-----------------------------------*\
  #SKILL PROGRESS ANIMATION
\*-----------------------------------*/

const skillProgressBars = document.querySelectorAll(".skill-progress-fill");

const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressBar = entry.target;
      const targetWidth = progressBar.style.width;
      
      // Reset width to 0 and animate
      progressBar.style.width = "0";
      
      setTimeout(() => {
        progressBar.style.width = targetWidth;
      }, 100);
      
      progressObserver.unobserve(progressBar);
    }
  });
}, { threshold: 0.5 });

skillProgressBars.forEach(bar => progressObserver.observe(bar));

/*-----------------------------------*\
  #GALLERY LIGHTBOX (Simple Implementation)
\*-----------------------------------*/

const galleryViewBtns = document.querySelectorAll(".gallery-view-btn");

galleryViewBtns.forEach(btn => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    
    const galleryItem = this.closest(".gallery-img-box");
    const img = galleryItem.querySelector("img");
    
    if (img) {
      // Create lightbox overlay
      const lightbox = document.createElement("div");
      lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        animation: fadeIn 0.3s ease;
      `;
      
      // Create image element
      const lightboxImg = document.createElement("img");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 15px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      `;
      
      // Create close button
      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
      closeBtn.style.cssText = `
        position: absolute;
        top: 30px;
        right: 30px;
        background: var(--orange-yellow-crayola);
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32px;
        color: var(--smoky-black);
        transition: transform 0.3s ease;
      `;
      
      closeBtn.addEventListener("mouseenter", () => {
        closeBtn.style.transform = "scale(1.1)";
      });
      
      closeBtn.addEventListener("mouseleave", () => {
        closeBtn.style.transform = "scale(1)";
      });
      
      // Append elements
      lightbox.appendChild(lightboxImg);
      lightbox.appendChild(closeBtn);
      document.body.appendChild(lightbox);
      
      // Prevent body scroll
      document.body.style.overflow = "hidden";
      
      // Close lightbox on click
      const closeLightbox = () => {
        lightbox.style.animation = "fadeOut 0.3s ease";
        setTimeout(() => {
          document.body.removeChild(lightbox);
          document.body.style.overflow = "auto";
        }, 300);
      };
      
      lightbox.addEventListener("click", closeLightbox);
      closeBtn.addEventListener("click", closeLightbox);
      
      // Prevent image click from closing
      lightboxImg.addEventListener("click", (e) => e.stopPropagation());
      
      // Close on Escape key
      document.addEventListener("keydown", function escapeHandler(e) {
        if (e.key === "Escape") {
          closeLightbox();
          document.removeEventListener("keydown", escapeHandler);
        }
      });
    }
  });
});

/*-----------------------------------*\
  #ACCESSIBILITY IMPROVEMENTS
\*-----------------------------------*/

// Add keyboard navigation for custom buttons
document.querySelectorAll("button, [role='button']").forEach(btn => {
  btn.addEventListener("keypress", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.click();
    }
  });
});

/*-----------------------------------*\
  #PERFORMANCE OPTIMIZATION
\*-----------------------------------*/

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimize scroll event listeners
const optimizedScroll = debounce(() => {
  // Scroll-dependent functionality here
}, 100);

window.addEventListener("scroll", optimizedScroll);

/*-----------------------------------*\
  #CONSOLE MESSAGE
\*-----------------------------------*/

console.log("%c👋 Welcome to my portfolio!", "color: #ffd700; font-size: 24px; font-weight: bold;");
console.log("%cInterested in the code? Let's connect!", "color: #a8a8a8; font-size: 14px;");
console.log("%cEmail: ponnampalayamsivak.s@northeastern.edu", "color: #ffd700; font-size: 12px;");

/*-----------------------------------*\
  #INITIALIZATION
\*-----------------------------------*/

// Log successful initialization
console.log("✓ Portfolio website initialized successfully");

document.addEventListener("DOMContentLoaded", () => {
  const DASHBOARD_1_URL =
    "https://public.tableau.com/views/Prevs_PostPandemicAirfareTrends/PreandPostPandemic?:showVizHome=no&:embed=true&:toolbar=yes";

  const DASHBOARD_2_URL =
    "https://public.tableau.com/views/2018-2024Airfare/Dashboard1?:showVizHome=no&:embed=true&:toolbar=yes";

  function wireModal(openBtnId, modalId, mountId, url) {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    const mount = document.getElementById(mountId);

    if (!openBtn || !modal || !mount) return;

    const backdrop = modal.querySelector(".viz-modal-backdrop");
    const closeBtn = modal.querySelector(".viz-modal-close");

    const openModal = () => {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      if (!mount.querySelector("iframe")) {
        const iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.title = "Tableau Dashboard";
        iframe.loading = "lazy";
        iframe.allowFullscreen = true;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0";
        mount.appendChild(iframe);
      }
    };

    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      mount.innerHTML = ""; // unload dashboard
    };

    openBtn.addEventListener("click", openModal);
    backdrop?.addEventListener("click", closeModal);
    closeBtn?.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  wireModal("openAirfareViz", "airfareVizModal", "tableauMount1", DASHBOARD_1_URL);
  wireModal("openAirfareViz2", "airfareVizModal2", "tableauMount2", DASHBOARD_2_URL);
});
