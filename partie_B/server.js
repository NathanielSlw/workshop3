const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Order = require('./models/order');
const Cart = require('./models/cart'); // Si on gère aussi les paniers dans une collection distincte
const path = require('path'); // Importer 'path' pour servir le fichier HTML

const app = express();
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// Servir les fichiers statiques du dossier 'public'
app.use(express.static('public'));

// Route pour afficher la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route GET /products
app.get('/products', async (req, res) => {
  try {
    const { category, inStock } = req.query;
    let query = {};
    if (category) query.category = category;
    if (inStock !== undefined) query.stockStatus = inStock === 'true';
    
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route GET /products/:id
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route POST /products
app.post('/products', async (req, res) => {
  try {
    const { name, price, category, stockStatus } = req.body;

    if (!name || !price || !category || stockStatus === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newProduct = new Product({ name, price, category, stockStatus });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
});

// Route PUT /products/:id
app.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route DELETE /products/:id
app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route POST /orders
app.post('/orders', async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (!userId || !products || !Array.isArray(products)) {
      return res.status(400).json({ message: 'User ID and products array are required' });
    }

    const productDetails = [];
    let totalPrice = 0;
    
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product with ID ${item.productId} not found` });

      totalPrice += product.price * item.quantity;
      productDetails.push({
        productId: product._id,
        quantity: item.quantity,
      });
    }

    const newOrder = new Order({
      userId,
      products: productDetails,
      totalPrice,
      status: 'Pending',
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

// Route GET /orders/:userId
app.get('/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    if (!orders.length) return res.status(404).json({ message: 'No orders found for this user' });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

// Route POST /cart/:userId
app.post('/cart/:userId', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Logique pour ajouter l'élément au panier (on utilise ici une collection de panier par utilisateur)
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      const newCart = new Cart({
        userId: req.params.userId,
        items: [{ productId, quantity }],
      });
      await newCart.save();
      return res.status(201).json(newCart);
    }

    // Si le panier existe, on ajoute le produit
    cart.items.push({ productId, quantity });
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
});

// Route GET /cart/:userId
app.get('/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found for this user' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
});

// Route DELETE /cart/:userId/item/:productId
app.delete('/cart/:userId/item/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Supprimer l'élément du panier
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error removing item from cart', error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
