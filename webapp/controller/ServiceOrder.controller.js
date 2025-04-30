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

    const ID_ORDER = "idOrder";
    const ID_ORDER_TYPE = "idOrderType";
    const ID_PLANT = "idPlant";
    const ID_DESCRIPTION = "idDescription";
    const ID_WORK_CENTER = "idWorkCenter";
    const ID_START_DATE = "idStartDate";
    const ID_FINISH_DATE = "idFinishDate";
    const ID_FUNC_LOC = "idFuncLoc";
    const ID_EQUIP = "idEquip";

     const ORDER = "Order";
     const ORDER_TYPE = "OrderType";
     const STATUS = "Status";
     const PLANT = "Plant";
     const DESCRIPTION = "Description";
     const WORK_CENTER = "WorkCenter";
     const BASIC_START_DATE = "BasicStartDate";
     const BASIC_FINISH_DATE = "BasicFinishDate";
     const FUNCTIONAL_LOCATION = "FunctionalLocation";
     const EQUIPMENT = "Equipment";

    return Controller.extend("project1.controller.ServiceOrder", {
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
        
        //#region Set MockData

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

        //#endregion

        //#region Events

        filterGlobally(oEvent){
            const sQuery = oEvent.getParameter("query");
            this._oGloballyFilter = null;

            if(sQuery){
                this._oGloballyFilter = new Filter([
                    new Filter(ORDER, FilterOperator.Contains, sQuery),
                    new Filter(ORDER_TYPE, FilterOperator.Contains, sQuery),
                    new Filter(STATUS, FilterOperator.Contains, sQuery),
                    new Filter(PLANT, FilterOperator.Contains, sQuery),
                    new Filter(DESCRIPTION, FilterOperator.Contains, sQuery),
                    new Filter(WORK_CENTER, FilterOperator.Contains, sQuery),
                    new Filter(BASIC_START_DATE, FilterOperator.Contains, sQuery),
                    new Filter(BASIC_FINISH_DATE, FilterOperator.Contains, sQuery),
                    new Filter(FUNCTIONAL_LOCATION, FilterOperator.Contains, sQuery),
                    new Filter(EQUIPMENT, FilterOperator.Contains, sQuery)
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
        
        //#endregion

        //#region Add Dialog

        onOpenAddDialog(oEvent) {
            if(!this.oAddDialog) {
                this.oAddDialog = this.loadFragment({
					name: "project1.view.dialog.ServiceOrderDialog",
                    controller: this
                  });
            }
              this.oAddDialog.then(function (oDialog) {
              this.oDialog = oDialog;
              this.oDialog.mProperties.title = "Create Order"
              this.oDialog.open();
              const sOrder = this.onCreateOrderNumber();
              this.byId(ID_ORDER).setValue(sOrder);

          }.bind(this));
        },

        onCreateOrderNumber(){
            const oModel = this.getView().getModel();
            const oOrders = oModel.getProperty("/Orders") || [];

            const lastOrderNumber = oOrders.length > 0
            ? Math.max(...oOrders.map(order => order.Order))
            : baseNumber;

            const nextOrder = lastOrderNumber + 1;

            return nextOrder;
        },

        onOrderEditDialog(oEvent) {
            if(!this.oAddDialog){
                this.oAddDialog = this.loadFragment({
				name: "project1.view.dialog.ServiceOrderDialog",
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
            this.byId(ID_ORDER).setValue(oOrder.Order);
            this.byId(ID_ORDER_TYPE).setSelectedKey(oOrder.OrderType);
            this.byId(ID_PLANT).setSelectedKey(oOrder.Plant);
            this.byId(ID_DESCRIPTION).setValue(oOrder.Description);
            this.byId(ID_WORK_CENTER).setSelectedKey(oOrder.WorkCenter);
            this.byId(ID_START_DATE).setValue(oOrder.BasicStartDate);
            this.byId(ID_FINISH_DATE).setValue(oOrder.BasicFinishDate);
            this.byId(ID_FUNC_LOC).setSelectedKey(oOrder.FunctionalLocation);
            this.byId(ID_EQUIP).setSelectedKey(oOrder.Equipment);
           
        },

        onClose(oEvent){
            this.onClearDialog();
            this.oDialog.close();
        },

        onSave(oEvent) {
            if(this.oDialog.mProperties.title == "Create Order"){
                const oNewOrder = {
                    "Order": this.byId(ID_ORDER).getValue(),
                    "OrderType": this.byId(ID_ORDER_TYPE).getSelectedKey(),
                    "Status": "Active",
                    "Plant": this.byId(ID_PLANT).getSelectedKey(),
                    "Description": this.byId(ID_DESCRIPTION).getValue(),
                    "WorkCenter": this.byId(ID_WORK_CENTER).getSelectedKey(),
                    "BasicStartDate": this.byId(ID_START_DATE).getValue(),
                    "BasicFinishDate": this.byId(ID_FINISH_DATE).getValue(),
                    "FunctionalLocation": this.byId(ID_FUNC_LOC).getSelectedKey(),
                    "Equipment": this.byId(ID_EQUIP).getSelectedKey()
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
                    "Order": this.byId(ID_ORDER).getValue(),
                    "OrderType": this.byId(ID_ORDER_TYPE).getSelectedKey(),
                    "Status": "In Progress",
                    "Plant": this.byId(ID_PLANT).getSelectedKey(),
                    "Description": this.byId(ID_DESCRIPTION).getValue(),
                    "WorkCenter": this.byId(ID_WORK_CENTER).getSelectedKey(),
                    "BasicStartDate": this.byId(ID_START_DATE).getValue(),
                    "BasicFinishDate": this.byId(ID_FINISH_DATE).getValue(),
                    "FunctionalLocation": this.byId(ID_FUNC_LOC).getSelectedKey(),
                    "Equipment": this.byId(ID_EQUIP).getSelectedKey()
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
            this.byId(ID_ORDER).setValue('');
            this.byId(ID_ORDER_TYPE).setSelectedKey('');
            this.byId(ID_PLANT).setSelectedKey('');
            this.byId(ID_DESCRIPTION).setValue('');
            this.byId(ID_WORK_CENTER).setSelectedKey('');
            this.byId(ID_START_DATE).setValue('');
            this.byId(ID_FINISH_DATE).setValue('');
            this.byId(ID_FUNC_LOC).setSelectedKey('');
            this.byId(ID_EQUIP).setSelectedKey('');
        },

        onDateChange(oEvent) {
            this.validateDates();
        },

        validateDates() {
            const oStartDate = this.byId(ID_START_DATE).getValue();
            const oFinishDate = this.byId(ID_FINISH_DATE).getValue();
        
            const startDate = oStartDate ? new Date(oStartDate) : null;
            const finishDate = oFinishDate ? new Date(oFinishDate) : null;
        
            if (startDate && finishDate) {
                if (finishDate < startDate) {
                    this.byId(ID_FINISH_DATE).setValue("");
                    sap.m.MessageToast.show("A data inicial não pode ser menor que a data inicial.");
                }
            }        
        }
        


        //#endregion
    });
});