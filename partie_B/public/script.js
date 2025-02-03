// URL de l'API
const apiUrl = 'http://localhost:3001';

// Charger la liste des produits
async function loadProducts() {
    try {
        const response = await fetch(`${apiUrl}/products`);
        const products = await response.json();

        const productList = document.getElementById('product-list');
        productList.innerHTML = '';  // Vider la liste actuelle

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button onclick="addToCart('${product._id}', 1)">Add to Cart</button>
            `;
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Ajouter un produit au panier
async function addToCart(productId, quantity) {
    try {
        const response = await fetch(`${apiUrl}/cart/1`, { // Simule userId=1
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });
        const cart = await response.json();
        displayCart(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// Charger et afficher le contenu du panier
async function loadCart() {
    try {
        const response = await fetch(`${apiUrl}/cart/1`); // Simule userId=1
        const cart = await response.json();
        displayCart(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

// Afficher les informations du panier
function displayCart(cart) {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';

    if (cart && cart.items && cart.items.length > 0) {
        cart.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <h3>Product ID: ${item.productId}</h3>
                <p>Quantity: ${item.quantity}</p>
                <button onclick="removeFromCart('${item.productId}')">Remove</button>
            `;
            cartList.appendChild(cartItem);
        });
    } else {
        cartList.innerHTML = '<p>Your cart is empty.</p>';
    }
}

// Supprimer un produit du panier
async function removeFromCart(productId) {
    try {
        const response = await fetch(`${apiUrl}/cart/1/item/${productId}`, { // Simule userId=1
            method: 'DELETE',
        });
        const cart = await response.json();
        displayCart(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
}

// Initialiser l'application
loadProducts();
loadCart();
