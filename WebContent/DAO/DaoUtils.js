jQuery.sap.declare("DAO.DaoUtils");

DAO.DaoUtils={
		db: undefined,
		initDB: function(){
			this.db = window.openDatabase("Database", "1.0", "Order_Management_DB", 200000);
			console.log(this.db);
			this._initTables();
			/*this.deleteAllOrders();
			this.deleteAllCustomers();
			this.deleteAllProducts();
			this._prePopulate();*/
		},
		
		_initTables: function(){
			this.db.transaction(function(tx){
				tx.executeSql('CREATE TABLE IF NOT EXISTS products(prod_name TEXT NOT NULL UNIQUE, prod_brand TEXT, prod_purchase_price FLOAT, prod_sell_price FLOAT NOT NULL);',[]);
				tx.executeSql('CREATE TABLE IF NOT EXISTS orders(order_id TEXT NOT NULL UNIQUE, customer_id TEXT NOT NULL, order_shippment TEXT, order_status TEXT NOT NULL, order_data TEXT NOT NULL, order_sum FLOAT, order_note TEXT);',[]);
				tx.executeSql('CREATE TABLE IF NOT EXISTS items(order_id TEXT NOT NULL, prod_name TEXT NOT NULL, quantity INTEGER NOT NULL, checked INTEGER);',[]);
				tx.executeSql('CREATE TABLE IF NOT EXISTS customers(cust_id TEXT NOT NULL UNIQUE, cust_add CHAR(50) NOT NULL, cust_contact TEXT NOT NULL);',[]);
			}, function(err){
				console.log(err.message);
			});
			
					
		},
		
		_prePopulate: function(){
			this.db.transaction(function(tx){
				var aProduct = [{product:"Aptamil 1", brand: "Aptamil",pPrice: 14.95, sPrice: 215.00},
				                {product:"Aptamil pre", brand: "Aptamil",pPrice: 14.95, sPrice: 215.00},
				                {product:"Aptamil 2",  brand: "Aptamil",pPrice: 14.95, sPrice: 215.00},
				                {product:"Aptamil Premium pre", brand: "Aptamil", pPrice:18.95, sPrice: 278.00},
				                {product:"Aptamil Premium 1", brand: "Aptamil", pPrice:18.95, sPrice: 278},
				                {product:"Aptamil Premium 2", brand: "Aptamil", pPrice:18.95, sPrice: 278},
				                {product:"Aptamil 1 plus", brand: "Aptamil", pPrice: 9.45, sPrice: 175},
				                {product:"Aptamil 2 plus", brand: "Aptamil", pPrice: 9.45, sPrice: 175},
				                {product:"Aptamil HA pre", brand: "Aptamil", pPrice: 13.35, sPrice: 200},
				                {product:"Aptamil HA 1", brand: "Aptamil", pPrice: 13.35, sPrice: 200},
				                {product:"Aptamil HA 2", brand: "Aptamil", pPrice: 13.35, sPrice: 200},
				                {product:"Hipp 7 Korn", brand: "Hipp", pPrice: 1.95, sPrice: 45},
				                {product:"Hipp Kindergriss", brand: "Hipp", pPrice: 3.25, sPrice: 78},
				                {product:"Hipp Feine Hirse", brand: "Hipp", pPrice: 1.95, sPrice: 45},
				                {product:"Hipp Keks", brand: "Hipp", pPrice: 3.25, sPrice: 78},
				                {product:"Hipp Banana", brand: "Hipp", pPrice: 3.25, sPrice: 78},
				                {product:"Hipp Apfel", brand: "Hipp", pPrice: 3.25, sPrice: 78},
				                {product:"Hipp Milch Getreide", brand: "Hipp", pPrice: 5.45, sPrice: 116},
				                {product:"Hipp Musli", brand: "Hipp", pPrice: 1.95, sPrice: 45},
				                {product:"Hipp Combiotik", brand: "Hipp", pPrice: 9.45, sPrice: 175},
				                {product:"Hipp Combiotik 1 plus", brand: "Hipp", pPrice: 9.45, sPrice: 175},
				                {product:"Hipp Bio pre", brand: "Hipp", pPrice: 8.45, sPrice: 165},
				                {product:"Hipp Bio 1", brand: "Hipp", pPrice: 8.45, sPrice: 165},
				                {product:"Hipp Bio 2", brand: "Hipp", pPrice: 8.45, sPrice: 165},
				                {product:"Hipp Bio 1 plus", brand: "Hipp", pPrice: 8.45, sPrice: 165},
				                {product:"Bosch Tassimo", brand: "Bosch", pPrice: 39.99, sPrice: 680},
				                ];
				for (var i in aProduct){
					tx.executeSql("INSERT INTO products(prod_name, prod_brand, prod_purchase_price, prod_sell_price) VALUES (?,?,?,?)",[aProduct[i].product, aProduct[i].brand, aProduct[i].pPrice, aProduct[i].sPrice]);
				}
				
				tx.executeSql("INSERT INTO orders(order_id, customer_id, order_status, order_data, order_sum, order_note) VALUES (?,?,?,?,?,?)",["8888888", "Federer", "open", "Sep 12 2015", 1000, "Nothing Special"]);
				tx.executeSql("INSERT INTO customers(cust_id, cust_add, cust_contact) VALUES (?,?,?)",["Federer", "Rd.Musterroad 100, app 124, 68199, MusterStadt", "+491908138103"]);
				tx.executeSql('INSERT INTO items(order_id, prod_name, quantity, checked) VALUES(?,?,?,?);',["8888888","Aptamil 1",3,0]);
				tx.executeSql('INSERT INTO items(order_id, prod_name, quantity, checked) VALUES(?,?,?,?);',["8888888","Aptamil 2",3,0]);
				tx.executeSql('INSERT INTO items(order_id, prod_name, quantity, checked) VALUES(?,?,?,?);',["8888888","Aptamil 3",3,0]);
				
				
				tx.executeSql("INSERT INTO orders(order_id, customer_id, order_status, order_data, order_sum, order_note) VALUES (?,?,?,?,?,?)",["11111", "mustermann", "open", "Sep 12 2015", 1000, "Nothing Special"]);
				tx.executeSql("INSERT INTO customers(cust_id, cust_add, cust_contact) VALUES (?,?,?)",["mustermann", "Rd.Musterroad 100, app 124, 68199, MusterStadt", "+491908138103"]);
				tx.executeSql('INSERT INTO items(order_id, prod_name, quantity, checked) VALUES(?,?,?,?);',["11111","Aptamil 1",3,0]);

			}, function(err){
				console.log(err.message);
			}, function(){
				console.log("success");
			} );
		},
		
		deleteOrder: function(defer,orderId){
			this.db.transaction(function(tx){
				tx.executeSql("DELETE FROM orders WHERE order_id='"+orderId+"';");
				tx.executeSql("DELETE FROM items WHERE order_id='"+orderId+"';");
			}, function(err){
				defer.reject(err.message);
				return defer.promise();
			}, function(){
				defer.resolve();
				return defer.promise();
			});
		},
		
		createNewOrder: function(defer, orderData, custData, items){
			
			this.db.transaction(function(tx){
		    	tx.executeSql("INSERT INTO orders(order_id, customer_id, order_status, order_data) VALUES (?,?,?,?)",[orderData.order_id, orderData.customer_id, orderData.order_status, orderData.order_data]);
		    	for (var i=0; i<items.length; i++){
					tx.executeSql('INSERT INTO items(order_id, prod_name, quantity, checked) VALUES(?,?,?,?);',[orderData.order_id,items[i].prod_name,items[i].quantity,0]);
				}
		    	tx.executeSql("SELECT * FROM customers WHERE cust_id='"+custData.cust_id+"';",[],function(tx,rs){
		    		if (rs.rows.length === 0){
		    			tx.executeSql("INSERT INTO customers(cust_id, cust_add, cust_contact) VALUES(?,?,?)",[custData.cust_id, custData.cust_add, custData.cust_contact]);
		    		} else {
		    			tx.executeSql("UPDATE customers SET cust_add='"+custData.cust_add+"', cust_contact='"+custData.cust_contact+"' WHERE cust_id='"+custData.cust_id+"';");
		    		}
		    	});
		    	
			}, function(err){
		    	console.log(err.message);
		    	defer.reject(err.message);
		    	return defer.promise();
		    }, function(){
		    	defer.resolve();
				return defer.promise();
		    });
		},
		
		editOrder: function(defer,data){
			var orderId = data.orderId,
				aOrders = data.orders,
				note = data.note,
				status = data.status,
			    shippment = data.shippment;
			this.db.transaction(function(tx){
			    tx.executeSql("DELETE FROM items WHERE order_id='"+orderId+"';");
			    tx.executeSql("UPDATE orders SET order_note='"+note+"' WHERE order_id='"+orderId+"';");
			    tx.executeSql("UPDATE orders SET order_status='"+status+"' WHERE order_id='"+orderId+"';");
			    tx.executeSql("UPDATE orders SET order_shippment='"+shippment+"' WHERE order_id='"+orderId+"';");
			},
		    function(err){
		    	console.log(err.message);
		    	defer.reject();
		    	return defer.promise();
		    });
			
			this.db.transaction(function(tx){
				for (var i=0; i<aOrders.length; i++){
					var isPurchased = aOrders[i].isPurchased === false? 0:1;
					tx.executeSql('INSERT INTO items(order_id, prod_name, quantity, checked) VALUES(?,?,?,?);',[orderId, aOrders[i].product, aOrders[i].quantity,isPurchased]);	
				}
				
			},
		    function(err){
		    	console.log(err.message);
		    	defer.reject();
		    	return defer.promise();
		    });
			
			defer.resolve();
			return defer.promise();
		},
		
		selectOrders: function(defer, status){
			var oData = [];
			this.db.transaction(function(tx){
				var cmmd = "SELECT * FROM orders INNER JOIN customers on orders.customer_id = customers.cust_id WHERE orders.order_status = '"+status+"';";
				
				
				tx.executeSql(cmmd, [], function(tx,rs){
					for (var i =0; i<rs.rows.length; i++){
						var obj = {};
						obj.orderId = rs.rows.item(i)["order_id"];
						obj.custName = rs.rows.item(i)["cust_id"];
						obj.add = rs.rows.item(i)["cust_add"];
						obj.contact = rs.rows.item(i)["cust_contact"];
						obj.status = rs.rows.item(i)["order_status"];
						obj.sum = rs.rows.item(i)["order_sum"];
						obj.date = rs.rows.item(i)["order_data"];
						obj.note = rs.rows.item(i)["order_note"];
						obj.shippment = rs.rows.item(i)["order_shippment"];
						oData.push(obj);
					}					
				});
				
				
				
				tx.executeSql("SELECT orders.order_id, items.prod_name, items.quantity, items.checked FROM items INNER JOIN orders on orders.order_id = items.order_id;", [], function(tx,rs){
					for (var i =0; i<rs.rows.length; i++){
						var obj = oData.filter(function(obj){
							return obj.orderId == rs.rows.item(i)["order_id"];
						})[0];
						
						if (obj){
							if (obj.orders === undefined){
								obj.orders = [];
							}
						} else {
							continue;
						}

						
						var item = {};
						item.product = rs.rows.item(i)["prod_name"];
						item.quantity = rs.rows.item(i)["quantity"];
						item.isPurchased = rs.rows.item(i)["checked"] === 0 ? false:true;						
						obj.orders.push(item);
					}					
				});
								
			}, function(err){
				console.log(err.message);
				defer.reject();
				return defer.promise();
			}, function(){
				defer.resolve(oData);
				return defer.promise();
			});
		},
		
		selectAllProducts : function(deferredObj){
			
			this.db.transaction(function(tx){				
				tx.executeSql("SELECT * FROM products;",[], function(tx,rs){
					var oData=[];
					for (var i= 0 ; i<rs.rows.length; i++){
						console.log("data rows: "+ rs.rows);
						var obj = {};
						obj.product = rs.rows.item(i)["prod_name"];
						obj.brand = rs.rows.item(i)["prod_brand"];
						obj.cost = rs.rows.item(i)["prod_purchase_price"];
						obj.price = rs.rows.item(i)["prod_sell_price"];
						obj.icon = "sap-icon://delete";
						oData.push(obj);
					}
					deferredObj.resolve(oData);
					return deferredObj.promise();
				});
			}, function(err){
				console.log("select error"+ err.message);
			})
		},
		
		deleteAllProducts: function(){
			this.db.transaction(function(tx){
				tx.executeSql("DELETE FROM products;");
			});
		},
		deleteAllProducts: function(){
			this.db.transaction(function(tx){
				tx.executeSql("DELETE FROM products;");
			});
		},
		deleteAllCustomers: function(){
			this.db.transaction(function(tx){
				tx.executeSql("DELETE FROM customers;");
			});
		},
		
		deleteAllOrders: function(){
			this.db.transaction(function(tx){
				tx.executeSql("DELETE FROM orders;");
			});
			this.db.transaction(function(tx){
				tx.executeSql("DELETE FROM items;");
			});
		},
		
		addNewProduct: function(aProduct, deferredObj){
			this.db.transaction(function(tx){
				tx.executeSql("INSERT INTO products(prod_name, prod_brand, prod_purchase_price, prod_sell_price) VALUES (?,?,?,?)",[aProduct.product, aProduct.brand,undefined, aProduct.price]);
			}, function(err){
				deferredObj.reject(err);
				return deferredObj.promise();
			}, function(){
				deferredObj.resolve("Product Added!");
				return deferredObj.promise();
			});
		}
		
		
}

