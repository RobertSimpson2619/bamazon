var inquirer = require("inquirer");
var mysql = require("mysql");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "$$Rdbr2619",
  database: "bamazon"
});


var someArray = [];

selectAllCrud();

function newPrompt(){

	inquirer
	  .prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "input",
	      message: "What is the ID of the item you would like to purchase?",
	      name: "itemPurchased"
	    },
	    {
	      type: "input",
	      message: "How many would you like to purchase?",
	      name: "numberPurchased",
	    }
	]).then(function(newResponse){

		updateCrud(newResponse.itemPurchased,newResponse.numberPurchased);

		}) 
}



 
function updateCrud(item, numberPurchased) {
	console.log("Placing Order...\n");
	


	connection.query("SELECT * from inventory where item_id = '" + item + "'", function(err,res){
		if(err) throw err;

			var orderTotal = res[0].price * numberPurchased;

			

			if(res[0].stock_quantity - numberPurchased > 0){

				connection.query("UPDATE inventory SET ? WHERE ?",
			[
				{
					stock_quantity: (res[0].stock_quantity - numberPurchased)
				},
				{
					item_id: item
				}
			],
			function(err,newRes) {
				console.log("Your order has been placed.");
				console.log(orderTotal + " has been charged to your card on file.")

			})
			}else{

				console.log("Insufficent Quantity");

			}


	})
	
} 



function selectAllCrud(){
	console.log("selecting all items... \n");

	connection.query("SELECT * from inventory", function (err,res){
		if(err) throw err;

		

		for(var i=0;i<res.length;i++){
			

			
			console.log("ID: " + res[i].item_id + "| |" + " Product Name: " + res[i].product_name +  "| |" + " Price: " + res[i].price);
			

		}
		newPrompt()
	})
}