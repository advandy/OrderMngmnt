jQuery.sap.declare("Utils.Synchron");

Utils.Synchron={
	refreshMasterView: function(sOrderStatus){
		var oApp = sap.ui.getCore().byId("appId");
		var oDeferr = $.Deferred();
		oApp.oDao.selectOrders(oDeferr, sOrderStatus);
		oDeferr.done(function(oData){
			var oModel = new sap.ui.model.json.JSONModel(oData);			
			sap.ui.getCore().getModel("orderData").oData = oData;
			var oItem = sap.ui.getCore().getModel("orderData").getProperty("/0");			;
			sap.ui.getCore().getModel("item").oData = oItem;
			sap.ui.getCore().getModel("orderData").refresh();
			sap.ui.getCore().getModel("item").refresh();
		});
	}
}