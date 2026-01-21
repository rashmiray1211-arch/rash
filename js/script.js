// Force scroll to top on refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// Clear hash to prevent jump to section
if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
}

window.scrollTo(0, 0);

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

$(document).ready(function () {
    window.scrollTo(0, 0); // extra safety
    $('.slider-container').slick({
        slidesToShow: 2.2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0, // Continuous
        speed: 5000, // Slow smooth scroll
        cssEase: 'linear', // Linear movement
        dots: false,
        arrows: false,
        infinite: true,
        draggable: false, // Disable manual scroll
        swipe: false,     // Disable touch swipe
        touchMove: false, // Disable touch move
        pauseOnHover: false,
        pauseOnFocus: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1.1,
                }
            }
        ]
    });

    console.log("Portfolio loaded with Slick");

    // Existing Parallax (converted to vanilla inside JQ ready or kept separate)
    const badge = document.querySelector('.satisfied-badge');
    if (badge) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX) / 100;
            const y = (window.innerHeight - e.pageY) / 100;
            badge.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    }
    // About Section Image Rotation
    const aboutPhotos = document.querySelectorAll('.about-photo');
    if (aboutPhotos.length > 1) {
        let currentIndex = 0;
        let rotateInterval;

        function startRotation() {
            rotateInterval = setInterval(() => {
                aboutPhotos[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % aboutPhotos.length;
                aboutPhotos[currentIndex].classList.add('active');
            }, 3500); // 3.5s per image - calm pace
        }

        function stopRotation() {
            clearInterval(rotateInterval);
        }

        // Start loop
        startRotation();

        // Pause on hover
        const wrapper = document.querySelector('.about-image-wrapper');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', stopRotation);
            wrapper.addEventListener('mouseleave', startRotation);
        }
    }
    // Simple Line Shatter Animation
    const simpleLineContainer = document.querySelector('.simple-line-inner');
    const simpleLineText = simpleLineContainer ? simpleLineContainer.querySelector('p') : null;

    if (simpleLineContainer && simpleLineText) {
        const originalHTML = simpleLineText.innerHTML;
        // We know it contains a <br>, so split by it to preserve layout
        const lines = originalHTML.split('<br>');

        simpleLineText.innerHTML = lines.map(line => {
            // Split text info chars, wrap in span
            // Use [...line] to handle unicode if needed, but simple split is fine here
            return line.split('').map(char => {
                // Preserve spaces
                if (char === ' ' || char === '\n') return '<span class="char">&nbsp;</span>';
                return `<span class="char">${char}</span>`;
            }).join('');
        }).join('<br>'); // Re-join with break

        const chars = simpleLineText.querySelectorAll('.char');

        simpleLineContainer.addEventListener('mouseenter', () => {
            chars.forEach(char => {
                // Random shatter values
                const x = (Math.random() - 0.5) * 150; // Spread range
                const y = (Math.random() - 0.5) * 150;
                const r = (Math.random() - 0.5) * 360; // Rotation

                char.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
                char.style.opacity = '0'; // Fade out as they break
                char.style.filter = 'blur(5px)';
            });
        });

        simpleLineContainer.addEventListener('mouseleave', () => {
            chars.forEach(char => {
                char.style.transform = '';
                char.style.opacity = '';
                char.style.filter = '';
            });
        });
    }
});
// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before bottom
};

const animateOnScrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        } else {
            entry.target.classList.remove('in-view'); // Re-trigger animation
        }
    });
}, observerOptions);

// Target headings, paragraphs, and other text blocks
const animatedElements = document.querySelectorAll('h1, h2, h3, p, .section-tag, .btn, .cta-button, .stat-item');
animatedElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    animateOnScrollObserver.observe(el);
});

// Submit Button Shake on Hover Back
const submitBtn = document.querySelector('.submit-btn');
if (submitBtn) {
    submitBtn.addEventListener('mouseleave', () => {
        submitBtn.classList.add('shake-anim');
        submitBtn.addEventListener('animationend', () => {
            submitBtn.classList.remove('shake-anim');
        }, { once: true });
    });
}

// CTA Blast Animation
const ctaButtons = document.querySelectorAll('.cta-button, .lets-connect-btn, .submit-btn, .download-cv-btn');

ctaButtons.forEach(btn => {
    // Existing Blast Click Logic
    btn.addEventListener('click', function (e) {
        // Prevent form submission/jump for submit button
        if (btn.classList.contains('submit-btn')) {
            e.preventDefault();

            const form = document.getElementById('contactForm');
            if (form) {
                const formData = new FormData(form);

                // Send email via Web3Forms (Background)
                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (response.ok) {
                        console.log('Form submitted successfully');
                        form.reset(); // Clear form on success
                    } else {
                        console.error('Form submission failed');
                    }
                }).catch(error => console.error('Error:', error));
            }
        }

        // ... (keep blast logic)
        // Create 30 particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('blast-particle');
            document.body.appendChild(particle);

            // Initial Position: Center of click/button
            // Using pageX/Y to account for scroll
            const x = e.pageX;
            const y = e.pageY;

            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            // Random Velocity
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 100 + 50; // Distance
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            // Animate
            const animation = particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0, .9, .57, 1)',
            });

            // Cleanup
            animation.onfinish = () => particle.remove();
        }
    });
});

// Custom Cursor Logic
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

// Only run if cursor elements exist (non-touch/desktop check could be added here or relied on CSS)
if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Use transform translate3d for GPU acceleration instead of left/top
        // Dot follows instantly
        cursorDot.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;

        // Outline uses animate for smooth lag, but properties mapped to transform
        cursorOutline.animate({
            transform: `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover Effect for Interactive Elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .tool-card, .project-card, .folder-card, .submit-btn, .cta-button, .download-cv-btn');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}
