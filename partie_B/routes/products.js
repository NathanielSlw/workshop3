module.exports = (app, products) => {
    // GET /products
    app.get('/products', (req, res) => {
        const { category, inStock } = req.query;
        let filteredProducts = products;
        
        if (category) {
            filteredProducts = filteredProducts.filter(p => p.category === category);
        }
        if (inStock) {
            filteredProducts = filteredProducts.filter(p => p.stockStatus === (inStock === 'true'));
        }
        
        res.json(filteredProducts);
    });

    // GET /products/:id
    app.get('/products/:id', (req, res) => {
        const product = products.find(p => p.id === req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    });

    // POST /products
    app.post('/products', (req, res) => {
        const newProduct = { id: `${Date.now()}`, ...req.body };
        products.push(newProduct);
        res.status(201).json(newProduct);
    });

    // PUT /products/:id
    app.put('/products/:id', (req, res) => {
        const productIndex = products.findIndex(p => p.id === req.params.id);
        if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });
        
        products[productIndex] = { ...products[productIndex], ...req.body };
        res.json(products[productIndex]);
    });

    // DELETE /products/:id
    app.delete('/products/:id', (req, res) => {
        products = products.filter(p => p.id !== req.params.id);
        res.json({ message: 'Product deleted successfully' });
    });
};
