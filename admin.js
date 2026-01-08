// Test if variables are alive
setTimeout(() => {
    if (typeof auth !== 'undefined' && typeof db !== 'undefined') {
        console.log("✅ SUCCESS: auth and db variables are loaded!");
    } else {
        console.error("❌ ERROR: auth or db is missing. Check your script order in HTML.");
    }
}, 1000);

function loadPendingItems() {
    const list = document.getElementById('pending-list');
    const pendingCountEl = document.getElementById('count-pending');
    const approvedCountEl = document.getElementById('count-approved');
    const logoutBtn = document.getElementById('logout-btn');

    // Show the logout button now that we are logged in
    if(logoutBtn) logoutBtn.style.display = 'block';

    // 1. LIVE STATS: Count Pending Items
    db.collection('items').where('status', '==', 'pending')
      .onSnapshot(snapshot => {
          pendingCountEl.innerText = snapshot.size;
          
          // Update the list view
          let html = '';
          if (snapshot.empty) {
              html = '<div style="text-align:center; padding:20px;">No pending items to review. You\'re all caught up!</div>';
          } else {
              snapshot.forEach(doc => {
                  const item = doc.data();
                  html += `
                    <div class="pending-item" id="item-${doc.id}">
                        <div style="display:flex; justify-content:space-between;">
                            <h3>${item.title} <span style="font-size:0.8rem; color:#666;">(${item.type})</span></h3>
                            <span style="color:var(--warning); font-weight:bold;">PENDING</span>
                        </div>
                        <p>${item.description}</p>
                        <small><i class="fa-solid fa-user"></i> ${item.userEmail} | <i class="fa-solid fa-calendar"></i> ${item.date}</small>
                        <div class="item-actions">
                            <button class="btn btn-approve" onclick="updateStatus('${doc.id}', 'approved')">
                                <i class="fa-solid fa-check"></i> Approve
                            </button>
                            <button class="btn btn-deny" onclick="updateStatus('${doc.id}', 'denied')">
                                <i class="fa-solid fa-xmark"></i> Deny
                            </button>
                        </div>
                    </div>
                  `;
              });
          }
          list.innerHTML = html;
      });

    // 2. LIVE STATS: Count Approved Items
    db.collection('items').where('status', '==', 'approved')
      .onSnapshot(snapshot => {
          approvedCountEl.innerText = snapshot.size;
      });
}

// Update Status Function
window.updateStatus = (id, newStatus) => {
    const confirmMsg = newStatus === 'approved' ? "Approve this item for public view?" : "Are you sure you want to deny/delete this item?";
    
    if(confirm(confirmMsg)) {
        db.collection('items').doc(id).update({
            status: newStatus
        }).catch(err => alert("Error: " + err.message));
    }
};
