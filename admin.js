// script.js (Main Public Page)

// 1. Load Approved Items (Read Only)
function loadItems(filterType = 'found', searchQuery = '') {
    const grid = document.getElementById('items-grid');
    grid.innerHTML = '<p>Loading...</p>';

    // Only get items that the admin has approved
    let query = db.collection('items').where('approved', '==', true);

    if (filterType !== 'all') {
        query = query.where('type', '==', filterType);
    }

    query.get().then((snapshot) => {
        grid.innerHTML = '';
        if (snapshot.empty) {
            grid.innerHTML = '<p>No items found.</p>';
            return;
        }

        snapshot.forEach((doc) => {
            const item = doc.data();
            // Basic client-side search filtering
            if (searchQuery && 
               !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
               !item.location.toLowerCase().includes(searchQuery.toLowerCase())) {
                return;
            }

            const card = document.createElement('div');
            card.className = `card ${item.type}`;
            card.innerHTML = `
                <span class="tag ${item.type}">${item.type.toUpperCase()}</span>
                <h3>${item.name}</h3>
                <small><i class="fa-regular fa-calendar"></i> ${item.date}</small>
                <p><strong>Location:</strong> ${item.location}</p>
                <p><strong>Contact:</strong> ${item.contact}</p>
            `;
            grid.appendChild(card);
        });
    });
}

// 2. Submit New Report
document.getElementById('report-form').addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('items').add({
        type: document.getElementById('type').value,
        name: document.getElementById('itemName').value,
        location: document.getElementById('location').value,
        date: document.getElementById('date').value,
        contact: document.getElementById('contact').value,
        approved: false, // DEFAULT IS FALSE
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById('report-modal').style.display = "none";
        document.getElementById('report-form').reset();
        alert("Report submitted! It will appear once an admin approves it.");
    }).catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong.");
    });
});

// Initial Load
loadItems('found');
