import {$} from "../utils/domUtils.js";

export const JSCarousel = ({
                               carouselSelector,
                               slideSelector = null,
                               enableAutoplay = true,
                               autoplayInterval = 2000,
                               enablePagination = true
                           }) => {
    let currentSlideIndex = 0;
    let prevBtn, nextBtn;
    let autoplayTimer;
    let paginationContainer;

    const carousel = $(carouselSelector);

    if (!carousel) {
        console.error("Specify a valid selector for the carousel.");
        return null;
    }

    // Find all slides within the carousel
    const slides = carousel.querySelectorAll(slideSelector);

    // If no slides are found, log an error and return null
    if (!slides.length) {
        console.error("Specify a valid selector for slides.");
        return null;
    }

    /*
     * Utility function to create and append HTML elements with
     * attributes and children
     */
    const addElement = (tag, attributes, children) => {
        const element = document.createElement(tag);

        if (attributes) {
            // Set attributes for the element
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }

        if (children) {
            // Set content for the element
            if (typeof children === "string") {
                element.textContent = children;
            } else {
                children.forEach((child) => {
                    if (typeof child === "string") {
                        element.appendChild(document.createTextNode(child));
                    } else {
                        element.appendChild(child);
                    }
                });
            }
        }

        return element;
    };

    /*
     * Function to modify the DOM structure to fit the carousel's
     * requirements
     */
    const tweakStructure = () => {
        carousel.setAttribute("tabindex", "0");

        // Create a div for carousel inner content
        const carouselInner = addElement("div", {
            class: "carousel-inner"
        });
        carousel.insertBefore(carouselInner, slides[0]);

        // Move slides into the carousel inner container
        slides.forEach((slide) => {
            carouselInner.appendChild(slide);
        });

        // Create and append previous and next buttons
        prevBtn = addElement(
            "btn",
            {
                class: "carousel-btn carousel-btn--prev-next carousel-btn--prev",
                "aria-label": "Previous Slide"
            },
            "<"
        );

        nextBtn = addElement(
            "btn",
            {
                class: "carousel-btn carousel-btn--prev-next carousel-btn--next",
                "aria-label": "Next Slide"
            },
            ">"
        );

        carouselInner.appendChild(prevBtn);
        carouselInner.appendChild(nextBtn);

        // If pagination is enabled, create and append pagination buttons
        if (enablePagination) {
            paginationContainer = addElement("nav", {
                class: "carousel-pagination",
                role: "tablist"
            });
            carousel.appendChild(paginationContainer);
        }

        /*
         * Set initial styles and event listeners for slides and pagination
         * buttons
         */
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${index * 100}%)`;
            if (enablePagination) {
                const paginationBtn = addElement(
                    "btn",
                    {
                        class: `carousel-btn caroursel-btn--${index + 1}`,
                        role: "tab"
                    },
                    `${index + 1}`
                );

                paginationContainer.appendChild(paginationBtn);

                if (index === 0) {
                    paginationBtn.classList.add("carousel-btn--active");
                    paginationBtn.setAttribute("aria-selected", true);
                }

                paginationBtn.addEventListener("click", () => {
                    handlePaginationBtnClick(index);
                });
            }
        });
    };

    // Function to adjust slide positions
    const adjustSlidePosition = () => {
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${100 * (i - currentSlideIndex)}%)`;
        });
    };

    // Function to update pagination buttons
    const updatePaginationBtns = () => {
        const btns = paginationContainer.children;
        const prevActiveBtns = Array.from(btns).filter((btn) =>
            btn.classList.contains("carousel-btn--active")
        );
        const currentActiveBtn = btns[currentSlideIndex];

        prevActiveBtns.forEach((btn) => {
            btn.classList.remove("carousel-btn--active");
            btn.removeAttribute("aria-selected");
        });
        if (currentActiveBtn) {
            currentActiveBtn.classList.add("carousel-btn--active");
            currentActiveBtn.setAttribute("aria-selected", true);
        }
    };

    // Function to update carousel state
    const updateCarouselState = () => {
        if (enablePagination) {
            updatePaginationBtns();
        }
        adjustSlidePosition();
    };

    // Function to move slide based on direction
    const moveSlide = (direction) => {
        currentSlideIndex = direction === "next"
            ? (currentSlideIndex + 1) % slides.length
            : (currentSlideIndex - 1 + slides.length) % slides.length;
        updateCarouselState();
    };

    // Event handler for pagination button click
    const handlePaginationBtnClick = (index) => {
        currentSlideIndex = index;
        updateCarouselState();
    };

    // Event handlers for previous and next button clicks
    const handlePrevBtnClick = () => moveSlide("prev");

    const handleNextBtnClick = () => moveSlide("next");

    // Event handler for keyboard navigation
    const handleKeyboardNav = (event) => {
        if (!carousel.contains(event.target)) return;
        if (event.defaultPrevented) return;

        switch (event.key) {
            case "ArrowLeft":
                moveSlide("prev");
                break;
            case "ArrowRight":
                moveSlide("next");
                break;
            default:
                return;
        }

        event.preventDefault();
    };

    // Function to start autoplay
    const startAutoplay = () => {
        autoplayTimer = setInterval(() => {
            moveSlide("next");
        }, autoplayInterval);
    };

    // Function to stop autoplay
    const stopAutoplay = () => clearInterval(autoplayTimer);

    // Event handlers for mouse enter and leave events for autoplay
    const handleMouseEnter = () => stopAutoplay();

    const handleMouseLeave = () => startAutoplay();

    // Attach event listeners to relevant elements
    const attachEventListeners = () => {
        prevBtn.addEventListener("click", handlePrevBtnClick);
        nextBtn.addEventListener("click", handleNextBtnClick);
        carousel.addEventListener("keydown", handleKeyboardNav);
        if (enableAutoplay && autoplayInterval !== null) {
            carousel.addEventListener("mouseenter", handleMouseEnter);
            carousel.addEventListener("mouseleave", handleMouseLeave);
        }
    };

    // Function to initialize the carousel
    const create = () => {
        tweakStructure();
        attachEventListeners();
        if (enableAutoplay && autoplayInterval !== null) {
            startAutoplay();
        }
    };

    // Function to destroy the carousel
    const destroy = () => {
        // Remove event listeners and stop autoplay if enabled
        if (enablePagination) {
            prevBtn.removeEventListener("click", handlePrevBtnClick);
            nextBtn.removeEventListener("click", handleNextBtnClick);
            carousel.removeEventListener("keydown", handleKeyboardNav);
        }

        if (enableAutoplay && autoplayInterval !== null) {
            carousel.removeEventListener("mouseenter", handleMouseEnter);
            carousel.removeEventListener("mouseleave", handleMouseLeave);
            stopAutoplay();
        }
    };

    /*
     * Return an object containing methods to create and destroy the
     * carousel
     */
    return { create, destroy };
};