module.exports = (app, products, orders) => {
    // POST /orders
    app.post('/orders', (req, res) => {
        const { products: orderedProducts, userId } = req.body;
        if (!orderedProducts || orderedProducts.length === 0) {
            return res.status(400).json({ message: 'At least one product must be included in the order' });
        }

        // Calculer le prix total
        let totalPrice = 0;
        const productsInOrder = [];

        orderedProducts.forEach(product => {
            const existingProduct = products.find(p => p.id === product.productId);
            if (!existingProduct) {
                return res.status(404).json({ message: `Product with ID ${product.productId} not found` });
            }
            const quantity = product.quantity || 1;
            totalPrice += existingProduct.price * quantity;
            productsInOrder.push({ product: existingProduct, quantity });
        });

        // Créer une commande
        const newOrder = {
            id: `${Date.now()}`,
            userId: userId || null,
            products: productsInOrder,
            totalPrice,
            status: 'pending', // Le statut initial est "pending"
            createdAt: new Date()
        };

        orders.push(newOrder);
        res.status(201).json(newOrder);
    });

    // GET /orders/:userId
    app.get('/orders/:userId', (req, res) => {
        const userOrders = orders.filter(order => order.userId === req.params.userId);

        if (userOrders.length === 0) {
            return res.status(404).json({ message: `No orders found for user with ID ${req.params.userId}` });
        }

        res.json(userOrders);
    });
};
