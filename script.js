// Get DOM Elements
const cardWrapper = document.querySelector('.card-wrapper');
const card3dContainer = document.querySelector('.card-3d-container');

// Initialize
function init() {
    // Add click event listener
    cardWrapper.addEventListener('click', handleCardClick);

    // Add touch event listener for mobile
    cardWrapper.addEventListener('touchstart', handleCardClick);
}

// Handle Card Click/Tap
function handleCardClick(e) {
    // Prevent default touch behavior
    if (e.type === 'touchstart') {
        e.preventDefault();
    }

    // Toggle the card
    toggleCard();
}

// Toggle Card Animation
function toggleCard() {
    card3dContainer.classList.toggle('opened');
    
    const isOpened = card3dContainer.classList.contains('opened');
    const status = isOpened ? '🎉 Card Opened!' : '📭 Card Closed!';
    console.log(status);
}

// Initialize on DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
