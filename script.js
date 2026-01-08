const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDSnZrlTsmMOUxMBVj3_2rtuFtXC88BsCTmlnCYjo2FW_1deVhXRwFEnEyCrVCKXphQg8UiJPSoRXg/pubhtml';

let allItems = [];
let currentType = 'Found'; // Matches the 'Found Items' button

async function loadData() {
    Papa.parse(SHEET_CSV_URL, {
        download: true,
        header: true,
        complete: (results) => {
            allItems = results.data;
            renderGrid();
        }
    });
}

function renderGrid() {
    const grid = document.getElementById('items-grid');
    const search = document.getElementById('search-input').value.toLowerCase();
    
    const filtered = allItems.filter(item => {
        // Ensure these column names match your Google Sheet exactly!
        const isApproved = item.Status === 'approved';
        const isCorrectType = item.Type === currentType;
        const matchesSearch = item['Item Name'].toLowerCase().includes(search) || 
                              item.Description.toLowerCase().includes(search);
        
        return isApproved && isCorrectType && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-results">No ${currentType.toLowerCase()} items found matching your search.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <article class="item-card">
            <span class="item-status-tag">${item.Type}</span>
            <h3>${item['Item Name']}</h3>
            <p class="location"><i class="fa-solid fa-location-dot"></i> ${item['Location Found/Lost']}</p>
            <p class="desc">${item.Description}</p>
            <div class="date">Reported on: ${item.Timestamp}</div>
        </article>
    `).join('');
}

// Control listeners
document.getElementById('btn-show-found').addEventListener('click', () => {
    currentType = 'Found';
    toggleButtons('btn-show-found');
});

document.getElementById('btn-show-lost').addEventListener('click', () => {
    currentType = 'Lost';
    toggleButtons('btn-show-lost');
});

document.getElementById('search-input').addEventListener('input', renderGrid);

function toggleButtons(id) {
    document.getElementById('btn-show-found').classList.remove('active');
    document.getElementById('btn-show-lost').classList.remove('active');
    document.getElementById(id).classList.add('active');
    renderGrid();
}

loadData();
