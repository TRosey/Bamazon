var mysql = require('mysql');
var inquirer = require('inquirer')


var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'bamazon'


});

connection.connect(function (err){
	if (err) {
		throw err;
	}
	begin();
});


function begin() {
	inquirer.prompt(
        {
            name: "name",
            type: "input",
            message: "Enter Username"
        }
    ).then(function(res) {
        console.log('Welcome '+res.name);
        list();
    })
}

function list() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log("#"+results[i].id + "\nProduct: " + results[i].product_name  + "\nDepartment: " + results[i].department_name+ "\nPrice: $" + results[i].price + "\nQuantity in stock: "+ results[i].stock_quantity);
            console.log("|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|");
        }
        purchase();
    })
}
function purchase() {
    inquirer.prompt([
        {
            type: "input",
            name: "item",
            message: "Please enter the ID of the product you wish to purchase",
        },
        {
            type: "input",
            name: "amount",
            message: "Enter amount",
        }
    ]).then(function(res) {
        connection.query("SELECT * FROM products WHERE id = ?", [res.item], function(err, result) {
            total = (result[0].price * res.amount).toFixed();
            if (res.amount > result[0].stock_quantity) {
                console.log("Insufficient quantity");
                discon();
            } else {
                connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", [res.amount, res.item], function(err, result) {

                        console.log("Total cost: $" + total);
                        discon();
                    });
            }
        })
    })
}

function discon() {
    connection.end(function(err) {
        if (err) throw err;
    })
}