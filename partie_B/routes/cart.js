module.exports = (app, products, carts) => {
    // POST /cart/:userId
    app.post('/cart/:userId', (req, res) => {
        const { userId } = req.params;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        // Vérifier si le produit existe
        const product = products.find(p => p.id === productId);
        if (!product) {
            return res.status(404).json({ message: `Product with ID ${productId} not found` });
        }

        // Initialiser le panier si inexistant
        if (!carts[userId]) {
            carts[userId] = [];
        }

        // Vérifier si le produit est déjà dans le panier
        const existingProduct = carts[userId].find(item => item.product.id === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            carts[userId].push({ product, quantity });
        }

        // Calculer le prix total du panier
        const totalPrice = carts[userId].reduce((total, item) => total + item.product.price * item.quantity, 0);

        res.json({
            cart: carts[userId],
            totalPrice
        });
    });

    // GET /cart/:userId
    app.get('/cart/:userId', (req, res) => {
        const { userId } = req.params;

        if (!carts[userId] || carts[userId].length === 0) {
            return res.status(404).json({ message: `No items found in the cart for user with ID ${userId}` });
        }

        // Calculer le prix total du panier
        const totalPrice = carts[userId].reduce((total, item) => total + item.product.price * item.quantity, 0);

        res.json({
            cart: carts[userId],
            totalPrice
        });
    });

    // DELETE /cart/:userId/item/:productId
    app.delete('/cart/:userId/item/:productId', (req, res) => {
        const { userId, productId } = req.params;

        if (!carts[userId]) {
            return res.status(404).json({ message: `No cart found for user with ID ${userId}` });
        }

        const productIndex = carts[userId].findIndex(item => item.product.id === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: `Product with ID ${productId} not found in cart` });
        }

        // Supprimer le produit du panier
        carts[userId].splice(productIndex, 1);

        // Calculer le prix total du panier après suppression
        const totalPrice = carts[userId].reduce((total, item) => total + item.product.price * item.quantity, 0);

        res.json({
            cart: carts[userId],
            totalPrice
        });
    });
};
