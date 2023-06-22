import './index.scss'
import './js/sliders'

const tabButtons = document.querySelectorAll('.rooms-tab-btn');
const tabContent = document.querySelectorAll('.rooms-tab-item');

tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const tabNumber = button.getAttribute('data-tab');
        switchTab(tabNumber);
    });
});
function switchTab(tabNumber:string) {
    tabContent.forEach((tab) => {
        tab.classList.remove('active');
    });

    const selectedTab = document.querySelector(`.rooms-tab-item[data-tab="${tabNumber}"]`);

    selectedTab.classList.add('active');

    tabButtons.forEach((button) => {
        button.classList.remove('active');
    });

    const selectedTabButton = document.querySelector(`.rooms-tab-btn[data-tab="${tabNumber}"]`);
    selectedTabButton.classList.add('active');
}
