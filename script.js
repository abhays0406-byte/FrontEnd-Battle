/**
 * Armory AI - Interactive Logic Script
 * Features state-isolated pricing calculator and context-locked bento accordion.
 * Integrates search modal overlay, back-to-top button, interactive nodes hover, and live stats simulation.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Premium Preloader Fadeout
     ========================================================================== */
  const loader = document.getElementById('loader');
  if (loader) {
    // Hide loader once DOM is ready (simulating premium load speed < 500ms)
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 450);
  }


  /* ==========================================================================
     2. Hero Section 3D undulating terrain generator
     ========================================================================== */
  const terrain = document.getElementById('matrix-terrain');
  if (terrain) {
    const gridCount = 256; // 16x16 nodes
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < gridCount; i++) {
      const node = document.createElement('div');
      node.className = 'terrain-node';
      
      // Calculate row & column
      const row = Math.floor(i / 16);
      const col = i % 16;
      
      // Map delay based on wave sine to form a beautiful landscape ripple
      const waveDelay = (Math.sin(row / 2.5) + Math.cos(col / 2.5)) * 1.2;
      node.style.animationDelay = `${waveDelay}s`;
      fragment.appendChild(node);
    }
    terrain.appendChild(fragment);
  }


  /* ==========================================================================
     3. Animated Metric Counters (Viewport Triggered)
     ========================================================================== */
  const metricValues = document.querySelectorAll('.metric-value');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const label = el.textContent; // Read original text containing unit (e.g. '11ms', '9x', '87%')
    const unit = label.replace(/[0-9]/g, ''); // Extract 'ms', 'x', '%'
    const startVal = parseInt(label, 10) || 0;
    
    let current = startVal;
    const duration = 1200; // ms
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out formula
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      current = Math.round(startVal + easeProgress * (target - startVal));
      el.textContent = `${current}${unit}`;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  // Trigger metrics animation on viewport intersection
  const metricsSection = document.querySelector('.metrics-grid');
  if (metricsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          metricValues.forEach(animateCounter);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(metricsSection);
  } else {
    // Fallback if observer is unsupported
    metricValues.forEach(animateCounter);
  }


  /* ==========================================================================
     4. Case Studies Slider
     ========================================================================== */
  const track = document.getElementById('slider-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const slides = document.querySelectorAll('.slide-card');
  
  if (track && prevBtn && nextBtn && slides.length > 0) {
    let activeSlideIndex = 0;
    
    const updateSlider = () => {
      // Check if mobile viewport
      const isMobile = window.innerWidth <= 768;
      
      slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        if (idx === activeSlideIndex) {
          slide.classList.add('active');
        }
      });

      if (isMobile) {
        track.style.transform = `translateX(-${activeSlideIndex * 100}%)`;
      } else {
        // Desktop slider calculations
        const translatePercent = activeSlideIndex * 33.333;
        track.style.transform = `translateX(-${translatePercent}%)`;
      }
    };

    nextBtn.addEventListener('click', () => {
      const maxIndex = window.innerWidth <= 768 ? slides.length - 1 : slides.length - 3;
      if (activeSlideIndex < maxIndex) {
        activeSlideIndex++;
      } else {
        activeSlideIndex = 0; // Wrap around
      }
      updateSlider();
    });

    prevBtn.addEventListener('click', () => {
      if (activeSlideIndex > 0) {
        activeSlideIndex--;
      } else {
        const maxIndex = window.innerWidth <= 768 ? slides.length - 1 : slides.length - 3;
        activeSlideIndex = maxIndex; // Wrap around to end
      }
      updateSlider();
    });

    window.addEventListener('resize', updateSlider);
  }


  /* ==========================================================================
     5. Bento-to-Accordion Wrapper with State Persistence (Feature 2)
     ========================================================================== */
  let currentActiveIndex = 0; // Shared state index representing the active card

  const bentoCards = document.querySelectorAll('.bento-node-card');
  const accordionItems = document.querySelectorAll('.accordion-item');
  const sphere = document.getElementById('wireframe-sphere');

  // Desktop Hover Interaction
  bentoCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const index = parseInt(card.getAttribute('data-index'), 10);
      currentActiveIndex = index;
      
      // Update visual active classes
      bentoCards.forEach(bc => bc.classList.remove('active'));
      card.classList.add('active');

      // Manipulate wireframe animation speed based on selected node
      if (sphere) {
        const duration = 18 - (index * 4); // index 0 = 18s, index 3 = 6s speedup
        sphere.style.animationDuration = `${duration}s`;
      }
    });
  });

  // Mobile Accordion Click Interaction
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index'), 10);
      const isActive = item.classList.contains('active');

      accordionItems.forEach(ai => {
        ai.classList.remove('active');
        ai.querySelector('.accordion-content').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        const content = item.querySelector('.accordion-content');
        content.style.maxHeight = `${content.scrollHeight}px`;
        currentActiveIndex = index;
      }
    });
  });

  // Context Lock Transition Handler on Resize
  let resizeTimer;
  const handleViewportResizeSync = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // Transfer desktop active card index over to mobile accordion
        accordionItems.forEach((item, idx) => {
          const content = item.querySelector('.accordion-content');
          if (idx === currentActiveIndex) {
            item.classList.add('active');
            content.style.maxHeight = `${content.scrollHeight}px`;
            // Smoothly scroll the item into view
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else {
            item.classList.remove('active');
            content.style.maxHeight = null;
          }
        });
      } else {
        // Transfer mobile active accordion index back to desktop bento card
        bentoCards.forEach((card, idx) => {
          if (idx === currentActiveIndex) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });
      }
    }, 150); // Debounce resize checks
  };

  window.addEventListener('resize', handleViewportResizeSync);
  // Initial check on load
  handleViewportResizeSync();


  /* ==========================================================================
     6. Performance-Isolated Pricing Calculations (Feature 1)
     ========================================================================== */
  // Base Monthly rates defined in matrix
  const pricingMatrix = {
    starter: { base: 19 },
    pro: { base: 49 },
    enterprise: { base: 99 }
  };

  // Conversions and regional tariffs
  const conversionRates = {
    USD: { symbol: '$', rate: 1.0, tariff: 1.0 },
    EUR: { symbol: '€', rate: 0.92, tariff: 1.05 },
    INR: { symbol: '₹', rate: 83.0, tariff: 0.75 }
  };

  const cycleToggleBtn = document.getElementById('billing-cycle-toggle');
  const currencySelector = document.getElementById('currency-selector');
  
  // Cache DOM nodes containing price text strings to ensure strict state isolation
  const priceStarterVal = document.getElementById('price-starter-val');
  const priceProVal = document.getElementById('price-pro-val');
  const priceEnterpriseVal = document.getElementById('price-enterprise-val');

  const priceStarterSymbol = document.getElementById('price-starter-symbol');
  const priceProSymbol = document.getElementById('price-pro-symbol');
  const priceEnterpriseSymbol = document.getElementById('price-enterprise-symbol');

  const labelMonthly = document.getElementById('label-monthly');
  const labelAnnual = document.getElementById('label-annual');

  let currentBillingCycle = 'monthly'; // 'monthly' or 'annual'
  let currentCurrency = 'USD'; // 'USD', 'EUR', 'INR'

  const updatePricesIsolated = () => {
    const rateDetails = conversionRates[currentCurrency];
    const symbol = rateDetails.symbol;
    const isAnnual = currentBillingCycle === 'annual';

    // Compute prices dynamically from configuration matrix without component reflows
    Object.keys(pricingMatrix).forEach(tier => {
      const base = pricingMatrix[tier].base;
      
      // Formula: base * exchange rate * regional tariff adjustments
      let finalPrice = base * rateDetails.rate * rateDetails.tariff;
      
      if (isAnnual) {
        // Flat 20% annual discount applied to monthly value
        finalPrice = finalPrice * 0.8;
      }
      
      const roundedPrice = Math.round(finalPrice);

      // Selectively write to textContent of targeted DOM text nodes to isolate state updates
      if (tier === 'starter') {
        priceStarterSymbol.textContent = symbol;
        priceStarterVal.textContent = roundedPrice;
      } else if (tier === 'pro') {
        priceProSymbol.textContent = symbol;
        priceProVal.textContent = roundedPrice;
      } else if (tier === 'enterprise') {
        priceEnterpriseSymbol.textContent = symbol;
        priceEnterpriseVal.textContent = roundedPrice;
      }
    });
  };

  // Event Listeners for Currency Change
  if (currencySelector) {
    currencySelector.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      updatePricesIsolated();
    });
  }

  // Event Listeners for Billing Toggle
  if (cycleToggleBtn) {
    cycleToggleBtn.addEventListener('click', () => {
      const isActive = cycleToggleBtn.classList.contains('active');
      
      if (isActive) {
        cycleToggleBtn.classList.remove('active');
        currentBillingCycle = 'monthly';
        labelMonthly.classList.add('active');
        labelAnnual.classList.remove('active');
      } else {
        cycleToggleBtn.classList.add('active');
        currentBillingCycle = 'annual';
        labelMonthly.classList.remove('active');
        labelAnnual.classList.add('active');
      }
      updatePricesIsolated();
    });
  }


  /* ==========================================================================
     7. Tabs Component (Engineered for Autonomy)
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      
      const targetContent = document.getElementById(`tab-${targetTab}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });


  /* ==========================================================================
     8. FAQ Accordion component
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(fi => {
        fi.classList.remove('active');
        fi.querySelector('.faq-content').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        const content = item.querySelector('.faq-content');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });


  /* ==========================================================================
     9. Responsive Mobile Menu Drawer Toggle
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.style.display === 'flex';
      if (isOpen) {
        navMenu.style.display = 'none';
        menuToggle.classList.remove('open');
      } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = 'var(--header-height)';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.backgroundColor = 'var(--bg-dark)';
        navMenu.style.padding = '2rem';
        navMenu.style.borderBottom = '1px solid var(--card-border)';
        menuToggle.classList.add('open');
      }
    });
  }


  /* ==========================================================================
     10. Search Overlay Modal Toggle (search.svg & x-mark.svg integration)
     ========================================================================== */
  const searchTrigger = document.getElementById('search-trigger');
  const searchClose = document.getElementById('search-close');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');

  if (searchTrigger && searchClose && searchOverlay) {
    searchTrigger.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 100);
    });

    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
    });

    // Close on overlay background click
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        searchOverlay.classList.remove('active');
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
      }
    });
  }


  /* ==========================================================================
     11. Floating Back to Top Button (chevron-up-solid.svg integration)
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* ==========================================================================
     12. Interactive Canvas Nodes Connection Pulses
     ========================================================================== */
  const canvasNodes = document.querySelectorAll('.canvas-node');
  const connectionPaths = document.querySelectorAll('.nodes-svg-layer path');

  canvasNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      // Highlight all connection lines on hover to simulate active routing
      connectionPaths.forEach(path => {
        path.classList.add('active');
      });
      // Add glowing styling to neighboring nodes
      canvasNodes.forEach(n => {
        if (n !== node) n.classList.add('connected-active');
      });
    });

    node.addEventListener('mouseleave', () => {
      connectionPaths.forEach(path => {
        path.classList.remove('active');
      });
      canvasNodes.forEach(n => {
        n.classList.remove('connected-active');
      });
    });
  });


  /* ==========================================================================
     13. Live Telemetry Real-time Data Simulation (Performance-Isolated)
     ========================================================================== */
  const telemetryLoad = document.getElementById('telemetry-load');
  const telemetrySla = document.getElementById('telemetry-sla');
  const telemetryTokens = document.getElementById('telemetry-tokens');
  const barChart = document.getElementById('bar-chart');

  if (telemetryLoad && telemetrySla && telemetryTokens) {
    // Simulate real-time metric fluctuations directly on textNodes (Zero-Reflow)
    setInterval(() => {
      // 1. System Load fluctuation (e.g. 98.4% - 98.9%)
      const loadVal = (98.4 + Math.random() * 0.5).toFixed(1);
      telemetryLoad.textContent = `${loadVal}%`;

      // 2. SLA Response fluctuation (99.97% - 99.99%)
      const slaVal = (99.97 + Math.random() * 0.02).toFixed(2);
      telemetrySla.textContent = `${slaVal}%`;
      
      // Update badge in active bar chart column directly
      const activeBadge = barChart ? barChart.querySelector('.chart-bar.active .bar-badge') : null;
      if (activeBadge) {
        activeBadge.textContent = `${slaVal}%`;
      }

      // 3. Token usage counter increments slightly (e.g. 8.41M - 8.49M)
      const tokenVal = (8.40 + Math.random() * 0.09).toFixed(2);
      telemetryTokens.textContent = `${tokenVal}M`;

      // 4. Slightly jitter heights of other columns in the bar chart to show live activity
      if (barChart) {
        const bars = barChart.querySelectorAll('.chart-bar:not(.active)');
        bars.forEach(bar => {
          const currentHeight = parseInt(bar.style.height, 10);
          const jitter = (Math.random() * 10 - 5); // jitter by +/- 5%
          const newHeight = Math.max(30, Math.min(95, currentHeight + jitter));
          bar.style.height = `${newHeight}%`;
        });
      }
    }, 2500); // Trigger updates every 2.5 seconds
  }

});
