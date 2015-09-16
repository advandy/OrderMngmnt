sap.ui.controller("splitappdemo.Details", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf splitappdemo.Details
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf splitappdemo.Details
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf splitappdemo.Details
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf splitappdemo.Details
*/
//	onExit: function() {
//
//	},
	navBack: function(){
		var oApp = sap.ui.getCore().byId("appId");
		oApp.toMaster("masterId","slide");
	},
	
	completeOrder: function(){
		var that = this;
		this.getView().getModel("item").oData.status = "completed";
		var oApp = sap.ui.getCore().byId("appId");
		var oDefer = new $.Deferred();
		oApp.oDao.editOrder(oDefer,this.getView().getModel("item").oData);
		oDefer.done(function(){
			  that.onOrderChanged("completed");
		  }).fail(function(){
			  alert("Failed to complete order");
		  });
	},
	
	onOrderChanged: function(message){
			var that = this;
			jQuery.sap.require("sap.m.MessageBox");
			var oDeferr = $.Deferred();
			jQuery.sap.require("Utils.Synchron");
			Utils.Synchron.refreshMasterView("open");
            sap.m.MessageBox.show(
					  sap.ui.getCore().getModel("item").oData.orderId+" "+message, {
			          icon: sap.m.MessageBox.Icon.INFORMATION,
			          actions: [sap.m.MessageBox.Action.YES],
			          onClose: function(oAction) {			        	  
			        		  that.navBack();  	  
			          }
			      }
			    );
		
	},
	
//	changeCheck: function(evt){
//		var sId = sap.ui.getCore().getModel("item").oData.oderId;
//		var sItem = sap.ui.getCore().getModel("item").getProperty(evt.getSource().oPropagatedProperties.oBindingContexts.item.sPath).product;
//		var bIsPurchased = evt.getSource().getSelected();
//		alert(bIsPurchased? sId+" "+sItem+" purchased": sId+" "+sItem+"not purchased");
//	}
	changeOrder: function(){
		var oData = sap.ui.getCore().getModel("item").getData();
		console.log(oData);
	}
});