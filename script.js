const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDSnZrlTsmMOUxMBVj3_2rtuFtXC88BsCTmlnCYjo2FW_1deVhXRwFEnEyCrVCKXphQg8UiJPSoRXg/pub?output=csv';

let allItems = [];
let currentView = 'Found'; // Matches the toggle button logic

async function loadData() {
    Papa.parse(SHEET_CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            console.log("Data loaded successfully:", results.data);
            allItems = results.data;
            renderGrid();
        },
        error: (err) => {
            console.error("Error loading CSV:", err);
            document.getElementById('items-grid').innerHTML = "<p>Unable to connect to the database.</p>";
        }
    });
}

function renderGrid() {
    const grid = document.getElementById('items-grid');
    const search = document.getElementById('search-input').value.toLowerCase();
    
    // Filter logic based on your specific columns
    const filtered = allItems.filter(item => {
        // Exact column matches based on your request
        const status = (item['Status'] || "").toLowerCase();
        const itemName = (item['Item Name'] || "").toLowerCase();
        
        // Ensure item is approved and matches the search
        const isApproved = status === 'approved';
        const matchesSearch = itemName.includes(search);
        
        return isApproved && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-results">No approved items found.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <article class="item-card">
            <span class="item-status-tag">GCHS Record</span>
            <h3>${item['Item Name']}</h3>
            <p class="location"><i class="fa-solid fa-location-dot"></i> ${item['Location']}</p>
            <p class="desc">Reported on: ${item['Date']}</p>
            
            <div class="contact-info">
                <a href="mailto:${item['Contact Email']}" class="contact-btn">
                    <i class="fa-solid fa-envelope"></i> Contact Owner/Finder
                </a>
            </div>
            
            <div class="date">Logged: ${item['Timestamp']}</div>
        </article>
    `).join('');
}

// Search and Toggle listeners
document.getElementById('search-input').addEventListener('input', renderGrid);

// Toggle logic (adjust if your sheet has a 'Type' column for Lost vs Found)
document.getElementById('btn-show-found').onclick = () => { renderGrid(); };
document.getElementById('btn-show-lost').onclick = () => { renderGrid(); };

loadData();
