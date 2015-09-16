sap.ui.jsview("splitappdemo.Products", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf splitappdemo.Products
	*/ 
	getControllerName : function() {
		return "splitappdemo.Products";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf splitappdemo.Products
	*/ 
	createContent : function(oController) {
		var oMTable = new sap.m.Table({
			columns:[
			         new sap.m.Column({
			        	 width: "40%",
			        	 header:new sap.m.Label({text:"Product"})
			         }),
			         new sap.m.Column({
			        	 width: "25%",
			        	 header:new sap.m.Label({text:"Brand"})
			         }),
			        
			         new sap.m.Column({
			        	 header:new sap.m.Label({text:"Price"}),
			        	 
			         }),
			         new sap.m.Column({}),
			         ]
		});
		
		var oColTemplate =  new sap.m.ColumnListItem({
	        cells : [ 
					  new sap.ui.commons.TextArea({
						  value : "{productModel>product}",
						  width:"100%"	
					  }),
	                  new sap.ui.commons.TextField({
	                	  value : "{productModel>brand}",
	                	  width:"100%"	
	                  }), 
	                  
	                  new sap.ui.commons.TextField({
	                	  value : "{productModel>price}",
	                	  width:"100%"
	                  }),
	                  new sap.ui.commons.Button({
	                	        icon:"{productModel>icon}",
								press: function(event){
									if(event.getSource().getIcon() === "sap-icon://add"){
										var oApp = sap.ui.getCore().byId("appId");
										var oData = sap.ui.getCore().getModel("productModel").getProperty("/0");
										var oDeferred = $.Deferred();
										
										oApp.oDao.addNewProduct(oData,oDeferred);
										
										oDeferred.done(function(success){
											oData.icon = "sap-icon://delete";
											sap.ui.getCore().getModel("productModel").oData.splice(0,0,{product:"",brand:"",price:undefined, icon:"sap-icon://add"});
											sap.ui.getCore().getModel("productModel").refresh();
											alert(success);
										}).fail(function(error){
											alert(error);
										});
									}
								}
			          }),
	        		]
	    });
		
		oMTable.bindAggregation("items","productModel>/", oColTemplate);
		
 		return new sap.m.Page({
			title: "Products",
			showNavButton: "{device>/isPhone}",
			navButtonPress: function(){
				oController.navBack();
			},
			content: [
			      new sap.m.SearchField({
			    	  placeholder: "e.g., Aptamil 1",
			    	  search: function(){
			    		  var that = this;
			    		  var oData;		    		  
			    		  var oApp = sap.ui.getCore().byId("appId");
			    		  var dfd = $.Deferred();
			  			  oApp.oDao.selectAllProducts(dfd);
			  				
			  			  dfd.done(function(oProductData){
		  					if (that.getValue()!=""){
		  						oData = oProductData;
				    			  oData = oData.filter(function(data){
				    				  return (data.product.toLowerCase().indexOf(that.getValue().toLowerCase())!= -1); 
				    			  });	  
					    			  
     			    		  } else {
			  			          oData = oProductData;
					  			  oData.splice(0,0,{product:"",brand:"",price:undefined, icon:"sap-icon://add"});
					  		  }
			  				  sap.ui.getCore().getModel("productModel").setData(oData);
					    	  sap.ui.getCore().getModel("productModel").refresh();

			  					  
	
			  				});			
			    		  
			    		
			    	  }
			      }),
			      oMTable
			]
		});
	}

});