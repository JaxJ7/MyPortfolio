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
  initCertificatesSlider();
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
        { src: "assets/projects/project-mango.jpg", caption: "Ethylene vs Calcium Carbide vs Control: Experimental Ripening Progression" },
        { src: "assets/projects/pdf_p15_img2.png", caption: "Chamber Fabrication: Welded Metal Frame & Mango Ripening Trays" },
        { src: "assets/projects/pdf_p15_img5.png", caption: "Internal DC Circulation Fan & Relay Actuator Control Setup" },
        { src: "assets/projects/pdf_p15_img4.png", caption: "Power Supply Unit, Sensor Wiring & Arduino Microcontroller Board" },
        { src: "assets/projects/pdf_p15_img1.png", caption: "Chamber Technical Blueprint & Airflow Dimension Schematic" },
        { src: "assets/projects/pdf_p15_img3.png", caption: "Chamber External Thermal Enclosure & Insulation Seal Assembly" }
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
        { src: "assets/projects/project-timekeeper.jpg", caption: "Official Donation Turnover Ceremony at Tboli Sbu Senior High School" },
        { src: "assets/projects/pdf_p13_img5.jpeg", caption: "Hardware Soldering & Large-Format 7-Segment LED Circuit Assembly" },
        { src: "assets/projects/pdf_p13_img6.png", caption: "Outdoor Field Programming & Firmware Uploading to Arduino" },
        { src: "assets/projects/pdf_p13_img4.jpeg", caption: "Hardware Installation & Live Campus Acoustic Bell Testing" },
        { src: "assets/projects/pdf_p13_img1.png", caption: "System Hardware Architecture & GSM / RTC Block Diagram" },
        { src: "assets/projects/pdf_p13_img2.png", caption: "Complete Schematic Wiring & High-Power Driver Circuit Blueprint" }
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
        { src: "assets/projects/project-parking.jpg", caption: "MATLAB Simulation: Coordinate Bay & Occupancy Matrix Overview" },
        { src: "assets/projects/pdf_p11_img4.png", caption: "Top Lane Dynamic Vacancy & Green LED Guidance Status In Action" },
        { src: "assets/projects/pdf_p11_img8.png", caption: "All Parking Spaces Available Initial Simulation State" },
        { src: "assets/projects/pdf_p11_img6.png", caption: "Dynamic Multi-Vehicle Occupancy & Live Path Guidance" },
        { src: "assets/projects/pdf_p11_img1.png", caption: "Parking Lot Dimensions & Entry Lane Geometric Blueprint" }
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
        { src: "assets/projects/project-autoquest.jpg", caption: "Auto Quest Platform: Homepage & Vehicle Booking Hero Banner" },
        { src: "assets/projects/pdf_p8_img5.png", caption: "Vehicle Catalog: Chevrolet Camaro, Ford Mustang, Mercedes CLA & G-Class" },
        { src: "assets/projects/pdf_p8_img6.png", caption: "Vehicle Details & Daily Rental Rate Booking Interface" },
        { src: "assets/projects/pdf_p9_img1.png", caption: "Detailed Vehicle Specification & Performance Metric Sheet" },
        { src: "assets/projects/pdf_p9_img4.png", caption: "Promotional Pricing Campaigns & Seasonal Special Offers" },
        { src: "assets/projects/pdf_p9_img5.png", caption: "Administrative SQL Database Dashboard: Fleet & Customer Records" }
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
        { src: "assets/projects/project-dungeon.jpg", caption: "Final Boss Battle Showdown vs Jaxie Jao (The Creator)" },
        { src: "assets/projects/pdf_p5_img4.png", caption: "Turn-Based Combat Screen: Mana Skills & Combat Items" },
        { src: "assets/projects/pdf_p6_img1.png", caption: "In-Game Equipment Marketplace: Weapons & Defensive Armor" },
        { src: "assets/projects/pdf_p6_img2.png", caption: "Weighted Gacha Banner: Equipment Summoning Mechanics" },
        { src: "assets/projects/pdf_p6_img3.png", caption: "Character Stat Progression: Level, Attack, Defense & Health" },
        { src: "assets/projects/pdf_p6_img5.png", caption: "Alchemy Crafting Engine: Monster Drops to Battle Potions" }
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
    { id: 'projects', el: document.getElementById('projects') },
    { id: 'certificates', el: document.getElementById('certificates') }
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

    // If near bottom of the page, activate the last section (certificates)
    const isBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 60);

    if (isBottom) {
      activeId = 'certificates';
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

/* --------------------------------------------------------------------------
   8. Continuous Infinite Loop Certificate Carousel & Preview Modal
   -------------------------------------------------------------------------- */
const certificatesData = [
  {
    title: "AI Essentials: Theory and Practice",
    badge: "Course Accomplishment",
    date: "August 2026",
    issuer: "University of the Philippines Open University (UPOU)",
    img: "assets/Certificates/Certificate_1.png",
    desc: "Rigorous academic course focused on modern artificial intelligence concepts, core machine learning paradigms, neural computing basics, and ethical frameworks for responsible AI deployment in computing applications.",
    skills: ["Artificial Intelligence", "Machine Learning", "Statistical Modeling", "Python", "AI Ethics"]
  },
  {
    title: "Student Leadership Award for Service-Learning",
    badge: "Leadership Award",
    date: "May 9, 2025",
    issuer: "Arrupe Office of Social Formation • AdDU (Pabuos 2025)",
    img: "assets/Certificates/Certificate_2.png",
    desc: "Conferred during the 2025 Pabuos Recognition ceremony for exemplary student leadership, project management, and collaborative service in deploying engineering solutions for community social-learning partners.",
    skills: ["Team Leadership", "Project Management", "Community Outreach", "Service-Learning", "Public Speaking"]
  },
  {
    title: "Stop, Label, and Detect: Introduction to YOLO",
    badge: "AI Seminar",
    date: "April 30, 2025",
    issuer: "PROCESSOR • Ateneo de Davao University",
    img: "assets/Certificates/Certificate_3.png",
    desc: "Hands-on computer vision seminar detailing deep learning object detection using YOLO (You Only Look Once). Covered dataset annotation, bounding box labeling, training models, and deploying real-time inference.",
    skills: ["YOLO Architecture", "Computer Vision", "Object Detection", "Image Annotation", "Deep Learning"]
  },
  {
    title: "The Art of 3D Printing in Engineering",
    badge: "Hands-on Workshop",
    date: "February 5–12, 2025",
    issuer: "GEARS & PROCESSOR • AdDU Robotics Laboratory",
    img: "assets/Certificates/Certificate_4.png",
    desc: "Comprehensive engineering workshop on additive manufacturing technologies, FDM slicing parameter tuning, bed adhesion, structural infill patterns, and rapid hardware casing prototyping for IoT microcontrollers.",
    skills: ["3D Printing", "Additive Manufacturing", "FDM Slicing", "Hardware Enclosures", "CAD Modeling"]
  },
  {
    title: "Web Development Fundamentals: ASP.NET Core",
    badge: "Web Seminar",
    date: "November 18, 2024",
    issuer: "PROCESSOR • Ateneo de Davao University",
    img: "assets/Certificates/Certificate_5.png",
    desc: "Practical full-stack web development workshop utilizing C# and ASP.NET Core. Covered RESTful API design, controller-view patterns, middleware pipelines, and database integration.",
    skills: ["ASP.NET Core", "C#", "Web APIs", "MVC Pattern", "Backend Engineering", "HTTP Pipelines"]
  },
  {
    title: "GitHub: Guide to Basics",
    badge: "Webinar",
    date: "May 15, 2024",
    issuer: "PROCESSOR (Computer Engineering Students' Org)",
    img: "assets/Certificates/Certificate_6.png",
    desc: "In-depth workshop focused on modern software engineering workflows: Git branch management, rebasing, pull requests, collaborative merge conflict resolution, and CI/CD versioning.",
    skills: ["Git", "GitHub", "Version Control", "Code Review", "Branching Workflows", "Team Collaboration"]
  },
  {
    title: "Artificial Intelligence & Machine Learning",
    badge: "AI Workshop",
    date: "May 4, 2024",
    issuer: "PROCESSOR (Online Workshop)",
    img: "assets/Certificates/Certificate_7.png",
    desc: "Intensive university workshop covering supervised and unsupervised learning algorithms, feature engineering, loss functions, regression modeling, and performance evaluation metrics.",
    skills: ["Machine Learning", "Supervised Learning", "Regression Analysis", "Feature Engineering", "Data Analytics"]
  },
  {
    title: "SQL Fundamentals: A Beginner's Guide",
    badge: "Database Workshop",
    date: "April 30, 2024",
    issuer: "PROCESSOR (Online Workshop)",
    img: "assets/Certificates/Certificate_8.png",
    desc: "Technical webinar exploring relational database architecture, relational algebra, SQL querying, JOINs, aggregations, schema normalization (1NF–3NF), and ACID transactions.",
    skills: ["SQL", "Relational Databases", "Schema Normalization", "Query Optimization", "Data Integrity"]
  },
  {
    title: "Circuit Creation: Etching & Soldering",
    badge: "Hardware Workshop",
    date: "March 4, 2024",
    issuer: "SELECOMES • Ateneo de Davao University",
    img: "assets/Certificates/Certificate_9.png",
    desc: "Practical laboratory workshop involving physical copper-clad board transfer, ferric chloride chemical etching, PCB drilling, through-hole and SMD soldering, and oscilloscope continuity testing.",
    skills: ["PCB Etching", "Precision Soldering", "Hardware Prototyping", "Continuity Testing", "Lab Safety"]
  },
  {
    title: "Circuit Design: EagleCAD Seminar",
    badge: "CAD Seminar",
    date: "February 28, 2024",
    issuer: "SELECOMES • Ateneo de Davao University",
    img: "assets/Certificates/Certificate_10.png",
    desc: "Professional electronic design automation (EDA) training covering electronic schematic capture, PCB component placement, trace routing constraints, ground plane isolation, and Gerber CAM export.",
    skills: ["EagleCAD", "Schematic Capture", "PCB Routing", "Electronic Design Automation", "Gerber Generation"]
  },
  {
    title: "Mastering the Circuitry: CpE Hardware",
    badge: "Hardware Workshop",
    date: "February 21, 2024",
    issuer: "PROCESSOR • Ateneo de Davao University",
    img: "assets/Certificates/Certificate_11.png",
    desc: "Academic symposium exploring microelectronic advancements, digital circuitry logic, embedded controller architectures, and hardware-software integration methodologies.",
    skills: ["Hardware Architecture", "Digital Electronics", "Microcontroller Interfacing", "Logical Circuitry"]
  },
  {
    title: "AI Ready ASEAN: Hour of Code Training",
    badge: "Hour of Code",
    date: "2024",
    issuer: "ASEAN Foundation & Limitless Lab (Google.org)",
    img: "assets/Certificates/Certificate_12.png",
    desc: "Regional digital empowerment program conducted across Southeast Asia to train youth in computational logic, algorithmic thinking, and foundational data science principles.",
    skills: ["Computational Thinking", "Algorithmic Logic", "Data Fundamentals", "Python", "ASEAN Digital Skills"]
  },
  {
    title: "Computer Studies Programming Camp",
    badge: "Programming Camp",
    date: "June 22–24, 2022",
    issuer: "Ateneo de Davao University (CSSEC)",
    img: "assets/Certificates/Certificate_13.png",
    desc: "Intensive 3-day coding camp on algorithmic problem solving, computational complexity, object-oriented concepts in C++, and collaborative programming challenges.",
    skills: ["C++", "Algorithmic Problem Solving", "Data Structures", "Object-Oriented Programming", "Hackathon"]
  }
];

function initCertificatesSlider() {
  const wrapper = document.getElementById('cert-slider-wrapper');
  const track = document.getElementById('cert-slider-track');
  const prevBtn = document.getElementById('cert-prev-btn');
  const nextBtn = document.getElementById('cert-next-btn');
  const currentNumEl = document.getElementById('cert-current-num');
  const totalNumEl = document.getElementById('cert-total-num');
  const dotsWrap = document.getElementById('cert-pagination-dots');

  // Preview Modal Elements
  const certModalBackdrop = document.getElementById('cert-preview-backdrop');
  const certModalCloseBtn = document.getElementById('cert-preview-close-btn');
  const certModalDismissBtn = document.getElementById('cert-preview-dismiss-btn');
  const modalImg = document.getElementById('cert-preview-img');
  const modalBadge = document.getElementById('cert-preview-badge');
  const modalDate = document.getElementById('cert-preview-date');
  const modalIssuer = document.getElementById('cert-preview-issuer');
  const modalTitle = document.getElementById('cert-preview-title');
  const modalPrevBtn = document.getElementById('cert-modal-prev-btn');
  const modalNextBtn = document.getElementById('cert-modal-next-btn');
  const modalPagerCount = document.getElementById('cert-modal-pager-count');

  if (!wrapper || !track) return;

  const rawSlides = Array.from(track.querySelectorAll('.cert-card-slide'));
  const totalSlides = rawSlides.length;
  if (totalSlides === 0) return;

  if (totalNumEl) {
    totalNumEl.textContent = String(totalSlides).padStart(2, '0');
  }

  // 1. Tag each real slide and inject preview hover hint
  rawSlides.forEach((slide, idx) => {
    slide.setAttribute('data-real-index', idx);
    const thumbBox = slide.querySelector('.cert-thumb-box');
    if (thumbBox && !thumbBox.querySelector('.cert-thumb-preview-hint')) {
      const hint = document.createElement('div');
      hint.className = 'cert-thumb-preview-hint';
      hint.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path></svg><span>Click for Preview &amp; Details</span>`;
      thumbBox.appendChild(hint);
    }
  });

  // 2. Clone slides for Continuous Seamless Infinite Loop
  const CLONES_COUNT = 3;

  // Clone last CLONES_COUNT slides to prepend (in reverse loop order so DOM order is correct: [10, 11, 12])
  for (let i = totalSlides - 1; i >= totalSlides - CLONES_COUNT; i--) {
    const clone = rawSlides[i].cloneNode(true);
    clone.classList.add('is-clone');
    clone.setAttribute('data-real-index', i);
    track.insertBefore(clone, track.firstChild);
  }

  // Clone first 3 slides to append
  for (let i = 0; i < CLONES_COUNT; i++) {
    const clone = rawSlides[i].cloneNode(true);
    clone.classList.add('is-clone');
    clone.setAttribute('data-real-index', i);
    track.appendChild(clone);
  }

  const allSlides = Array.from(track.querySelectorAll('.cert-card-slide'));
  let currentTrackIndex = CLONES_COUNT; // Starts at real slide 0
  let isAnimating = false;

  // 3. Create pagination dots
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'cert-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to certificate ${i + 1}`);
      dot.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;
        currentTrackIndex = CLONES_COUNT + i;
        goToTrackIndex(currentTrackIndex, true);
      });
      dotsWrap.appendChild(dot);
    }
  }

  // 4. Position and center calculation
  function goToTrackIndex(index, withAnimation = true) {
    currentTrackIndex = index;
    if (withAnimation) {
      track.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
    } else {
      track.style.transition = 'none';
    }

    const targetSlide = allSlides[currentTrackIndex];
    if (!targetSlide) return;

    const wrapperWidth = wrapper.offsetWidth;
    const slideLeft = targetSlide.offsetLeft;
    const slideWidth = targetSlide.offsetWidth;

    const translateX = (wrapperWidth / 2) - (slideLeft + slideWidth / 2);
    track.style.transform = `translateX(${translateX}px)`;

    // Update active-center highlight class
    allSlides.forEach((slide, idx) => {
      const isCenter = idx === currentTrackIndex;
      slide.classList.toggle('active-center', isCenter);
      slide.setAttribute('aria-hidden', isCenter ? 'false' : 'true');
    });

    // Update real index counters and dots
    const realIndex = parseInt(targetSlide.getAttribute('data-real-index'), 10);
    if (currentNumEl) {
      currentNumEl.textContent = String(realIndex + 1).padStart(2, '0');
    }
    if (dotsWrap) {
      const dots = dotsWrap.querySelectorAll('.cert-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === realIndex);
      });
    }
  }

  // 5. Seamless infinite wrap on transitionend
  track.addEventListener('transitionend', (e) => {
    if (e.target !== track) return;
    isAnimating = false;

    // Passed the end of real slides -> teleport back to start real slide
    if (currentTrackIndex >= CLONES_COUNT + totalSlides) {
      currentTrackIndex = currentTrackIndex - totalSlides;
      goToTrackIndex(currentTrackIndex, false);
    }
    // Before the start of real slides -> teleport to end real slide
    else if (currentTrackIndex < CLONES_COUNT) {
      currentTrackIndex = currentTrackIndex + totalSlides;
      goToTrackIndex(currentTrackIndex, false);
    }
  });

  function nextSlide() {
    if (isAnimating) return;
    isAnimating = true;
    currentTrackIndex++;
    goToTrackIndex(currentTrackIndex, true);
    setTimeout(() => { isAnimating = false; }, 580);
  }

  function prevSlide() {
    if (isAnimating) return;
    isAnimating = true;
    currentTrackIndex--;
    goToTrackIndex(currentTrackIndex, true);
    setTimeout(() => { isAnimating = false; }, 580);
  }

  // Arrow button navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
    });
  }

  // Card click behavior:
  // - Clicking active center card opens Preview & Details modal!
  // - Clicking side card smoothly rotates it into center focus!
  allSlides.forEach((slide, idx) => {
    slide.addEventListener('click', () => {
      const realIdx = parseInt(slide.getAttribute('data-real-index'), 10);
      if (idx === currentTrackIndex) {
        openCertModal(realIdx);
      } else {
        if (isAnimating) return;
        isAnimating = true;
        currentTrackIndex = idx;
        goToTrackIndex(currentTrackIndex, true);
        setTimeout(() => { isAnimating = false; }, 580);
      }
    });
  });

  // Touch and Swipe navigation
  let touchStartX = 0;
  let touchEndX = 0;

  wrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 40;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  }, { passive: true });

  // Re-center on window resize
  window.addEventListener('resize', () => {
    goToTrackIndex(currentTrackIndex, false);
  });

  /* ---------------- Modal Controller ---------------- */
  let activeModalIndex = 0;

  function openCertModal(idx) {
    if (idx < 0) idx = totalSlides - 1;
    if (idx >= totalSlides) idx = 0;
    activeModalIndex = idx;

    // Directly extract from the exact raw slide element in the DOM
    const targetCard = rawSlides[activeModalIndex];
    if (!targetCard || !certModalBackdrop) return;

    const cardImg = targetCard.querySelector('.cert-card-img');
    const cardBadge = targetCard.querySelector('.cert-slide-badge');
    const cardTitle = targetCard.querySelector('.cert-card-title, .cert-title');
    const cardOrg = targetCard.querySelector('.cert-card-org');
    const cardDate = targetCard.querySelector('.cert-card-date span');

    const imgSrc = cardImg ? cardImg.getAttribute('src') : '';
    const titleText = cardTitle ? cardTitle.textContent.trim() : '';
    const badgeText = cardBadge ? cardBadge.textContent.trim() : 'Certificate';
    const orgText = cardOrg ? cardOrg.textContent.trim() : '';
    const dateText = cardDate ? cardDate.textContent.trim() : '';

    if (modalImg) {
      modalImg.style.opacity = '0.35';
      modalImg.src = imgSrc;
      modalImg.alt = titleText;
      setTimeout(() => {
        modalImg.style.opacity = '1';
      }, 50);
    }

    if (modalBadge) modalBadge.textContent = badgeText;
    if (modalDate) modalDate.textContent = dateText;
    if (modalIssuer) modalIssuer.textContent = orgText;
    if (modalTitle) modalTitle.textContent = titleText;

    if (modalPagerCount) {
      modalPagerCount.textContent = `${String(activeModalIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
    }

    // Keep background carousel aligned with the currently viewed certificate
    currentTrackIndex = CLONES_COUNT + activeModalIndex;
    goToTrackIndex(currentTrackIndex, false);

    certModalBackdrop.classList.add('open');
    certModalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCertModal() {
    if (!certModalBackdrop) return;
    certModalBackdrop.classList.remove('open');
    certModalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (certModalCloseBtn) certModalCloseBtn.addEventListener('click', closeCertModal);
  if (certModalDismissBtn) certModalDismissBtn.addEventListener('click', closeCertModal);

  if (modalPrevBtn) {
    modalPrevBtn.addEventListener('click', () => {
      openCertModal(activeModalIndex - 1);
    });
  }

  if (modalNextBtn) {
    modalNextBtn.addEventListener('click', () => {
      openCertModal(activeModalIndex + 1);
    });
  }

  if (certModalBackdrop) {
    certModalBackdrop.addEventListener('click', (e) => {
      if (e.target === certModalBackdrop) {
        closeCertModal();
      }
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    // If modal is open, navigate or close modal
    if (certModalBackdrop && certModalBackdrop.classList.contains('open')) {
      if (e.key === 'Escape') {
        closeCertModal();
      } else if (e.key === 'ArrowLeft') {
        openCertModal(activeModalIndex - 1);
      } else if (e.key === 'ArrowRight') {
        openCertModal(activeModalIndex + 1);
      }
      return;
    }

    // Carousel keyboard navigation when section is in view
    const certSection = document.getElementById('certificates');
    if (!certSection) return;
    const rect = certSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });

  // Initial positioning
  setTimeout(() => {
    goToTrackIndex(CLONES_COUNT, false);
  }, 60);
}



