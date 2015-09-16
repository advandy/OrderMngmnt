sap.ui.controller("splitappdemo.Intro", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf splitappdemo.Intro
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf splitappdemo.Intro
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf splitappdemo.Intro
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf splitappdemo.Intro
*/
//	onExit: function() {
//
//	},
	createOrder: function(event) {
		var oCustData = sap.ui.getCore().getModel("customer").oData;
		var oItems = sap.ui.getCore().getModel("addedItems").oData;
		var oOrderDataModel = sap.ui.getCore().getModel("orderData");
		var that = this;		
		
		if(!oCustData||!oItems){
			alert("error");
			return;
		}
		
		var iCount = 0;
		
		for (var prop in oCustData){
			if(oCustData[prop].text === ""){
				iCount++;
				oCustData[prop].state = "Error";
			} else {
				oCustData[prop].state = "None";
			}
		}
		
		sap.ui.getCore().getModel("customer").refresh();
		
		if(iCount>0){
			return;
		}
		
		var date = new Date();
		var sOrderDate = date.getUTCFullYear() +"-"+ (date.getUTCMonth()+1) +"-"+ date.getUTCDate();
		var sOrderId = date.getYear().toString()+date.getMonth()+date.getDay()+date.getHours()+date.getMinutes()+date.getSeconds();
		
		var oCreatedOrderData = {order_id: sOrderId, customer_id : oCustData.custName.text, order_status: "open", order_data:sOrderDate};
		var oCustomerData = {cust_id: oCustData.custName.text, cust_add: oCustData.add.text, cust_contact: oCustData.phone.text}
		var aOrderItems = [];
		for (var item in oItems){
			aOrderItems.push({order_id: sOrderId, prod_name: oItems[item].product, quantity:parseInt(oItems[item].quantity), checked:0});
		}
		
		var defer = new $.Deferred();
		var oApp = sap.ui.getCore().byId("appId");
		oApp.oDao.createNewOrder(defer, oCreatedOrderData, oCustomerData, aOrderItems);
		defer.done(function(){
			jQuery.sap.require("sap.m.MessageBox");
			
			var oApp = sap.ui.getCore().byId("appId");
			var oDeferr = new $.Deferred();
			oApp.oDao.selectOrders(oDeferr,"open");
			oDeferr.done(function(oData){
				var oModel = new sap.ui.model.json.JSONModel(oData);			
				sap.ui.getCore().getModel("orderData").oData = oData;
				var oItem = sap.ui.getCore().getModel("orderData").getProperty("/0");			;
				sap.ui.getCore().getModel("item").oData = oItem;
				sap.ui.getCore().getModel("orderData").refresh();
				sap.ui.getCore().getModel("item").refresh();
			});
			  sap.m.MessageBox.show(
					  "Order Created!", {
			          icon: sap.m.MessageBox.Icon.INFORMATION,
			          actions: [sap.m.MessageBox.Action.YES],
			          onClose: function(oAction) {
			        	  if(oAction==sap.m.MessageBox.Action.YES){
			        		  that.navBack();
			        	  }
			          }
			      }
			    );
		}).fail(function(err){
			alert(err);
		});
		
		
	},
	
	navBack:function(){
		var oApp = sap.ui.getCore().byId("appId");
		oApp.toMaster("masterId","slide");
	}

});