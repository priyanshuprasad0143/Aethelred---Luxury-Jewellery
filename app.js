  document.addEventListener('DOMContentLoaded', () => {

            // --- Theme Toggle (Dark/Light Mode) ---
            const themeToggle = document.getElementById('theme-toggle');
            const themeIcon = document.getElementById('theme-icon');
            const html = document.documentElement;

            // On page load, check for saved theme in localStorage
            if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                html.classList.add('dark');
                themeIcon.classList.remove('bi-moon-stars-fill');
                themeIcon.classList.add('bi-sun-fill');
            } else {
                html.classList.remove('dark');
                themeIcon.classList.add('bi-moon-stars-fill');
                themeIcon.classList.remove('bi-sun-fill');
            }

            themeToggle.addEventListener('click', () => {
                html.classList.toggle('dark');
                if (html.classList.contains('dark')) {
                    localStorage.setItem('theme', 'dark');
                    themeIcon.classList.remove('bi-moon-stars-fill');
                    themeIcon.classList.add('bi-sun-fill');
                } else {
                    localStorage.setItem('theme', 'light');
                    themeIcon.classList.add('bi-moon-stars-fill');
                    themeIcon.classList.remove('bi-sun-fill');
                }
            });

            // --- Mobile Menu ---
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenuButton.addEventListener('click', () => {
                mobileMenuButton.classList.toggle('open');
                mobileMenu.classList.toggle('hidden');
            });

            // Close mobile menu when a link is clicked
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuButton.classList.remove('open');
                    mobileMenu.classList.add('hidden');
                });
            });


            // --- Cart Functionality ---
            const cartCountEl = document.getElementById('cart-count');
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            let cartItems = [];

            function handleAddToCart(button, productData) {
                const newItem = { ...productData, id: Date.now() };
                cartItems.push(newItem);
                updateCart();

                // Visual feedback for the button
                const originalText = button.innerHTML;
                button.innerHTML = 'Added <i class="bi bi-check-lg"></i>';
                button.disabled = true;

                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 2000);
            }

            function updateCartCount() {
                const count = cartItems.length;
                cartCountEl.textContent = count;
                if (count > 0) {
                    cartCountEl.classList.add('transform', 'scale-125');
                    setTimeout(() => {
                        cartCountEl.classList.remove('transform', 'scale-125');
                    }, 200);
                }
            }

            function renderCartItems() {
                const cartItemsContainer = document.getElementById('cart-items-container');
                const cartSubtotalEl = document.getElementById('cart-subtotal');
                cartItemsContainer.innerHTML = '';

                if (cartItems.length === 0) {
                    cartItemsContainer.innerHTML = `<p class="text-gray-500 text-center col-span-full">Your cart is empty.</p>`;
                    cartSubtotalEl.textContent = '$0.00';
                    return;
                }

                let subtotal = 0;
                cartItems.forEach(item => {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'flex items-center space-x-4';
                    itemEl.innerHTML = `
                        <img src="${item.img}" alt="${item.name}" class="w-20 h-20 object-cover rounded-md">
                        <div class="flex-grow">
                            <h4 class="font-semibold">${item.name}</h4>
                            <p class="text-primary-gold">${item.price}</p>
                        </div>
                        <button class="remove-from-cart-btn text-gray-400 hover:text-red-500" data-id="${item.id}">&times;</button>
                    `;
                    cartItemsContainer.appendChild(itemEl);
                    const price = parseFloat(item.price.replace('$', '').replace(',', ''));
                    subtotal += price;
                });
                cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            }

            function removeFromCart(itemId) {
                cartItems = cartItems.filter(item => item.id !== itemId);
                updateCart();
            }

            function updateCart() {
                renderCartItems();
                updateCartCount();
            }

            addToCartButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation(); // prevent modal from opening if card is clicked
                    const productCard = button.closest('.product-card');
                    const productData = {
                        name: productCard.dataset.name,
                        price: productCard.dataset.price,
                        img: productCard.dataset.img,
                    };
                    handleAddToCart(button, productData);
                });
            });

            document.getElementById('cart-items-container').addEventListener('click', (e) => {
                if (e.target.closest('.remove-from-cart-btn')) {
                    const itemId = Number(e.target.closest('.remove-from-cart-btn').dataset.id);
                    removeFromCart(itemId);
                }
            });

            // --- Testimonial Slider ---
            const slider = document.getElementById('testimonial-slider');
            const prevBtn = document.getElementById('prev-testimonial');
            const nextBtn = document.getElementById('next-testimonial');
            const testimonials = slider.children;
            const totalTestimonials = testimonials.length;
            let currentIndex = 0;

            function updateSliderPosition() {
                slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            }

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalTestimonials;
                updateSliderPosition();
            });

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
                updateSliderPosition();
            });

            // Auto-slide testimonials
            setInterval(() => {
                currentIndex = (currentIndex + 1) % totalTestimonials;
                updateSliderPosition();
            }, 5000);

            // --- Newsletter Form Validation ---
            const newsletterForm = document.getElementById('newsletter-form');
            const newsletterEmail = document.getElementById('newsletter-email');
            const newsletterMessage = document.getElementById('newsletter-message');

            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterEmail.value;
                if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    newsletterMessage.textContent = 'Thank you for subscribing!';
                    newsletterMessage.className = 'mt-4 text-sm text-green-500';
                    newsletterEmail.value = '';
                } else {
                    newsletterMessage.textContent = 'Please enter a valid email address.';
                    newsletterMessage.className = 'mt-4 text-sm text-red-500';
                }
                setTimeout(() => newsletterMessage.textContent = '', 3000);
            });

            // --- Contact Form ---
            const contactForm = document.getElementById('contact-form');
            const contactMessage = document.getElementById('contact-message');
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                contactMessage.textContent = 'Thank you for your message. We will get back to you soon!';
                contactMessage.className = 'mt-4 text-sm text-green-500';
                contactForm.reset();
                setTimeout(() => contactMessage.textContent = '', 3000);
            });

            // --- Scroll Animations ---
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1
            });

            document.querySelectorAll('.observe-section').forEach(section => {
                observer.observe(section);
            });

            // --- Quick View Modal Logic ---
            const modal = document.getElementById('quick-view-modal');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const quickViewBtns = document.querySelectorAll('.quick-view-btn');

            const modalImg = document.getElementById('modal-img');
            const modalName = document.getElementById('modal-name');
            const modalPrice = document.getElementById('modal-price');
            const modalDesc = document.getElementById('modal-desc');
            const modalAddToCartBtn = document.querySelector('.add-to-cart-modal');

            function openModal(productCard) {
                const name = productCard.dataset.name;
                const price = productCard.dataset.price;
                const img = productCard.dataset.img;
                const desc = productCard.dataset.desc;

                modalImg.src = img;
                modalName.textContent = name;
                modalPrice.textContent = price;
                modalDesc.textContent = desc;

                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    modal.querySelector('.modal-content').classList.remove('scale-95', 'opacity-0');
                }, 10);
            }

            function closeModal() {
                modal.querySelector('.modal-content').classList.add('scale-95', 'opacity-0');
                modal.classList.add('opacity-0');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }

            quickViewBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const productCard = btn.closest('.product-card');
                    openModal(productCard);
                });
            });

            modalAddToCartBtn.addEventListener('click', () => {
                const productData = {
                    name: modalName.textContent,
                    price: modalPrice.textContent,
                    img: modalImg.src
                };
                handleAddToCart(modalAddToCartBtn, productData);
            });

            closeModalBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });

            // --- Cart Modal Logic ---
            const cartModal = document.getElementById('cart-modal');
            const closeCartBtn = document.getElementById('close-cart-btn');
            const cartIconWrapper = document.getElementById('cart-icon-wrapper');

            function openCartModal() {
                cartModal.classList.remove('hidden');
                setTimeout(() => {
                    cartModal.classList.add('open');
                }, 10);
            }

            function closeCartModal() {
                cartModal.classList.remove('open');
                setTimeout(() => {
                    cartModal.classList.add('hidden');
                }, 400);
            }

            cartIconWrapper.addEventListener('click', openCartModal);
            closeCartBtn.addEventListener('click', closeCartModal);
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    closeCartModal();
                }
            });


            // --- Footer Current Year ---
            document.getElementById('current-year').textContent = new Date().getFullYear();
        });