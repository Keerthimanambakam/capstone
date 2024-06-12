const Product = require('../model/Product');
const User = require('../model/User');
const Cart = require('../model/Cart');

const showAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        console.log('Products retrieved:', products);
        res.json(products);
    } catch (error) {
        console.log('Fetch error:', error);
        res.status(500).json({ message: 'Error retrieving products' });
    }
};

const login = async (req, res) => {
    console.log(req.body);
    let { u_name, u_pwd } = req.body;

    const user = await User.findOne({ u_name, u_pwd });
    console.log(user);
    if (user) {
        console.log(user);
        res.send("login success" + user);
    } else {
        console.log("error");
        res.send("login unsuccessful");
    }
};

const addToCart = async (req, res) => {
    const { u_serid, p_id } = req.body;
    try {
        let cart = await Cart.findOne({ u_serid });
        if (!cart) {
            cart = new Cart({ u_serid, products: [] });
        }

        const productIndex = cart.products.findIndex(
            (product) => product.product_id === p_id
        );

        if (productIndex !== -1) {
            console.log("count increased");
            cart.products[productIndex].count += 1;
        } else {
            cart.products.push({ product_id: p_id, count: 1 });
        }
        await cart.save();
        res.send("Product added to cart successfully");
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: "Error adding to cart" });
    }
};


const reduceFromCart = async (req, res) => {
    const { u_serid, p_id } = req.body;
    try {
        let cart = await Cart.findOne({ u_serid });
        if (!cart) {
            res.send("no products in cart");
            return;
        }

        const productIndex = cart.products.findIndex(
            (product) => product.product_id === p_id
        );

        if (productIndex !== -1) {
            console.log("count decreased");
            cart.products[productIndex].count -= 1;
            if (cart.products[productIndex].count === 0) {
                cart.products.splice(productIndex, 1);
            }
            await cart.save();
            res.send("Product removed from cart successfully");
        } else {
            res.send("product not found");
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: "Error reducing from cart" });
    }
};

const showAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        console.log('Users retrieved:', users);
        res.json(users);
    } catch (error) {
        console.log('Fetch error:', error);
        res.status(500).json({ message: 'Error retrieving users' });
    }
};

const showcart = async (req, res) => {
    try {
        const prouser = await Cart.find();
        console.log('Products retrieved:', prouser);
        res.json(prouser);
    } catch (error) {
        console.log('Fetch error:', error);
        res.status(500).json({ message: 'Error retrieving products' });
    }
};
const createUser = async (req, res) => {
    const user = new User({
        u_serid: req.body.u_serid,
        u_name: req.body.u_name,
        u_pwd: req.body.u_pwd,
        u_u_email: req.body.u_u_email,
        u_addr: req.body.u_addr,
        u_contact: req.body.u_contact,
    });
    try {
        const savedUser = await user.save();
        console.log('User inserted:', savedUser);
        res.status(201).send(savedUser);
    } catch (error) {
        console.error('Insert error:', error);
        res.status(400).send({ message: 'Error inserting user' });
    }
};
/*
const buyNow = async (req,res) => {
    const { u_serid } = req.body;
    try{
        const cart = await Cart.findOne({ u_serid }).populate("products.product_id");
        if(!cart || cart.products.length === 0){
            return res.send("cart is empty");
        }
        const total_cost = cart.products.reduce((total, product) => {
            return total+product.product_id.p_cost * product.count;

        },0);

        cart.products = [];
        await cart.save();
        console.log("Order placed successfully");
        res.send("Order placed successfully.Total cost is "+ total_cost);
    }catch(err) {
        res.status(500).json({message: "error"});
    }
};*/
const buyNow = async (req, res) => {
    const { u_serid } = req.body;
    try {
        const cart = await Cart.findOne({ u_serid });
        if (!cart || cart.products.length === 0) {
            return res.send("Cart is empty");
        }

        // Retrieve the product details from the Product collection
        const productIds = cart.products.map(p => p.product_id);
        const products = await Product.find({ p_id: { $in: productIds } });

        // Create a map to easily get the product cost by product_id
        const productCostMap = {};
        products.forEach(product => {
            productCostMap[product.p_id] = product.p_cost;
        });

        // Calculate the total cost
        const total_cost = cart.products.reduce((total, product) => {
            return total + (productCostMap[product.product_id] * product.count);
        }, 0);

        // Clear the cart
        cart.products = [];
        await cart.save();

        console.log("Order placed successfully");
        res.send("Order placed successfully. Total cost is " + total_cost);
    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).json({ message: "Error" });
    }
};

module.exports = {
    buyNow,
};


module.exports = {
    showAllProducts,
    addToCart,
    showAllUsers,
    createUser,
    login,
    reduceFromCart,
    buyNow,
    showcart
};
