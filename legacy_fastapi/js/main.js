/* global lucide */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Navbar Scroll Effect
    const navbar = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('bg-[#0f172a]/90', 'backdrop-blur-md', 'shadow-lg');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('bg-[#0f172a]/90', 'backdrop-blur-md', 'shadow-lg');
            navbar.classList.add('bg-transparent');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuBtn.querySelector('i');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenuIcon.setAttribute('data-lucide', 'x');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenuIcon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons(); // Re-render icons
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuIcon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });
    });
    // Check Authentication Status and Update Navbar
    const userJson = localStorage.getItem('currentUser');
    const authButtonsContainer = document.getElementById('auth-buttons');
    const mobileAuthButtonsContainer = document.getElementById('mobile-auth-buttons');

    if (userJson) {
        const user = JSON.parse(userJson);

        // Desktop Navbar Update
        if (authButtonsContainer) {
            authButtonsContainer.innerHTML = `
                <div class="flex items-center gap-4">
                    <a href="dashboard.html" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Dashboard
                    </a>
                    <div class="w-8 h-8 rounded-full overflow-hidden border border-slate-600 bg-slate-700 flex items-center justify-center">
                        ${user.photoURL
                    ? `<img src="${user.photoURL}" alt="User" class="w-full h-full object-cover">`
                    : `<i data-lucide="user" class="w-4 h-4 text-white"></i>`
                }
                    </div>
                    <button onclick="logout()" class="btn btn-outline text-sm py-2 px-4 rounded-full flex items-center gap-2 text-red-400 hover:bg-red-500/10 border-red-500/50 cursor-pointer">
                        <i data-lucide="log-out" class="w-4 h-4"></i>
                        Logout
                    </button>
                </div>
            `;
            // Remove the 'hidden' class if it was applied to a parent (not needed here as we replace content)
        }

        // Mobile Navbar Update
        if (mobileAuthButtonsContainer) {
            mobileAuthButtonsContainer.innerHTML = `
                <a href="dashboard.html" class="text-slate-300 hover:text-white py-2 flex justify-between items-center border-t border-slate-800 mt-2">
                    Dashboard
                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                </a>
                <button onclick="logout()" class="btn btn-outline w-full justify-center text-center text-red-400 border-red-500/50 mt-2">
                    Logout
                </button>
            `;
        }
    }

    // Re-initialize icons for newly added elements
    lucide.createIcons();

    // Contact Form AJAX Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('contact-submit-btn');
            const feedbackArea = document.getElementById('contact-feedback');
            const btnText = submitBtn.querySelector('span');

            // Collect Data
            const formData = {
                name: document.getElementById('contact-name').value,
                institution: document.getElementById('contact-institution').value, // Optional, can be appended to message
                role: document.getElementById('contact-role').value, // Optional
                email: document.getElementById('contact-email').value,
                phone: document.getElementById('contact-phone').value, // Optional
                message: `Institution: ${document.getElementById('contact-institution').value}\nRole: ${document.getElementById('contact-role').value}\nPhone: ${document.getElementById('contact-phone').value}\n\nMessage:\n${document.getElementById('contact-message').value}`,
                subject: "New Inquiry from DoMoreLabs Website"
            };

            // Setup UI for loading
            submitBtn.disabled = true;
            btnText.textContent = "Sending...";
            feedbackArea.className = "hidden text-sm py-2 px-4 rounded-lg"; // Reset

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    feedbackArea.textContent = "Thank you! Your inquiry has been sent successfully.";
                    feedbackArea.className = "text-sm py-2 px-4 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 mt-4";
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to send message');
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                feedbackArea.textContent = "Sorry, there was an error sending your message. Please try again later or email us directly.";
                feedbackArea.className = "text-sm py-2 px-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/50 mt-4";
            } finally {
                // Restore UI
                submitBtn.disabled = false;
                btnText.textContent = "Send Inquiry";

                // Hide success message after a few seconds
                if (feedbackArea.classList.contains('text-emerald-400')) {
                    setTimeout(() => {
                        feedbackArea.classList.add('hidden');
                    }, 5000);
                }
            }
        });
    }
});

// Global Logout Function
// eslint-disable-next-line no-unused-vars
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
