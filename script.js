// Replace this with your "Publish to Web" CSV link
const SHEET_CSV_URL = 'PASTE_YOUR_PUBLISHED_CSV_HERE';

let allItems = []; // To store data for searching/filtering
let currentView = 'Found'; // Default view

async function init() {
    Papa.parse(SHEET_CSV_URL, {
        download: true,
        header: true,
        complete: (results) => {
            allItems = results.data;
            renderItems();
        }
    });
}

function renderItems() {
    const grid = document.getElementById('items-grid');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    // Filter by View (Lost vs Found), Search, and APPROVAL status
    const filtered = allItems.filter(item => {
        const matchesType = item['Type'] === currentView;
        const isApproved = item['Status'] === 'approved';
        const matchesSearch = item['Item Name'].toLowerCase().includes(searchTerm) || 
                              item['Description'].toLowerCase().includes(searchTerm);
        
        return matchesType && isApproved && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-results">No ${currentView} items found.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <div class="item-card">
            <div class="item-status-tag">${item['Type']}</div>
            <h3>${item['Item Name']}</h3>
            <p class="location"><i class="fa-solid fa-location-dot"></i> ${item['Location Found/Lost']}</p>
            <p class="desc">${item['Description']}</p>
            <div class="date">${item['Timestamp']}</div>
        </div>
    `).join('');
}

// Event Listeners for Buttons
document.getElementById('btn-show-found').addEventListener('click', (e) => {
    currentView = 'Found';
    updateButtons(e.target);
});

document.getElementById('btn-show-lost').addEventListener('click', (e) => {
    currentView = 'Lost';
    updateButtons(e.target);
});

document.getElementById('search-input').addEventListener('input', renderItems);

function updateButtons(activeBtn) {
    document.querySelectorAll('.controls button').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
    renderItems();
}

init();
