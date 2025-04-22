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
            const oMockUsers = this.initSampleDataModel();
            const oModel = new JSONModel({users: oMockUsers});
            console.log(oModel);
            this.getView().setModel(oModel);
        },

        initSampleDataModel(){
            const mockUsers = [
                {
                  UserID: 1,
                  Name: "Alice Santos",
                  Email: "alice.santos@example.com"
                },
                {
                  UserID: 2,
                  Name: "Bruno Oliveira",
                  Email: "bruno.oliveira@example.com"
                },
                {
                  UserID: 3,
                  Name: "Carla Mendes",
                  Email: "carla.mendes@example.com"
                },
                {
                  UserID: 4,
                  Name: "Diego Lima",
                  Email: "diego.lima@example.com"
                },
                {
                  UserID: 5,
                  Name: "Eduarda Rocha",
                  Email: "eduarda.rocha@example.com"
                },
                {
                  UserID: 6,
                  Name: "Felipe Souza",
                  Email: "felipe.souza@example.com"
                },
                {
                  UserID: 7,
                  Name: "Gabriela Freitas",
                  Email: "gabriela.freitas@example.com"
                },
                {
                  UserID: 8,
                  Name: "Henrique Alves",
                  Email: "henrique.alves@example.com"
                },
                {
                  UserID: 9,
                  Name: "Isabela Costa",
                  Email: "isabela.costa@example.com"
                },
                {
                  UserID: 10,
                  Name: "João Pereira",
                  Email: "joao.pereira@example.com"
                }
            ];
            return mockUsers;
        },

        filterGlobally(oEvent){
            const sQuery = oEvent.getParameter("query");
            this._oGloballyFilter = null;

            if(sQuery){
                this._oGloballyFilter = new Filter([
                    new Filter("Name", FilterOperator.Contains, sQuery),
                    new Filter("Email", FilterOperator.Contains, sQuery)
                ])
            }
            this.byId("idUsers").getBinding().filter(this._oGloballyFilter, "Application");
        },

        //#region Add Dialog

        onOpenAddDialog(oEvent) {
            if(!this.oAddDialog){
                this.oAddDialog = this.loadFragment({
					name: "project1.view.dialog.View1Dialog",
                    controller: this
				});
            }
            this.oAddDialog.then(function (oDialog) {
				this.oDialog = oDialog;
                this.oDialog.mProperties.title = "Add User"
				this.oDialog.open();

			}.bind(this));
        },

        onUserEditDialog(oEvent) {
            if(!this.oAddDialog){
                this.oAddDialog = this.loadFragment({
					name: "project1.view.dialog.View1Dialog",
                    controller: this
				});
            }
            this.oAddDialog.then(function (oDialog) {
				this.oDialog = oDialog;
                this.oDialog.mProperties.title = "Edit User"
				this.oDialog.open();

			}.bind(this));
        },

        onClose(oEvent){
            this.oDialog.close();
        },

        onSave(oEvent) {
            console.log(oEvent);
        }
        //#endregion
    });
});