
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDSnZrlTsmMOUxMBVj3_2rtuFtXC88BsCTmlnCYjo2FW_1deVhXRwFEnEyCrVCKXphQg8UiJPSoRXg/pub?output=csv';

const grid = document.getElementById('items-grid');
const searchInput = document.getElementById('search-input');
const btnShowFound = document.getElementById('btn-show-found');
const btnShowLost = document.getElementById('btn-show-lost');

let allItems = [];
let currentFilter = 'Found'; // Matches the case in your Google Form (e.g., "Found" vs "found")

// 1. Fetch and Parse Data
function loadData() {
    Papa.parse(SHEET_URL, {
        download: true,
        header: true, // Uses the first row of sheet as keys
        complete: function(results) {
            // Process the raw data
            allItems = results.data.map((row, index) => {
                return {
                    id: index,
                    timestamp: row['Timestamp'],
                    type: row['Status'] ? row['Status'].trim() : '', // 'Lost' or 'Found'
                    name: row['Item Name'],
                    location: row['Location'],
                    date: row['Date'],
                    contact: row['Contact Email']
                };
            }).filter(item => item.name); // Filter out empty rows
            
            // Reverse array so newest items show first
            allItems.reverse();

            // Initial Render
            renderItems(currentFilter);
        }
    });
}

// 2. Render Function
function renderItems(filterType = 'all', searchQuery = '') {
    grid.innerHTML = '';
    
    // Filter
    const filteredItems = allItems.filter(item => {
        // Safety check: ensure item.type exists
        if (!item.type) return false;

        const matchesType = item.type.toLowerCase() === filterType.toLowerCase();
        const matchesSearch = (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                              (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesType && matchesSearch;
    });

    if (filteredItems.length === 0) {
        grid.innerHTML = '<p>No items found.</p>';
        return;
    }

    // Create Cards
    filteredItems.forEach(item => {
        const card = document.createElement('div');
        // Add class for styling (lowercase)
        const typeClass = item.type.toLowerCase(); 
        card.className = `card ${typeClass}`;
        
        card.innerHTML = `
            <span class="tag ${typeClass}">${item.type}</span>
            <h3>${item.name}</h3>
            <small>${item.date || item.timestamp}</small>
            <p><strong>Location:</strong> ${item.location}</p>
            <p><strong>Contact:</strong> ${item.contact}</p>
        `;
        grid.appendChild(card);
    });
}

// 3. Event Listeners
btnShowFound.addEventListener('click', () => {
    currentFilter = 'Found';
    updateActiveButton(btnShowFound);
    renderItems('Found', searchInput.value);
});

btnShowLost.addEventListener('click', () => {
    currentFilter = 'Lost';
    updateActiveButton(btnShowLost);
    renderItems('Lost', searchInput.value);
});

searchInput.addEventListener('input', (e) => {
    renderItems(currentFilter, e.target.value);
});

function updateActiveButton(activeBtn) {
    document.querySelectorAll('.controls button').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Start
loadData();
