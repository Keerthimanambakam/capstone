const Product = require('../model/Product');
const User = require('../model/User');
const Cart = require('../model/Cart');
const fs = require('fs');

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
/*
// Function to insert products from JSON file
const insertProductsFromJSON = async (filePath) => {
    try {
        const rawData = fs.readFileSync(filePath);
        const productsData = JSON.parse(rawData);

        for (const productData of productsData) {
            const product = new Product({
                p_id: productData.p_id,
                p_name: productData.p_name,
                p_cost: productData.p_cost,
                p_cat: productData.p_cat,
                p_desc: productData.p_desc,
                p_img: productData.p_img
            });

            await product.save();
            console.log('Product inserted:', product.p_name);
        }

        console.log('All products inserted successfully!');
    } catch (error) {
        console.error('Error inserting products:', error);
    }
};

// Function to insert users from JSON file
const insertUsersFromJSON = async (filePath) => {
    try {
        const rawData = fs.readFileSync(filePath);
        const usersData = JSON.parse(rawData);

        for (const userData of usersData) {
            const user = new User({
                u_serid: userData.u_serid,
                u_name: userData.u_name,
                u_pwd: userData.u_pwd,
                u_u_email: userData.u_u_email,
                u_addr: userData.u_addr,
                u_contact: userData.u_contact
            });

            await user.save();
            console.log('User inserted:', user.u_name);
        }

        console.log('All users inserted successfully!');
    } catch (error) {
        console.error('Error inserting users:', error);
    }
};

const productJsonFilePath = 'D:/capstone/code/products.json';
const userJsonFilePath = 'D:/capstone/code/users.json';
insertProductsFromJSON(productJsonFilePath);
insertUsersFromJSON(userJsonFilePath)
'''*/

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
