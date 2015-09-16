sap.ui.jsview("splitappdemo.Details", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf splitappdemo.Details
	*/ 
	getControllerName : function() {
		return "splitappdemo.Details";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf splitappdemo.Details
	*/ 
	createContent : function(oController) {
		var oObjHeader = new sap.m.ObjectHeader({
			title:"{item>/orderId}",
			number:"{item>/sum}",
			numberUnit:"RMB",
			attributes:[new sap.m.ObjectAttribute({				
				text:"{item>/custName}"
			}),new sap.m.ObjectAttribute({
				text:"{item>/date}"
			}), new sap.m.ObjectAttribute({
				
				text: "{item>/add}"
			})],
			firstStatus:[new sap.m.ObjectStatus({
				title:"Status",
				text:"{item>/status}",
				state:sap.ui.core.ValueState.Error
			})]
		});
		
		var oMTable = new sap.m.Table({
			columns:[
			         new sap.m.Column({
			        	 width: "35%",
			        	 header:new sap.m.Label({text:"Product"})
			         }),
			         new sap.m.Column({
			        	 header:new sap.m.Label({text:"Quantity"})
			         }),
			         new sap.m.Column({
			        	 header:new sap.m.Label({text:"Check"})
			         }),
			         new sap.m.Column()]
		});
		
		var checkBox = new sap.ui.commons.CheckBox({
			 width:"50%",
            checked : "{item>isPurchased}",
            change: function(){
            	oController.changeOrder();
            }
        });
		
		var oColTemplate =  new sap.m.ColumnListItem({
	        cells : [ new sap.ui.commons.TextField({
	            value : "{item>product}",
	            width: "100%"
	        }),  new sap.ui.commons.TextField({
	            value : "{item>quantity}",
	            width:"50%",
	            change: function(){
	            	oController.changeOrder();
	            },
	        }), checkBox,
	            new sap.ui.commons.Button({
	            	icon:"sap-icon://delete",
	            	press: function(oEvt){
	            		var model = sap.ui.getCore().getModel("item");
	            		var index = parseInt(oEvt.getSource().oPropagatedProperties.oBindingContexts.item.sPath.split("/")[2]);
	            		model.oData.orders.splice(index,1);
	            		model.refresh();
	            		
	            	}})
	        ]
	    });
		oMTable.bindAggregation("items","item>/orders", oColTemplate);
		
		
		
		
		var oIconTabBar = new sap.m.IconTabBar({
			items:[
			       new sap.m.IconTabFilter({
			    	   key:"orderItems",
			    	   text:"Order Items",
			    	   //icon:"sap-icon://cart",
			    	   content:[oMTable]
			       }),
			       new sap.m.IconTabFilter({
			    	   key:"Note",
			    	   text:"Note",
			    	  // icon:"sap-icon://notes",
			    	   content:[new sap.m.TextArea({value:"{item>/note}",rows:5,cols:50})]
			       }),
			       new sap.m.IconTabFilter({
			    	   key: "Shippment",
			    	   text: "Shippment",
			    	   content:[new sap.m.Label({text: "Shippment: "}),
			    	            new sap.ui.commons.TextField({value:"{item>/shippment}"})]
			       })]
		})
		
		var oCompleteBtn = new sap.m.Button()
		
		
		
 		return new sap.m.Page({
			title: "Order Details",
			showNavButton: "{device>/isPhone}",
			navButtonPress: function(){
				oController.navBack();
			},
			content: [oObjHeader,
			          oIconTabBar,			             
			],
			footer: new sap.m.Bar({
				contentLeft:[new sap.m.Button({
								  icon: "sap-icon://delete",
								  press: function(){
									  var orderId = oController.getView().getModel("item").oData.orderId;
									  var oApp = sap.ui.getCore().byId("appId");
									  var oDefer = new $.Deferred();
									  oApp.oDao.deleteOrder(oDefer, orderId);
									  oDefer.done(function(){
										  oController.onOrderChanged("deleted");
									  }).fail(function(){
										  alert("Failed to delete order");
									  });
								  }
							   })],
				contentRight: [new sap.m.Button({
									icon: "sap-icon://add",
									press: function(event){
										
										if (oController.getView().getModel("item").oData.orders === undefined){
											oController.getView().getModel("item").oData.orders = [];
										}
										oController.getView().getModel("item").oData.orders.splice(0,0,{product:"", isPurchased:false, quantity:1});
										oController.getView().getModel("item").refresh();
									}}),
							   new sap.m.Button({
								  icon: "sap-icon://save",
								  press: function(){
									  var oApp = sap.ui.getCore().byId("appId");
									  var oDefer = new $.Deferred();
									  oApp.oDao.editOrder(oDefer, oController.getView().getModel("item").oData);
									  oDefer.done(function(){
										  oController.onOrderChanged("saved");
									  }).fail(function(){
										  alert("Failed to save order");
									  });
								  }
							   }),							   
				               new sap.m.Button({
									icon: "sap-icon://complete",
									press: function(event){
										oController.completeOrder();
									}})
							   ]
			})
		});
	}

});