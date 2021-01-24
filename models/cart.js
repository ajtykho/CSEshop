const fs = require("fs");
const path = require("path");

const p =  path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    //fetch the previous cart
    console.log("please work:", p);
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      //Analyze the cart => Find existing product
      const existingproductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingproduct = cart.products[existingproductIndex];
      let updatedProduct;
      //add new product/increase quantity
      if (existingproduct) {
        updatedProduct = { ...existingproduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingproductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), err => {
          console.log(err);
      })
    });
  }
};
