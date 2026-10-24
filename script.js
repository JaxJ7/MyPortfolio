/* ==========================================================================
   Jaxie H. Jao Portfolio - 10s Auto-scroll Slider & Know More Modal
   Real Engineering Projects from Portfolio PDF
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProjectSlider();
  initProjectModal();
  initCopyEmail();
  initNavScroll();
  initMobileNav();
  initFooterYear();
});

/* --------------------------------------------------------------------------
   1. Interactive Sliding Project Carousel with 10s Auto-Scroll (5 Projects)
   -------------------------------------------------------------------------- */
function initProjectSlider() {
  const wrapper = document.getElementById('slider-wrapper');
  const track = document.getElementById('slider-track');
  const slides = document.querySelectorAll('.slide-card');
  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');
  const currentNumEl = document.getElementById('current-slide-num');
  const totalNumEl = document.getElementById('total-slides-num');
  const dots = document.querySelectorAll('.pag-dot');
  const timerBar = document.getElementById('autoscroll-bar');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  const AUTO_SCROLL_DURATION = 10000; // 10 seconds per user request
  let timerStartTime = null;
  let animationFrameId = null;
  let isPaused = false;
  let elapsedBeforePause = 0;

  if (totalNumEl) {
    totalNumEl.textContent = String(totalSlides).padStart(2, '0');
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Slide track with smooth CSS translation
    const offset = currentIndex * 100;
    const gapOffset = currentIndex * 2;
    track.style.transform = `translateX(calc(-${offset}% - ${gapOffset}rem))`;

    // Update active classes on slides
    slides.forEach((slide, i) => {
      const isActive = i === currentIndex;
      slide.classList.toggle('active', isActive);
      slide.style.opacity = isActive ? '1' : '0.4';
      slide.style.transform = isActive ? 'scale(1)' : 'scale(0.98)';
    });

    // Update counter display
    if (currentNumEl) {
      currentNumEl.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    // Update pagination dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    // Reset 10s auto-scroll countdown
    resetAutoScrollTimer();
  }

  // Auto-scroll loop
  function startAutoScrollTimer(offsetTime = 0) {
    cancelAnimationFrame(animationFrameId);

    timerStartTime = performance.now() - offsetTime;

    function stepTimer(now) {
      if (isPaused) return;

      const elapsed = now - timerStartTime;
      const progress = Math.min(elapsed / AUTO_SCROLL_DURATION, 1);

      // SVG Ring circumference: 2 * PI * 10 ≈ 62.83
      if (timerBar) {
        const circumference = 62.83;
        const offset = circumference * (1 - progress);
        timerBar.style.strokeDashoffset = offset;
      }

      if (progress >= 1) {
        goToSlide(currentIndex + 1);
      } else {
        animationFrameId = requestAnimationFrame(stepTimer);
      }
    }

    animationFrameId = requestAnimationFrame(stepTimer);
  }

  function resetAutoScrollTimer() {
    elapsedBeforePause = 0;
    if (!isPaused) {
      startAutoScrollTimer(0);
    } else if (timerBar) {
      timerBar.style.strokeDashoffset = '62.83';
    }
  }

  function pauseAutoScroll() {
    if (isPaused) return;
    isPaused = true;
    cancelAnimationFrame(animationFrameId);
    if (timerStartTime) {
      elapsedBeforePause = performance.now() - timerStartTime;
    }
  }

  function resumeAutoScroll() {
    if (!isPaused) return;
    isPaused = false;
    startAutoScrollTimer(elapsedBeforePause);
  }

  // Hover on carousel pauses auto-scroll; leaving resumes it
  if (wrapper) {
    wrapper.addEventListener('mouseenter', pauseAutoScroll);
    wrapper.addEventListener('mouseleave', resumeAutoScroll);
  }

  // Next / Prev listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
    });
  }

  // Pagination dots click
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
    });
  });

  // Keyboard navigation when near viewport
  window.addEventListener('keydown', (e) => {
    const modalBackdrop = document.getElementById('project-modal-backdrop');
    if (modalBackdrop && modalBackdrop.classList.contains('open')) return;

    const rect = track.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowLeft') {
      goToSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      goToSlide(currentIndex + 1);
    }
  });

  // Touch & Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    pauseAutoScroll();
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    resumeAutoScroll();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      goToSlide(currentIndex + 1);
    } else if (touchEndX > touchStartX + swipeThreshold) {
      goToSlide(currentIndex - 1);
    }
  }

  // Initialize first slide
  goToSlide(0);
}

/* --------------------------------------------------------------------------
   2. Interactive "Know More" Project Modal (5 Real Projects)
   -------------------------------------------------------------------------- */
function initProjectModal() {
  const backdrop = document.getElementById('project-modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');
  const dismissBtn = document.getElementById('modal-dismiss-btn');
  const knowMoreBtns = document.querySelectorAll('.btn-know-more');

  // Modal target elements
  const tagEl = document.getElementById('modal-tag');
  const titleEl = document.getElementById('modal-title');
  const leadEl = document.getElementById('modal-lead');
  const architectureEl = document.getElementById('modal-architecture');
  const featuresList = document.getElementById('modal-features');
  const techStackWrap = document.getElementById('modal-tech-stack');
  const githubLink = document.getElementById('modal-github-link');

  // Gallery DOM elements
  const galleryMainImg = document.getElementById('gallery-main-img');
  const galleryCounter = document.getElementById('gallery-counter');
  const galleryCaption = document.getElementById('gallery-caption');
  const galleryPrevBtn = document.getElementById('gallery-prev-btn');
  const galleryNextBtn = document.getElementById('gallery-next-btn');
  const galleryThumbsList = document.getElementById('gallery-thumbs-list');
  const galleryToggleAllBtn = document.getElementById('gallery-toggle-all-btn');
  const galleryToggleText = document.getElementById('gallery-toggle-text');

  // Gallery state
  let activePhotos = [];
  let currentPhotoIdx = 0;
  let isThumbsExpanded = false;

  // Authentic project specifications & photo galleries from Jaxie H. Jao's portfolio PDF
  const projectsData = {
    mango: {
      tag: "Undergraduate Thesis • IoT & Embedded Control",
      title: "Small-Scale Arduino-Based Mango Ripening Chamber",
      lead: "An automated climate-controlled chamber engineered as a safer, scientific alternative to toxic calcium carbide (kalburo) for ripening mangoes.",
      photos: [
        { src: "assets/project-mango.jpg", caption: "Ethylene vs Calcium Carbide vs Control: Experimental Ripening Progression" },
        { src: "assets/pdf_p15_img2.png", caption: "Chamber Fabrication: Welded Metal Frame & Mango Ripening Trays" },
        { src: "assets/pdf_p15_img5.png", caption: "Internal DC Circulation Fan & Relay Actuator Control Setup" },
        { src: "assets/pdf_p15_img4.png", caption: "Power Supply Unit, Sensor Wiring & Arduino Microcontroller Board" },
        { src: "assets/pdf_p15_img1.png", caption: "Chamber Technical Blueprint & Airflow Dimension Schematic" },
        { src: "assets/pdf_p15_img3.png", caption: "Chamber External Thermal Enclosure & Insulation Seal Assembly" }
      ],
      architecture: "The Small-Scale Arduino-Based Mango Ripening Chamber is an automated system developed as a safer alternative to traditional calcium carbide for ripening mangoes. Driven by an Arduino Uno microcontroller, the system continuously monitors ambient temperature and relative humidity via a DHT22 sensor, carbon dioxide via an MH-Z19C NDIR sensor, and ethylene gas concentration via an MQ-2 sensor. When gas or temperature thresholds dictate, an automated relay module activates DC ventilation fans and an ultrasonic humidifier to regulate optimal ripening conditions. Sensor readings are logged with precise timestamps from a DS3231 RTC module directly onto an SD card for post-harvest empirical analysis.",
      features: [
        "Environmental Monitoring: Continuously measures temperature, humidity, CO₂, and ethylene gas levels using multi-sensor arrays",
        "Automatic Environmental Control: Activates circulation fans and ultrasonic humidifier to maintain ideal ripening conditions",
        "Ethylene-Based Ripening: Utilizes Ethrel as a safer, regulated ripening agent instead of hazardous calcium carbide",
        "Data Logging: Stores continuous sensor telemetry with timestamps on an SD card for monitoring and agricultural analysis",
        "Real-Time Monitoring: Displays environmental conditions and system operational status during the entire cycle",
        "Semi-Automated Operation: Reduces manual intervention by automatically controlling the chamber environment"
      ],
      techStack: ["Arduino Uno", "C++", "DHT22 Sensor", "MH-Z19C CO₂ Sensor", "MQ-2 Gas Sensor", "DS3231 RTC", "SD Card Module", "Relay Module", "DC Fans", "Ultrasonic Humidifier"],
      github: "https://github.com/JaxJ7"
    },

    timekeeper: {
      tag: "Embedded Systems • Community SLP Project",
      title: "Timekeeper: Automated Bell & Digital Clock System",
      lead: "An Arduino-based real-time clock and automated bell system developed by a six-person engineering team and donated to Tboli Sbu Senior High School.",
      photos: [
        { src: "assets/project-timekeeper.jpg", caption: "Official Donation Turnover Ceremony at Tboli Sbu Senior High School" },
        { src: "assets/pdf_p13_img5.jpeg", caption: "Hardware Soldering & Large-Format 7-Segment LED Circuit Assembly" },
        { src: "assets/pdf_p13_img6.png", caption: "Outdoor Field Programming & Firmware Uploading to Arduino" },
        { src: "assets/pdf_p13_img4.jpeg", caption: "Hardware Installation & Live Campus Acoustic Bell Testing" },
        { src: "assets/pdf_p13_img1.png", caption: "System Hardware Architecture & GSM / RTC Block Diagram" },
        { src: "assets/pdf_p13_img2.png", caption: "Complete Schematic Wiring & High-Power Driver Circuit Blueprint" }
      ],
      architecture: "TimeKeeper is an Arduino-based embedded hardware project developed by a team of six and donated to a local high school as part of an SLP (Student Learning Program) initiative. Powered by an Arduino Uno with a DS1302 Real-Time Clock module and EEPROM memory, it drives a large-format 7-segment digital LED display through MAX7219 driver circuitry for high visibility across campus. A SIM800L GSM cellular module allows authorized staff to wirelessly adjust time and modify alarm schedules via standard SMS text messages. High-power relay modules trigger the school's electric bells automatically according to programmed class periods, while buck converters ensure stable DC voltages.",
      features: [
        "Time Display: Uses a large 7-segment LED display controlled by a MAX7219 driver to show current time",
        "Text-Based Time & Alarm Editing: A GSM module (SIM800L) enables real-time synchronization and alarm modifications via SMS text messages",
        "Automated Alarm System: A relay module triggers an automated bell based on configured school class schedules",
        "Persistent Storage: Onboard EEPROM and DS1302 RTC retain scheduled alarms and time settings even after complete power loss",
        "Power Management: Buck converters regulate DC voltage lines across microcontrollers, drivers, and high-power relays",
        "Community Impact: Directly deployed and donated to support local public education"
      ],
      techStack: ["Arduino Uno", "C++", "SIM800L GSM", "MAX7219 Driver", "DS1302 RTC", "EEPROM", "Relay Module", "Buck Converters", "Circuit Design", "Hand Soldering"],
      github: "https://github.com/JaxJ7"
    },

    parking: {
      tag: "MATLAB • Simulation & Algorithm Design",
      title: "Smart Parking Guidance & Simulation System",
      lead: "A MATLAB-based simulation designed to indicate whether parking spaces are vacant or occupied, providing drivers with an efficient guidance experience.",
      photos: [
        { src: "assets/project-parking.jpg", caption: "MATLAB Simulation: Coordinate Bay & Occupancy Matrix Overview" },
        { src: "assets/pdf_p11_img4.png", caption: "Top Lane Dynamic Vacancy & Green LED Guidance Status In Action" },
        { src: "assets/pdf_p11_img8.png", caption: "All Parking Spaces Available Initial Simulation State" },
        { src: "assets/pdf_p11_img6.png", caption: "Dynamic Multi-Vehicle Occupancy & Live Path Guidance" },
        { src: "assets/pdf_p11_img1.png", caption: "Parking Lot Dimensions & Entry Lane Geometric Blueprint" }
      ],
      architecture: "This project is a MATLAB-based simulation designed to model parking space occupancy dynamically and provide real-time guidance to drivers. The system continuously evaluates coordinate slots representing parking lanes and bays. When vehicle entry or departure is simulated, the space detection algorithm toggles vacancy states, updates graphical indicators, and recalculates available capacity. Visual text indicators guide drivers with 'GREEN' (spaces available in lane) and 'RED' (lane occupied) notifications, accompanied by a dynamic vacancy counter.",
      features: [
        "MATLAB Simulation: Manages dynamic vehicle insertion, lane navigation, and spot departures",
        "Automated Space Detection: Real-time tracking of available and occupied parking slots",
        "Visual Status Guidance: Real-time display updating with 'GREEN' (available) and 'RED' (lane full) signals",
        "Vacancy Counter: Computes and displays the exact number of available parking spaces dynamically",
        "Coordinate Mapping: Models structured parking bays, entry lanes, and directional paths"
      ],
      techStack: ["MATLAB", "Simulation Modeling", "Space Detection Algorithms", "GUI Display", "State Machine Tracking"],
      github: "https://github.com/JaxJ7/SmartParkingSystem"
    },

    autoquest: {
      tag: "Python • Full-Stack Web App • SQLite",
      title: "Auto Quest: Car Rental Web Platform",
      lead: "A full-stack car rental website designed for both corporate employees and customers, featuring multi-tier vehicle reservations and SQL database management.",
      photos: [
        { src: "assets/project-autoquest.jpg", caption: "Auto Quest Platform: Homepage & Vehicle Booking Hero Banner" },
        { src: "assets/pdf_p8_img5.png", caption: "Vehicle Catalog: Chevrolet Camaro, Ford Mustang, Mercedes CLA & G-Class" },
        { src: "assets/pdf_p8_img6.png", caption: "Vehicle Details & Daily Rental Rate Booking Interface" },
        { src: "assets/pdf_p9_img1.png", caption: "Detailed Vehicle Specification & Performance Metric Sheet" },
        { src: "assets/pdf_p9_img4.png", caption: "Promotional Pricing Campaigns & Seasonal Special Offers" },
        { src: "assets/pdf_p9_img5.png", caption: "Administrative SQL Database Dashboard: Fleet & Customer Records" }
      ],
      architecture: "Auto Quest is a full-featured car rental platform engineered with a Python backend and an SQLite relational database. The user interface is built with responsive HTML5, CSS3, and JavaScript. Customers register with driver's license credentials, browse vehicle inventories organized by category (sedans, compacts, subcompacts, and luxury vehicles), and execute reservations on a per-day billing model. The platform incorporates promotional pricing algorithms for holiday sales and exclusive employee discounts, alongside a secure administrative CRUD dashboard.",
      features: [
        "Sign-Up & Login Authentication: Customer registration with location and driver's license records stored in SQLite",
        "Rental Reservation System: Select vehicle, configure rental duration, and calculate total pricing before confirmation",
        "Customer Profile: Tracks customer status (regular vs. employee), contact details, and historical rental transactions",
        "Car Specifications: Detailed vehicle profiles showing engine specs, seating capacity, and daily rates",
        "Promotions & Discounts: Date-specific promotional campaigns (e.g., holiday sales) and employee exclusive deals",
        "Admin Dashboard: Full CRUD capabilities for fleet management, customer accounts, and booking records"
      ],
      techStack: ["Python", "SQLite", "HTML5", "CSS3", "JavaScript", "Relational Database", "CRUD Architecture"],
      github: "https://github.com/JaxJ7/Car-Rental-web-development"
    },

    dungeon: {
      tag: "C# • WPF • Desktop Game Architecture",
      title: "Dungeon Adventure: Turn-Based RPG Application",
      lead: "A desktop role-playing game built in C# and WPF featuring turn-based monster combat, store economies, chance-based gacha rolls, and potion crafting.",
      photos: [
        { src: "assets/project-dungeon.jpg", caption: "Final Boss Battle Showdown vs Jaxie Jao (The Creator)" },
        { src: "assets/pdf_p5_img4.png", caption: "Turn-Based Combat Screen: Mana Skills & Combat Items" },
        { src: "assets/pdf_p6_img1.png", caption: "In-Game Equipment Marketplace: Weapons & Defensive Armor" },
        { src: "assets/pdf_p6_img2.png", caption: "Weighted Gacha Banner: Equipment Summoning Mechanics" },
        { src: "assets/pdf_p6_img3.png", caption: "Character Stat Progression: Level, Attack, Defense & Health" },
        { src: "assets/pdf_p6_img5.png", caption: "Alchemy Crafting Engine: Monster Drops to Battle Potions" }
      ],
      architecture: "Dungeon Adventure is a turn-based role-playing application built in C# using Windows Presentation Foundation (WPF). Designed with clean object-oriented architecture, it features player character state tracking (health, mana, attack, defense, experience), an economy store to purchase weapons and armor, a weighted probability gacha roll mechanic for rare gear, an inventory manager, and an alchemy crafting engine to convert monster drops into combat potions. The game culminates in a multi-tier battle progression ending with a boss showdown against the creator.",
      features: [
        "Multi-Tier Battle System: Standard monster encounters, difficult boss raids, and a final creator showdown",
        "Equipment Store: In-game marketplace to purchase varied weapons and defensive armor",
        "Gacha System: Weighted chance-based equipment summoning for rare and legendary items",
        "Character Information: Real-time stat tracking (level, attack, defense, experience, and mana-consuming skills)",
        "Inventory Management: Manage monster drops and dynamic weapon/armor equipping",
        "Cathedral & Hospital: Restores health and mana pools between dangerous battles",
        "Crafting System: Synthesizes monster drops into consumable health and mana potions"
      ],
      techStack: ["C#", "WPF (.NET)", "XAML", "Object-Oriented Programming", "Game State Management", "Probability Algorithms"],
      github: "https://github.com/JaxJ7/Turnbased-RPG-Game"
    }
  };

  /* ---------------- Gallery Controller ---------------- */
  function showPhoto(idx) {
    if (!activePhotos || activePhotos.length === 0) return;
    if (idx < 0) idx = activePhotos.length - 1;
    if (idx >= activePhotos.length) idx = 0;
    currentPhotoIdx = idx;

    const photo = activePhotos[currentPhotoIdx];

    if (galleryMainImg) {
      galleryMainImg.style.opacity = '0.35';
      galleryMainImg.src = photo.src;
      galleryMainImg.alt = photo.caption;
      setTimeout(() => {
        galleryMainImg.style.opacity = '1';
      }, 60);
    }

    if (galleryCounter) {
      galleryCounter.textContent = `${currentPhotoIdx + 1} / ${activePhotos.length}`;
    }

    if (galleryCaption) {
      galleryCaption.textContent = photo.caption;
    }

    // Update active highlight on thumbnails
    if (galleryThumbsList) {
      const thumbs = galleryThumbsList.querySelectorAll('.thumb-item');
      thumbs.forEach(tb => {
        const itemIdx = parseInt(tb.getAttribute('data-index'), 10);
        if (itemIdx === currentPhotoIdx) {
          tb.classList.add('active');
        } else {
          tb.classList.remove('active');
        }
      });
    }
  }

  function renderThumbnails() {
    if (!galleryThumbsList) return;
    galleryThumbsList.innerHTML = '';

    const total = activePhotos.length;
    if (total === 0) return;

    // Show up to 4 items initially if collapsed and total > 4
    const collapseThreshold = 4;
    const shouldCollapse = !isThumbsExpanded && total > collapseThreshold;
    const displayCount = shouldCollapse ? collapseThreshold : total;

    for (let i = 0; i < displayCount; i++) {
      const item = activePhotos[i];
      const thumbBtn = document.createElement('button');
      thumbBtn.type = 'button';
      thumbBtn.className = 'thumb-item' + (i === currentPhotoIdx ? ' active' : '');
      thumbBtn.setAttribute('data-index', i);
      thumbBtn.setAttribute('aria-label', `View photo ${i + 1}: ${item.caption}`);

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.caption;
      img.loading = 'lazy';
      thumbBtn.appendChild(img);

      // If it's the 4th item in collapsed mode, render "+X More" overlay
      if (shouldCollapse && i === collapseThreshold - 1) {
        const remainingCount = total - (collapseThreshold - 1);
        const overlay = document.createElement('div');
        overlay.className = 'thumb-more-overlay';
        overlay.innerHTML = `+${remainingCount}<span>Photos</span>`;
        thumbBtn.appendChild(overlay);

        thumbBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          isThumbsExpanded = true;
          renderThumbnails();
          showPhoto(i);
        });
      } else {
        thumbBtn.addEventListener('click', () => {
          showPhoto(i);
        });
      }

      galleryThumbsList.appendChild(thumbBtn);
    }

    // Toggle button visibility and text
    if (galleryToggleAllBtn) {
      if (total > collapseThreshold) {
        galleryToggleAllBtn.style.display = 'inline-flex';
        if (isThumbsExpanded) {
          if (galleryToggleText) galleryToggleText.textContent = 'Show Less';
          galleryToggleAllBtn.classList.add('expanded');
        } else {
          if (galleryToggleText) galleryToggleText.textContent = `View All Photos (${total})`;
          galleryToggleAllBtn.classList.remove('expanded');
        }
      } else {
        galleryToggleAllBtn.style.display = 'none';
      }
    }
  }

  // Gallery Navigation Controls
  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPhoto(currentPhotoIdx - 1);
    });
  }

  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPhoto(currentPhotoIdx + 1);
    });
  }

  if (galleryToggleAllBtn) {
    galleryToggleAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isThumbsExpanded = !isThumbsExpanded;
      renderThumbnails();
    });
  }

  function openModal(projectId) {
    const data = projectsData[projectId];
    if (!data || !backdrop) return;

    if (tagEl) tagEl.textContent = data.tag;
    if (titleEl) titleEl.textContent = data.title;
    if (leadEl) leadEl.textContent = data.lead;
    if (architectureEl) architectureEl.textContent = data.architecture;

    // Load gallery for this project
    activePhotos = data.photos || [];
    currentPhotoIdx = 0;
    isThumbsExpanded = false;
    showPhoto(0);
    renderThumbnails();

    if (featuresList) {
      featuresList.innerHTML = '';
      data.features.forEach(feat => {
        const li = document.createElement('li');
        li.textContent = feat;
        featuresList.appendChild(li);
      });
    }

    if (techStackWrap) {
      techStackWrap.innerHTML = '';
      data.techStack.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'skill-pill';
        span.textContent = tech;
        techStackWrap.appendChild(span);
      });
    }

    if (githubLink) {
      githubLink.href = data.github;
    }

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!backdrop) return;
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  knowMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project-id');
      openModal(id);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!backdrop || !backdrop.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      showPhoto(currentPhotoIdx - 1);
    } else if (e.key === 'ArrowRight') {
      showPhoto(currentPhotoIdx + 1);
    }
  });
}

/* --------------------------------------------------------------------------
   3. Copy to Clipboard (Email & Contact Number)
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const EMAIL = 'jaxiehjao7@gmail.com';
  const PHONE = '09455425170';

  function copyAction(textToCopy, successMsg, btnElement) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast(successMsg);
      if (btnElement) {
        const textSpan = btnElement.querySelector('.copy-text') || btnElement;
        const originalText = textSpan.textContent;
        textSpan.textContent = 'Copied!';
        setTimeout(() => {
          textSpan.textContent = originalText;
        }, 2000);
      }
    }).catch(() => {
      showToast('Could not copy to clipboard');
    });
  }

  // Email Copy Buttons (Hero & About Me)
  const heroCopyEmailBtn = document.getElementById('hero-copy-email-btn');
  const aboutCopyBtn = document.getElementById('about-copy-btn');

  if (heroCopyEmailBtn) {
    heroCopyEmailBtn.addEventListener('click', () => {
      copyAction(EMAIL, 'Email address copied to clipboard!', heroCopyEmailBtn);
    });
  }

  if (aboutCopyBtn) {
    aboutCopyBtn.addEventListener('click', () => {
      copyAction(EMAIL, 'Email address copied to clipboard!', aboutCopyBtn);
    });
  }

  // Phone Copy Buttons (Hero & About Me)
  const heroCopyPhoneBtn = document.getElementById('hero-copy-phone-btn');
  const aboutCopyPhoneBtn = document.getElementById('about-copy-phone-btn');

  if (heroCopyPhoneBtn) {
    heroCopyPhoneBtn.addEventListener('click', () => {
      copyAction(PHONE, 'Contact number copied to clipboard!', heroCopyPhoneBtn);
    });
  }

  if (aboutCopyPhoneBtn) {
    aboutCopyPhoneBtn.addEventListener('click', () => {
      copyAction(PHONE, 'Contact number copied to clipboard!', aboutCopyPhoneBtn);
    });
  }
}

/* --------------------------------------------------------------------------
   4. Scrollspy & Header Enhancement
   -------------------------------------------------------------------------- */
function initNavScroll() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-links .nav-item');

  const sections = [
    { id: 'hero', el: document.getElementById('hero') },
    { id: 'about', el: document.getElementById('about') },
    { id: 'experience', el: document.getElementById('experience') },
    { id: 'skills', el: document.getElementById('skills') },
    { id: 'projects', el: document.getElementById('projects') }
  ].filter(item => item.el !== null);

  function updateActiveNav() {
    const scrollY = window.scrollY;

    // Header border enhancement on scroll
    if (header) {
      if (scrollY > 30) {
        header.style.borderBottomColor = 'rgba(255, 255, 255, 0.14)';
      } else {
        header.style.borderBottomColor = 'var(--border-subtle)';
      }
    }

    let activeId = 'hero';

    // If near bottom of the page, activate the last section (projects)
    const isBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 60);

    if (isBottom) {
      activeId = 'projects';
    } else {
      // 150px threshold accounts for the 72px fixed header plus reading offset
      const triggerOffset = 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const item = sections[i];
        const rect = item.el.getBoundingClientRect();
        if (rect.top <= triggerOffset) {
          activeId = item.id;
          break;
        }
      }
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === `#${activeId}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // Instant feedback on click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        navLinks.forEach(l => l.classList.toggle('active', l === link));
      }
    });
  });

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('resize', updateActiveNav, { passive: true });

  // Initial calculation on page load
  updateActiveNav();
}

/* --------------------------------------------------------------------------
   5. Mobile Navigation Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    toggleBtn.classList.toggle('active', isOpen);
  });

  navLinks.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      toggleBtn.classList.remove('active');
    });
  });
}

/* --------------------------------------------------------------------------
   6. Toast Notification Helper
   -------------------------------------------------------------------------- */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/* --------------------------------------------------------------------------
   7. Footer Year
   -------------------------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
