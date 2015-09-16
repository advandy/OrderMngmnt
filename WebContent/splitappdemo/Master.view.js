sap.ui.jsview("splitappdemo.Master", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf splitappdemo.Master
	*/ 
	getControllerName : function() {
		return "splitappdemo.Master";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf splitappdemo.Master
	*/ 
	

	
	createContent : function(oController) {
 		
		this.oList = new sap.m.List("listId",{
			mode: "{device>/listMode}",
			select: function(event){
				oController.itemSelected(event);
			}
			
		});
		
		this.oItemTemplate = new sap.m.ObjectListItem({
			id: "sList",
			title:"{orderData>custName}",
			intro:"{orderData>add}",
			number:"{orderData>orderId}",
			press: function(event){
				oController.itemSelected(event);
			}
		});
		
		this.oList.bindAggregation("items","orderData>/",this.oItemTemplate);
		
		
		
		/*<footer>
		<Bar>
			<contentRight>
				<Button
					icon="sap-icon://add"
					tooltip="{i18n>masterFooterAddButtonTooltip}"
					press="onAddProduct" />
			</contentRight>
		</Bar>
	</footer>*/
		
		var oCombi = new sap.m.ComboBox({
			items:[new sap.ui.core.ListItem({text:"Open",key:"open"}),
			       new sap.ui.core.ListItem({text:"Completed",key:"completed"}),
			       new sap.ui.core.ListItem({text:"Products",key:"products"})],
			selectionChange: function(oEvent){
				oController.changeMenu(oEvent);
			}
		});
		
		oCombi.setSelectedKey("open");
		
		
		return new sap.m.Page({
			title: "Order",
			content: [this.oList],
			subHeader: new sap.m.Bar({
				contentLeft:oCombi
			}),
			footer: new sap.m.Bar({
				contentRight: new sap.m.Button({
					icon: "sap-icon://add",
					press: function(){
						oController.addOrder();
					}
				})
			})
		});
	}

});