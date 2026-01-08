const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDSnZrlTsmMOUxMBVj3_2rtuFtXC88BsCTmlnCYjo2FW_1deVhXRwFEnEyCrVCKXphQg8UiJPSoRXg/pub?output=csv';

let allItems = [];
let currentType = 'Found';

async function loadData() {
    console.log("Fetching data...");
    Papa.parse(SHEET_CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            console.log("Data loaded:", results.data);
            allItems = results.data;
            renderGrid();
        },
        error: (error) => {
            document.getElementById('items-grid').innerHTML = 
                `<p style="color:red;">Error loading data. Check your CSV link.</p>`;
        }
    });
}

function renderGrid() {
    const grid = document.getElementById('items-grid');
    const search = document.getElementById('search-input').value.toLowerCase();
    
    // SMART FILTERING: This looks for columns even if names aren't perfect
    const filtered = allItems.filter(item => {
        // Find the right columns by searching for keywords
        const getVal = (keywords) => {
            const key = Object.keys(item).find(k => keywords.some(kw => k.toLowerCase().includes(kw)));
            return key ? item[key] : "";
        };

        const status = getVal(['status']).toLowerCase();
        const type = getVal(['type']).toLowerCase();
        const name = getVal(['name', 'title']).toLowerCase();
        const desc = getVal(['description', 'details']).toLowerCase();

        // 1. Only show if Status is 'approved' (or show all if you haven't set up status yet)
        const isApproved = status === 'approved' || status === ''; 
        // 2. Filter by Found vs Lost
        const isCorrectType = type.includes(currentType.toLowerCase());
        // 3. Search filter
        const matchesSearch = name.includes(search) || desc.includes(search);

        return isApproved && isCorrectType && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-results">No ${currentType} items found yet.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(item => {
        // Again, find values regardless of exact column name
        const name = item[Object.keys(item).find(k => k.toLowerCase().includes('name'))] || "Unnamed Item";
        const loc = item[Object.keys(item).find(k => k.toLowerCase().includes('location'))] || "Unknown Location";
        const desc = item[Object.keys(item).find(k => k.toLowerCase().includes('desc'))] || "";
        const date = item[Object.keys(item).find(k => k.toLowerCase().includes('time'))] || "";

        return `
            <article class="item-card">
                <span class="item-status-tag">${currentType}</span>
                <h3>${name}</h3>
                <p class="location"><i class="fa-solid fa-location-dot"></i> ${loc}</p>
                <p class="desc">${desc}</p>
                <div class="date">${date}</div>
            </article>
        `;
    }).join('');
}

// Button Logic
document.getElementById('btn-show-found').onclick = () => { currentType = 'Found'; updateUI('btn-show-found'); };
document.getElementById('btn-show-lost').onclick = () => { currentType = 'Lost'; updateUI('btn-show-lost'); };
document.getElementById('search-input').oninput = renderGrid;

function updateUI(id) {
    document.querySelectorAll('.toggle-group button').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    renderGrid();
}

loadData();
