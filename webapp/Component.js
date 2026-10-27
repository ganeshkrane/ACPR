var searchInput = "";
var searchSet = "";



sap.ui.define([
	"sap/ui/core/UIComponent",
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel'
], function (UIComponent, JSONModel, ResourceModel) {
	"use strict";
 
	return UIComponent.extend("invictusbs.ui5.inventory.approve.collectivepr.Component", {
		
		
	  metadata: {
        manifest: "json",
        "config" : {"fullWidth" : true},
        includes : [ "css/style.css" ] 

    },
		

 
		init: function () {
		  
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			
			var oModel = new JSONModel();
			
	         this.setModel(oModel);
	         
	         //console.log(this.getModel());
	         
	               
	         var i18nModel = new ResourceModel({
	             bundleName: "invictusbs.ui5.inventory.approve.collectivepr.i18n.i18n"
	          });
	         sap.ui.getCore().setModel(i18nModel, "i18n");
 
			// create the views based on the url/hash
			this.getRouter().initialize();
		}
 
	});
 
});