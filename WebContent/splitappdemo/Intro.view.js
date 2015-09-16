sap.ui.jsview("splitappdemo.Intro", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf splitappdemo.Intro
	*/ 
	getControllerName : function() {
		return "splitappdemo.Intro";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf splitappdemo.Intro
	*/ 
	
	
	createContent : function(oController) {
		
		
		
		var aCustData = [{name: "Andy", add:"musterstrasse 76, 11219, Mannheim, Germany",contact:"017691839889"},
		                 {name: "Roger", add:"musterstrasse 12, 123, Basel, Schweiz",contact:"09131441341"},
		                 {name: "Rafael", add:"musterstrasse 2, 222, Maroca, Spain",contact:"037699983913"}];
		this.oCustName = new sap.ui.commons.AutoComplete({
		  value: "{customer>/custName/text}",
		  valueState:"{customer>/custName/state}",
      	  maxPopupItems: 5,
      	  tooltip: "enter a name",
      	  displaySecondaryvalues: false,
      	  items:{
      		  path:"custModel>/",
      		  template: new sap.ui.core.ListItem({text:"{custModel>name}",additionalText: "{custModel>add}"} )
      	  },
      	  change: function(evt){
      		if(evt.getParameters().selectedItem!=null){
	      		var sPath = evt.getParameters().selectedItem.oBindingContexts.custModel.sPath;
	      		var oData = this.getModel("custModel").getProperty(sPath);
	      		sap.ui.getCore().byId("shippingAddId").setValue(oData.add);
	      		sap.ui.getCore().byId("contactId").setValue(oData.contact);
	      	}else{
	      		oForm.addContent(new sap.m.Label({visible:false}));
	      		oForm.addContent(new sap.m.Button("saveCustBtnId",
	      				{	text:"Add New Customer",
		      				press:function(){
		      					this.destroy();
		      				}
	      				}
	      			)
	      		);
	      	}
      	  }
      	  
        });
		
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(aCustData);
		this.oCustName.setModel(oModel,"custModel");
				
		var aProduct = [{product:"Aptamil 1", price:"14.99"},{product:"Aptamil 2", price:"14.99"}, {product:"Aptamil Premium 1", price:"18.99"}];
		var oProductModel = new sap.ui.model.json.JSONModel(aProduct);
		var oProduct = new sap.ui.commons.AutoComplete({
			  width: "100%",
	      	  maxPopupItems: 5,
	      	  tooltip: "enter a name",
	      	  displaySecondaryvalues: false,
	      	  value:"{addedItems>product}",
	      	  items:{
	      		  path:"productModel>/",
	      		  template: new sap.ui.core.ListItem({text:"{productModel>product}"} )
	      	  },
	      	  change: function(evt){
	      		if(evt.getParameters().selectedItem!=null){
		      		var sPath = evt.getParameters().selectedItem.oBindingContexts.productModel.sPath;
		      		var oData = evt.getSource().getModel("productModel").getProperty(sPath);
		      		var index = evt.getSource().getParent().oBindingContexts.addedItems.sPath.split("/")[1];
		      		sap.ui.getCore().getModel("addedItems").oData[index].price = oData.price;
		      		sap.ui.getCore().getModel("addedItems").oData[index].product = oData.product;
		      		sap.ui.getCore().getModel("addedItems").refresh();
	      		}
	      		
	      	  }      	  
	    });
		
		oProduct.setModel(oProductModel,"productModel");
		
		
		var oMTable = new sap.m.Table({
			columns:[
			         new sap.m.Column({
			        	 width: "40%",
			        	 header:new sap.m.Label({text:"Product"})
			         }),
			         new sap.m.Column({
			        	 header:new sap.m.Label({text:"Price"})
			         }),
			         new sap.m.Column({
			        	 header:new sap.m.Label({text:"Quantity"}),
			        	 
			         }),
			         new sap.m.Column({
			        	 width:"15%"
			         })]
		});
		
		var oColTemplate =  new sap.m.ColumnListItem({
	        cells : [ oProduct, 
	                  new sap.ui.commons.TextField({
	                	  value : "{addedItems>price}",
	                	  width:"100%"	
	                  }), 
	                  new sap.ui.commons.TextField({
	                	  value : "{addedItems>quantity}",
	                	  width:"50%"	            
	                  }),
	                  
	                  new sap.ui.commons.Button({icon:"sap-icon://delete",
	                	  
	                	  press:function(evt){
	                		  var index = evt.getSource().getParent().oBindingContexts.addedItems.sPath.split("/")[1];
	                		  sap.ui.getCore().getModel("addedItems").oData.splice(index,1);
	                		  sap.ui.getCore().getModel("addedItems").refresh();
	                	  }})
	        		]
	    });
		oMTable.setModel(sap.ui.getCore().getModel("addedItems"),"addedItems");
		oMTable.bindAggregation("items","addedItems>/", oColTemplate);
		
		
		var oForm = new sap.ui.layout.form.SimpleForm("itemForm",{
			maxContainerCols: 2,
			editable: true,
			content:[
			          new sap.ui.core.Title({text: "Customer"}),
			          new sap.m.Label({text:"Name"}),
			          this.oCustName,
			          new sap.m.Label({text:"Shipping Address"}),
			          new sap.ui.commons.TextField("shippingAddId",{value: "{customer>/add/text}", valueState: "{customer>/add/state}"}),
			          new sap.m.Label({text:"Contact"}),
			          new sap.ui.commons.TextField("contactId",{value: "{customer>/phone/text}",valueState:"{customer>/phone/state}"}),
			          
			          new sap.ui.core.Title({text: "Order Items"}),
			          new sap.m.Button({text:"add item",
			        	  press: function(){
			        		  sap.ui.getCore().getModel("addedItems").getData().splice(0,0,{product:"",price:"",quantity:""});
			        		  sap.ui.getCore().getModel("addedItems").refresh();
			        	  }}),
			         new sap.m.Label({visible:false}), 
			         oMTable,
			          
			          
			         ]
		});
		
		
 		return new sap.m.Page({
			title: "Add New Order",
			showNavButton: "{device>/isPhone}",
			navButtonPress: function(){
				oController.navBack();
			},
			content: [
			      oForm
			],
			footer: new sap.m.Bar({
				contentRight: new sap.m.Button({
					icon: "sap-icon://complete",
					press: function(event){
						oController.createOrder(event);
					}
				})
			})
		});
	}

});