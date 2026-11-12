// ========== PRODUCTS.JS (Product Data Array + Rendering + Filter/Sort) ==========
const productsData = [
    { id: 'p1', name: 'Wireless Headphones', price: 99.99, category: 'electronics', image: 'https://picsum.photos/id/1/300/300', description: 'High-quality noise cancelling headphones.' },
    { id: 'p2', name: 'Smart Watch', price: 199.99, category: 'wearables', image: 'https://picsum.photos/id/20/300/300', description: 'Track fitness & calls.' },
    { id: 'p3', name: 'Premium Backpack', price: 59.99, category: 'accessories', image: 'https://picsum.photos/id/133/300/300', description: 'Durable water resistant.' },
    { id: 'p4', name: 'Mechanical Keyboard', price: 129.99, category: 'electronics', image: 'https://picsum.photos/id/0/300/300', description: 'RGB backlit mechanical switches.' },
    { id: 'p5', name: 'Running Shoes', price: 84.99, category: 'footwear', image: 'https://picsum.photos/id/288/300/300', description: 'Lightweight & comfortable.' },
    { id: 'p6', name: 'Smartphone Stand', price: 24.99, category: 'accessories', image: 'https://picsum.photos/id/26/300/300', description: 'Adjustable aluminum stand.' }
];

let currentFilter = 'all';
let currentSort = 'default';

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    let filtered = [...productsData];
    if (currentFilter !== 'all') filtered = filtered.filter(p => p.category === currentFilter);
    if (currentSort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
    if (currentSort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
    
    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-price">$${p.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart('${p.id}', '${p.name}', ${p.price}, '${p.image}')">Add to Cart</button>
                <a href="product-detail.html?id=${p.id}" style="display:block; margin-top:0.5rem; font-size:0.8rem; text-align:center;">View Details</a>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    currentFilter = category;
    renderProducts();
}

function sortProducts(criteria) {
    currentSort = criteria;
    renderProducts();
}

// featured products on homepage
function renderFeatured() {
    const featuredGrid = document.getElementById('featured-products');
    if (featuredGrid) {
        const featured = productsData.slice(0, 3);
        featuredGrid.innerHTML = featured.map(p => `
            <div class="product-card">
                <img src="${p.image}" class="product-img">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>$${p.price}</p>
                    <button class="add-to-cart" onclick="addToCart('${p.id}','${p.name}',${p.price},'${p.image}')">Shop Now</button>
                </div>
            </div>
        `).join('');
    }
}

// Product detail page logic
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) return;
    const product = productsData.find(p => p.id === productId);
    if (product && document.getElementById('detail-container')) {
        document.getElementById('detail-container').innerHTML = `
            <div style="display:flex; flex-wrap:wrap; gap:2rem;">
                <img src="${product.image}" style="flex:1; max-width:400px; border-radius:20px;">
                <div style="flex:2">
                    <h1>${product.name}</h1>
                    <p>${product.description}</p>
                    <h2>$${product.price.toFixed(2)}</h2>
                    <button class="add-to-cart" id="detail-add-btn" style="width:auto; padding: 0.8rem 2rem;">Add to Cart</button>
                </div>
            </div>
        `;
        const btn = document.getElementById('detail-add-btn');
        if (btn) {
            btn.onclick = () => {
                addToCart(product.id, product.name, product.price, product.image);
            };
        }
    }
}
function updateDetailCartStatus() { if(window.location.pathname.includes('product-detail.html')) loadProductDetail(); }

if (window.location.pathname.includes('products.html')) {
    document.addEventListener('DOMContentLoaded', () => { renderProducts(); });
}
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
    document.addEventListener('DOMContentLoaded', renderFeatured);
}
if (window.location.pathname.includes('product-detail.html')) {
    document.addEventListener('DOMContentLoaded', loadProductDetail);
}

window.filterProducts = filterProducts;
window.sortProducts = sortProducts;