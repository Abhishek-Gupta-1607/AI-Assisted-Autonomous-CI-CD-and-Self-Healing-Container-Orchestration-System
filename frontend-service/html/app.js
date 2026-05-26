const API_URL = '/api';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    fetchProducts();
    fetchOrders();
});

// --- AI Monitor ---
async function simulateAI(type) {
    const resultsDiv = document.getElementById('ai-results');
    const badge = document.getElementById('ai-status-badge');
    const riskScoreEl = document.getElementById('ai-risk-score');
    const confScoreEl = document.getElementById('ai-confidence-score');
    const actionEl = document.getElementById('ai-action');

    resultsDiv.classList.remove('hidden');
    badge.textContent = "Analyzing...";
    badge.className = "badge";

    let payload;
    if (type === 'healthy') {
        payload = { cpu_usage: 45, memory_usage: 50, restart_count: 0, response_time_ms: 120, failed_requests: 0 };
    } else {
        payload = { cpu_usage: 95, memory_usage: 90, restart_count: 5, response_time_ms: 1500, failed_requests: 15 };
    }

    try {
        const res = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        // Animate numbers
        animateValue(riskScoreEl, 0, data.risk_score, 1000, '%');
        animateValue(confScoreEl, 0, data.confidence_score, 1000, '%');
        
        setTimeout(() => {
            actionEl.textContent = data.recommended_action;
            badge.textContent = data.deployment_status;
            badge.className = `badge ${data.deployment_status.toLowerCase()}`;
            
            if (data.recommended_action.includes("Rollback")) {
                actionEl.style.color = "var(--danger-color)";
            } else {
                actionEl.style.color = "var(--success-color)";
            }
        }, 1000);

    } catch (err) {
        console.error("AI Error:", err);
        badge.textContent = "Error connecting to AI";
        badge.className = "badge unhealthy";
    }
}

// --- Users ---
async function fetchUsers() {
    try {
        const res = await fetch(`${API_URL}/users`);
        const users = await res.json();
        const list = document.getElementById('user-list');
        list.innerHTML = users.map(u => `<li><span>${u.name}</span> <span style="color:var(--text-secondary)">${u.email}</span></li>`).join('');
    } catch (err) {
        console.error(err);
    }
}

async function createUser(e) {
    e.preventDefault();
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    
    await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
    });
    
    e.target.reset();
    fetchUsers();
}

// --- Products ---
async function fetchProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
        const products = await res.json();
        const list = document.getElementById('product-list');
        list.innerHTML = products.map(p => `<li><span>${p.name}</span> <span>$${p.price.toFixed(2)}</span></li>`).join('');
    } catch (err) {
        console.error(err);
    }
}

async function createProduct(e) {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    
    await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price })
    });
    
    e.target.reset();
    fetchProducts();
}

// --- Orders ---
async function fetchOrders() {
    try {
        const res = await fetch(`${API_URL}/orders`);
        const orders = await res.json();
        const list = document.getElementById('order-list');
        list.innerHTML = orders.map(o => `<li><span>User ${o.userId} ordered Prod ${o.productId}</span> <span>Qty: ${o.quantity}</span></li>`).join('');
    } catch (err) {
        console.error(err);
    }
}

async function createOrder(e) {
    e.preventDefault();
    const userId = parseInt(document.getElementById('order-user-id').value);
    const productId = parseInt(document.getElementById('order-product-id').value);
    const quantity = parseInt(document.getElementById('order-quantity').value);
    
    await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity })
    });
    
    e.target.reset();
    fetchOrders();
}

// --- Helpers ---
function animateValue(obj, start, end, duration, suffix = "") {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
