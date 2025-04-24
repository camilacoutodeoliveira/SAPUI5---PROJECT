sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog"
], (Controller,
    JSONModel,
    Filter,
    FilterOperator,
    Dialog
) => {
    "use strict";
    return Controller.extend("project1.controller.View1", {
        onInit() {
            this.onSetUserModel();
            this.onSetListModel();
        },

        onBeforeRendering(){
            console.log('onBeforeRendering')
        },

        onAfterRendering(){
            console.log('onAfterRendering')
        },

        onExit(){
            console.log('onExit')
        },

        onSetUserModel(){
          const oModel = new JSONModel();
          oModel.loadData("model/mockData.json");
        
          oModel.attachRequestCompleted(() => {
            console.log("Mock data carregado com sucesso:", oModel.getData());
          });
        
          oModel.attachRequestFailed(() => {
            console.error("Erro ao carregar mockData.json");
          });
        
          this.getView().setModel(oModel);
        },

        onSetListModel(){
            const oFilterModel = new sap.ui.model.json.JSONModel();
            oFilterModel.loadData("model/filtersMock.json");

            oFilterModel.attachRequestCompleted(() => {
                console.log("Mock data carregado com sucesso:", oFilterModel.getData());
            });
            
            oFilterModel.attachRequestFailed(() => {
                console.error("Erro ao carregar mockData.json");
            });
            
            this.getView().setModel(oFilterModel, "filters");
        },

        filterGlobally(oEvent){
            const sQuery = oEvent.getParameter("query");
            this._oGloballyFilter = null;

            if(sQuery){
                this._oGloballyFilter = new Filter([
                    new Filter("Order", FilterOperator.Contains, sQuery),
                    new Filter("OrderType", FilterOperator.Contains, sQuery),
                    new Filter("Status", FilterOperator.Contains, sQuery),
                    new Filter("Plant", FilterOperator.Contains, sQuery),
                    new Filter("Description", FilterOperator.Contains, sQuery),
                    new Filter("WorkCenter", FilterOperator.Contains, sQuery),
                    new Filter("BasicStartDate", FilterOperator.Contains, sQuery),
                    new Filter("BasicFinishDate", FilterOperator.Contains, sQuery),
                    new Filter("FunctionalLocation", FilterOperator.Contains, sQuery),
                    new Filter("Equipment", FilterOperator.Contains, sQuery)
                ])
            }
            const oTable = this.byId("idOrdersTable");
            const oBinding = oTable.getBinding("items");
            oBinding.filter(this._oGloballyFilter, "Application");
        },

        onDeleteOrders(oEvent){
            const oTable = this.byId("idOrdersTable");
            const oSelectedItems = oTable.getSelectedItems();

            if(oSelectedItems.length === 0){
                sap.m.MessageToast.show("Seleted at least one item to delete!");
                return;
            }

            const oModel = this.getView().getModel();
            let oOrders = oModel.getProperty("/Orders");

            oSelectedItems.forEach(ordSelected => {
                const oItem = ordSelected.getBindingContext().getObject();
                oOrders =  oOrders.filter(ord => ord.Order != oItem.Order);
            })

            oModel.setProperty("/Orders", oOrders);
            oTable.removeSelections(); 
            sap.m.MessageToast.show("Item(s) removed successfully!");
        },
          

        //#region Add Dialog

        onOpenAddDialog(oEvent) {
            if(!this.oAddDialog) {
                this.oAddDialog = this.loadFragment({
					name: "project1.view.dialog.View1Dialog",
                    controller: this
                  });
            }
              this.oAddDialog.then(function (oDialog) {
              this.oDialog = oDialog;
              this.oDialog.mProperties.title = "Create Order"
              this.oDialog.open();

          }.bind(this));
        },

        onOrderEditDialog(oEvent) {
            if(!this.oAddDialog){
                this.oAddDialog = this.loadFragment({
				name: "project1.view.dialog.View1Dialog",
                controller: this
              });
            }
                this.oAddDialog.then(function (oDialog) {
                this.oDialog = oDialog;
                this.oDialog.mProperties.title = "Edit Order"
			    this.oDialog.open();
                const oOrder = oEvent.oSource.oParent.getBindingContext().getObject();
            this.onEditOrder(oOrder);
            }.bind(this));
        },

        onEditOrder(oOrder){

            this.byId("idOrder").setValue(oOrder.Order);
            this.byId("idOrderType").setSelectedKey(oOrder.OrderType);
            this.byId("idPlant").setSelectedKey(oOrder.Plant);
            this.byId("idDescription").setValue(oOrder.Description);
            this.byId("idWorkCenter").setSelectedKey(oOrder.WorkCenter);
            this.byId("idStartDate").setValue(oOrder.BasicStartDate);
            this.byId("idFinishDate").setValue(oOrder.BasicFinishDate);
            this.byId("idFuncLoc").setSelectedKey(oOrder.FunctionalLocation);
            this.byId("idEquip").setSelectedKey(oOrder.Equipment);
           
        },

        onClose(oEvent){
            this.oDialog.close();
        },

        onSave(oEvent) {

            if(this.oDialog.mProperties.title == "Create Order"){
                const oNewOrder = {
                    "Order": "TESTE",
                    "OrderType": this.byId("idOrderType").getSelectedKey(),
                    "Status": "Active",
                    "Plant": this.byId("idPlant").getSelectedKey(),
                    "Description": this.byId("idDescription").getValue(),
                    "WorkCenter": this.byId("idWorkCenter").getSelectedKey(),
                    "BasicStartDate": this.byId("idStartDate").getValue(),
                    "BasicFinishDate": this.byId("idFinishDate").getValue(),
                    "FunctionalLocation": this.byId("idFuncLoc").getSelectedKey(),
                    "Equipment": this.byId("idEquip").getSelectedKey()
                };
    
                const oModel = this.getView().getModel();
                const aOrders = oModel.getProperty("/Orders") || [];
                aOrders.unshift(oNewOrder);
                oModel.setProperty("/Orders", aOrders);
    
                sap.m.MessageToast.show("Ordem criada com sucesso!");
                this.onClearDialog();
                this.oDialog.close();
                this.byId("title").setText("Orders (" + aOrders.length + ")");
            } else {            

                const oUpdateOrder = {
                    "Order": this.byId("idOrder").getValue(),
                    "OrderType": this.byId("idOrderType").getSelectedKey(),
                    "Status": "In Progress",
                    "Plant": this.byId("idPlant").getSelectedKey(),
                    "Description": this.byId("idDescription").getValue(),
                    "WorkCenter": this.byId("idWorkCenter").getSelectedKey(),
                    "BasicStartDate": this.byId("idStartDate").getValue(),
                    "BasicFinishDate": this.byId("idFinishDate").getValue(),
                    "FunctionalLocation": this.byId("idFuncLoc").getSelectedKey(),
                    "Equipment": this.byId("idEquip").getSelectedKey()
                };

                const oModel = this.getView().getModel();
                const aOrders = oModel.getProperty("/Orders") || [];

                const iIndex = aOrders.findIndex(order => order.Order === oUpdateOrder.Order);

                if (iIndex !== -1) {
                    aOrders[iIndex] = oUpdateOrder;
                    oModel.setProperty("/Orders", aOrders);

                    sap.m.MessageToast.show("Order updated with sucess!");
                    this.onClearDialog();
                    this.oDialog.close();
                }
            }
        },

        onClearDialog(){
            [
                "idDescription","idStartDate", "idFinishDate"
            ].forEach((id) => {
                const oControl = this.byId(id);
                oControl.setValue("");
            });
        }
        //#endregion
    });
});