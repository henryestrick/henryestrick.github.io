// Configuration
const CONFIG = {
    // Google Sheet CSV URL (PUBLISH TO WEB AS CSV and paste the URL here)
    // Instructions: Open your Google Sheet -> File -> Share -> Publish to web -> CSV -> Copy URL
    GOOGLE_SHEET_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ.../pub?output=csv',
    
    // Column mapping from Google Sheet to display fields
    // Updated to match your Google Form response columns
    COLUMN_MAPPING: {
        timestamp: 'Timestamp',
        status: 'Status',  // This should contain "Lost" or "Found"
        itemName: 'Item Name',
        location: 'Location',
        date: 'Date',
        contactEmail: 'Contact Email'
    },
    
    // Display settings
    ITEMS_PER_PAGE: 50,
    DEFAULT_IMAGE: 'https://cdn-icons-png.flaticon.com/512/126/126083.png'
};

// State management
let state = {
    allItems: [],
    displayedItems: [],
    activeTab: 'found',
    searchQuery: ''
};

// DOM Elements
const elements = {
    itemsGrid: document.getElementById('items-grid'),
    btnShowFound: document.getElementById('btn-show-found'),
    btnShowLost: document.getElementById('btn-show-lost'),
    searchInput: document.getElementById('search-input')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Load data from Google Sheet
    await loadData();
    
    // Display initial items
    updateDisplay();
}

// Set up all event listeners
function setupEventListeners() {
    // Tab switching
    elements.btnShowFound.addEventListener('click', () => switchTab('found'));
    elements.btnShowLost.addEventListener('click', () => switchTab('lost'));
    
    // Search functionality
    elements.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        updateDisplay();
    });
    
    // Debounce search for better performance
    let searchTimeout;
    elements.searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            state.searchQuery = elements.searchInput.value.toLowerCase().trim();
            updateDisplay();
        }, 300);
    });
}

// Switch between Found and Lost tabs
function switchTab(tab) {
    if (state.activeTab === tab) return;
    
    state.activeTab = tab;
    
    // Update active button styling
    if (tab === 'found') {
        elements.btnShowFound.classList.add('active');
        elements.btnShowLost.classList.remove('active');
    } else {
        elements.btnShowLost.classList.add('active');
        elements.btnShowFound.classList.remove('active');
    }
    
    // Update display
    updateDisplay();
}

// Load data from Google Sheet
async function loadData() {
    try {
        showLoading();
        
        // Fetch CSV data
        const response = await fetch(CONFIG.GOOGLE_SHEET_CSV_URL);
        const csvText = await response.text();
        
        // Parse CSV
        const parsedData = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true
        });
        
        // Process and store data
        state.allItems = processSheetData(parsedData.data);
        
        console.log(`Loaded ${state.allItems.length} items from Google Sheet`);
        
    } catch (error) {
        console.error('Error loading data from Google Sheet:', error);
        showError('Failed to load data. Please try again later.');
    }
}

// Process raw sheet data into usable format
function processSheetData(rawData) {
    return rawData.map((row, index) => {
        // Map sheet columns to our application fields
        const item = {
            id: index + 1,
            // Normalize status to lowercase and check for "lost" or "found"
            status: (row[CONFIG.COLUMN_MAPPING.status] || '').toLowerCase(),
            name: row[CONFIG.COLUMN_MAPPING.itemName] || 'Unnamed Item',
            location: row[CONFIG.COLUMN_MAPPING.location] || 'Not specified',
            // Use the Date column if available, otherwise use Timestamp
            date: formatDate(row[CONFIG.COLUMN_MAPPING.date] || row[CONFIG.COLUMN_MAPPING.timestamp]),
            contactEmail: row[CONFIG.COLUMN_MAPPING.contactEmail] || '',
            timestamp: row[CONFIG.COLUMN_MAPPING.timestamp] || new Date().toISOString(),
            // Additional inferred properties for better search
            itemType: inferItemType(row[CONFIG.COLUMN_MAPPING.itemName] || '')
        };
        
        // Normalize status to 'found' or 'lost'
        if (item.status.includes('found')) {
            item.status = 'found';
        } else if (item.status.includes('lost')) {
            item.status = 'lost';
        } else {
            // Default to 'found' if status is unclear
            item.status = 'found';
        }
        
        return item;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first
}

// Infer item type from item name for better categorization
function inferItemType(itemName) {
    const name = itemName.toLowerCase();
    
    // Common item categories
    const categories = {
        electronics: ['phone', 'laptop', 'tablet', 'charger', 'headphone', 'earbud', 'calculator', 'watch'],
        clothing: ['jacket', 'hoodie', 'sweater', 'shirt', 'pants', 'hat', 'cap', 'glove', 'scarf', 'uniform'],
        accessories: ['wallet', 'keys', 'water bottle', 'bag', 'backpack', 'lunchbox', 'bracelet', 'necklace'],
        school: ['book', 'binder', 'notebook', 'folder', 'pen', 'pencil', 'planner', 'textbook', 'id card'],
        sports: ['jersey', 'cleats', 'ball', 'goggles', 'helmet', 'glove', 'racket']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => name.includes(keyword))) {
            return category;
        }
    }
    
    return 'other';
}

// Get appropriate icon for item type
function getItemIcon(itemType) {
    const iconMap = {
        electronics: 'fa-solid fa-mobile-screen',
        clothing: 'fa-solid fa-shirt',
        accessories: 'fa-solid fa-bag-shopping',
        school: 'fa-solid fa-book',
        sports: 'fa-solid fa-baseball-bat-ball',
        other: 'fa-solid fa-box'
    };
    
    return iconMap[itemType] || iconMap.other;
}

// Update the display based on current state
function updateDisplay() {
    // Filter items based on active tab and search query
    state.displayedItems = state.allItems.filter(item => {
        // Filter by tab
        if (state.activeTab === 'found' && item.status !== 'found') return false;
        if (state.activeTab === 'lost' && item.status !== 'lost') return false;
        
        // Filter by search query
        if (state.searchQuery) {
            const searchableText = `
                ${item.name} 
                ${item.location} 
                ${item.itemType}
            `.toLowerCase();
            
            return searchableText.includes(state.searchQuery);
        }
        
        return true;
    });
    
    // Render items
    renderItems();
}

// Render items to the grid
function renderItems() {
    if (state.displayedItems.length === 0) {
        showEmptyState();
        return;
    }
    
    // Create HTML for each item
    const itemsHTML = state.displayedItems
        .slice(0, CONFIG.ITEMS_PER_PAGE)
        .map(item => createItemCard(item))
        .join('');
    
    // Update grid
    elements.itemsGrid.innerHTML = itemsHTML;
    
    // Add click handlers for contact buttons
    addContactHandlers();
}

// Create HTML for a single item card
function createItemCard(item) {
    const statusClass = item.status === 'found' ? 'type-found' : 'type-lost';
    const statusText = item.status === 'found' ? 'FOUND' : 'LOST';
    const iconClass = getItemIcon(item.itemType);
    
    return `
        <div class="item-card" data-id="${item.id}">
            <div class="item-image">
                <div class="default-image">
                    <i class="${iconClass}"></i>
                </div>
            </div>
            <div class="item-content">
                <div class="item-header">
                    <h3 class="item-title">${escapeHTML(item.name)}</h3>
                    <span class="item-type ${statusClass}">${statusText}</span>
                </div>
                
                <div class="item-details">
                    <div class="detail-row">
                        <i class="fas fa-map-marker-alt"></i>
                        <span><strong>Location:</strong> ${escapeHTML(item.location)}</span>
                    </div>
                    
                    <div class="detail-row">
                        <i class="fas fa-calendar-day"></i>
                        <span><strong>Date:</strong> ${item.date}</span>
                    </div>
                    
                    <div class="detail-row">
                        <i class="fas fa-tag"></i>
                        <span><strong>Type:</strong> ${item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1)}</span>
                    </div>
                </div>
                
                <div class="item-actions">
                    ${item.contactEmail ? `
                        <button class="contact-btn" data-email="${escapeHTML(item.contactEmail)}">
                            <i class="fas fa-envelope"></i> Contact Reporter
                        </button>
                    ` : `
                        <button class="contact-btn disabled" disabled>
                            <i class="fas fa-envelope"></i> No Contact Info
                        </button>
                    `}
                </div>
                
                <div class="item-date">
                    <i class="far fa-calendar"></i>
                    <span>Reported: ${formatTimestamp(item.timestamp)}</span>
                </div>
            </div>
        </div>
    `;
}

// Add event handlers for contact buttons
function addContactHandlers() {
    document.querySelectorAll('.contact-btn:not(.disabled)').forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            if (email) {
                window.location.href = `mailto:${email}?subject=GCHS Lost & Found Inquiry`;
            }
        });
    });
}

// Show loading state
function showLoading() {
    elements.itemsGrid.innerHTML = `
        <div class="loading">
            <i class="fa-solid fa-circle-notch fa-spin"></i>
            <p>Loading lost and found items...</p>
        </div>
    `;
}

// Show empty state
function showEmptyState() {
    const message = state.searchQuery 
        ? `No ${state.activeTab} items match your search. Try different keywords.`
        : `No ${state.activeTab} items have been reported yet.`;
    
    const icon = state.activeTab === 'found' 
        ? 'fa-solid fa-search'
        : 'fa-solid fa-question-circle';
    
    elements.itemsGrid.innerHTML = `
        <div class="empty-state">
            <i class="${icon}"></i>
            <h3>No ${state.activeTab === 'found' ? 'Found' : 'Lost'} Items</h3>
            <p>${message}</p>
            ${!state.searchQuery ? `<p>Check back soon or report a new item.</p>` : ''}
        </div>
    `;
}

// Show error state
function showError(message) {
    elements.itemsGrid.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-exclamation-triangle"></i>
            <h3>Unable to Load Data</h3>
            <p>${message}</p>
            <p>Please check your connection and try again.</p>
        </div>
    `;
}

// Format date for display
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Try parsing as MM/DD/YYYY format
            const parts = dateString.split('/');
            if (parts.length === 3) {
                date = new Date(parts[2], parts[0] - 1, parts[1]);
            }
        }
        
        if (isNaN(date.getTime())) return 'Date not specified';
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Date not specified';
    }
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'Recent';
        
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Recent';
    }
}

// Simple HTML escape to prevent XSS
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Manual refresh function (can be called from console if needed)
window.refreshData = async function() {
    await loadData();
    updateDisplay();
    alert('Data refreshed successfully!');
};

// Auto-refresh every 5 minutes
setInterval(async () => {
    const oldCount = state.allItems.length;
    await loadData();
    if (state.allItems.length !== oldCount) {
        updateDisplay();
        console.log('Data auto-refreshed. New item count:', state.allItems.length);
    }
}, 300000); // 5 minutes

// Add keyboard shortcut for search (Ctrl/Cmd + F)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        elements.searchInput.focus();
        elements.searchInput.select();
    }
});
