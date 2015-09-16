jQuery.sap.require("DAO.DaoUtils");


sap.ui.controller("splitappdemo.Master", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf splitappdemo.Master
*/
	onInit: function() {
		
		var oApp = sap.ui.getCore().byId("appId");
		oApp.oDao = DAO.DaoUtils;
		oApp.oDao.initDB();
		
		var deviceModel = new sap.ui.model.json.JSONModel({
            isTouch : sap.ui.Device.support.touch,
            isNoTouch : !sap.ui.Device.support.touch,
            isPhone : sap.ui.Device.system.phone,
            isNoPhone : !sap.ui.Device.system.phone,
            listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
            listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
        });		
		sap.ui.getCore().setModel(deviceModel, "device");
		
		var oModel = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oModel, "orderData");
		
					
		var oModel = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oModel, "item");
		
		var oDeferr = $.Deferred();
		oApp.oDao.selectOrders(oDeferr,"open");
		oDeferr.done(function(oData){
			var oModel = new sap.ui.model.json.JSONModel(oData);			
			sap.ui.getCore().getModel("orderData").oData = oData;
			var oItem = sap.ui.getCore().getModel("orderData").getProperty("/0");			;
			sap.ui.getCore().getModel("item").oData = oItem;
			sap.ui.getCore().getModel("orderData").refresh();
			sap.ui.getCore().getModel("item").refresh();
		});
		
	/*	var oData = [{orderId:"10000", custName: "Andy", add:"musterStrasse 222. 68199, Mannheim",sum:1890, status:"open", date:"2015-8-8",orders:[{
			product:"Aptamil 1", price:"14.99", quantity:3, isPurchased:true
		},{
			product:"Aptamil 2", price:"14.99", quantity:3, isPurchased:false
		},{
			product:"Aptamil 3", price:"14.99", quantity:3, isPurchased:true
		},{
			product:"Hipp 3", price:"14.99", quantity:3, isPurchased:false
		},{
			product:"Hipp 3", price:"14.99", quantity:3, isPurchased:false
		}]},
		             {orderId:"10001", custName: "Roger", add:"dfdfStras d12. 6819d9, Schweiss", sum: 1000, status:"open",date:"2015-8-8",orders:[{
		     			product:"Aptamil 1", price:"14.99", quantity:3, isPurchased:false
		     		},{
		     			product:"Aptamil 2", price:"14.99", quantity:3, isPurchased:false
		     		},{
		     			product:"Aptamil 3", price:"14.99", quantity:3, isPurchased:false
		     		},{
		     			product:"Hipp 3", price:"14.99", quantity:3, isPurchased:true
		     		}]},
		             {orderId:"10002", custName: "Rafael", add:"Swis De Venu 2. ddd, Spain", sum: 780, status:"open",date:"2015-8-8",orders:[{
		     			product:"Aptamil 1", price:"14.99", quantity:3,isPurchased:false
		     		},{
		     			product:"Aptamil 2", price:"14.99", quantity:3, isPurchased:false
		     		},{
		     			product:"Aptamil 3", price:"14.99", quantity:3, isPurchased:false
		     		},{
		     			product:"Hipp 3", price:"14.99", quantity:3, isPurchased:false
		     		}]}]*/

		
	
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf splitappdemo.Master
*/
	

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf splitappdemo.Master
*/
	
/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf splitappdemo.Master
*/
//	onExit: function() {
//
//	},
	addOrder: function(){
		var oApp = sap.ui.getCore().byId("appId");
		var oOrderData = {custName:{text:"",state:"None"}, add:{text:"",state:"None"}, phone:{text:"",state:"None"}};
		var oOrderModel = new sap.ui.model.json.JSONModel(oOrderData);
		sap.ui.getCore().setModel(oOrderModel,"customer");
		var oAddedItemsModel = new sap.ui.model.json.JSONModel();
		oAddedItemsModel.setData([{product:"", price:"", quantity:""}]);
		sap.ui.getCore().setModel(oAddedItemsModel,"addedItems");
		oApp.toDetail("introId", "slide");
	},
	
	
	changeMenu: function(oEvent){
		var oCBox = oEvent.getSource();
		var oApp = sap.ui.getCore().byId("appId");
		var sSelectedItem = oCBox.getSelectedItem().getKey();
		jQuery.sap.require("Utils.Synchron");
		switch (sSelectedItem){
			case "products":
				var dfd = $.Deferred();
				oApp.oDao.selectAllProducts(dfd);
				
				dfd.done(function(oProductData){
					oProductData.splice(0,0,{product:"",brand:"",price:undefined, icon:"sap-icon://add"});
					var oProductModel = new sap.ui.model.json.JSONModel(oProductData);
					sap.ui.getCore().setModel(oProductModel,"productModel");
					oApp.toDetail("productsId","slide");
					oCBox.setSelectedKey("open");	
				});			
				break;
			case "open":
				Utils.Synchron.refreshMasterView("open");
				break;
			case "completed":
				Utils.Synchron.refreshMasterView("completed");
				break;
				
		}
		
	},

	itemSelected: function(event){
		var oApp = sap.ui.getCore().byId("appId");
		var oList = event.getParameter("listItem") || event.getSource();
	
		var sPath = oList.oBindingContexts.orderData.sPath;
		
		var oItem = sap.ui.getCore().getModel("orderData").getProperty(sPath);
		
		var oModel = new sap.ui.model.json.JSONModel(oItem);
		sap.ui.getCore().setModel(oModel, "item");
		
		oApp.toDetail("detailsId","slide");		
		
	}
	
});