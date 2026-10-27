sap.ui.define([
    "invictusbs/ui5/inventory/approve/collectivepr/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/core/HTML",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/PDFViewer",
    "sap/m/CheckBox",
    "sap/m/TextArea"
], function (
    BaseController,
    Filter,
    FilterOperator,
    MessageToast,
    HTML,
    JSONModel,
    MessageBox,
    Dialog,
    Button,
    PDFViewer,
    CheckBox,
    TextArea

) {
    "use strict";

    return BaseController.extend(
        "invictusbs.ui5.inventory.approve.collectivepr.controller.Home",
        {
            onInit: function () {

                this._pageSize = 50;
                this._currentPage = 0;
                this._totalCount = 0;
                this._currentFilters = [];
                this.byId("idBtnApprove").setEnabled(false);
                this.byId("idBtnReject").setEnabled(false);

                var oModel = this.getOwnerComponent()
                    .getModel("Z_PR_APPROVAL_SRV");

                oModel.read("/PRHeaderSet", {

                    success: function (oData) {

                        var oSeen = {};
                        var aUniquePRs = [];

                        oData.results.forEach(function (oItem) {

                            var sPR = oItem.Banfn;

                            if (sPR && !oSeen[sPR]) {
                                oSeen[sPR] = true;

                                aUniquePRs.push({
                                    Banfn: sPR
                                });
                            }
                        });

                        var oPRFilterModel = new sap.ui.model.json.JSONModel({
                            results: aUniquePRs
                        });

                        this.getView().setModel(
                            oPRFilterModel,
                            "PRFilter"
                        );

                        console.log("Unique PR Numbers:", aUniquePRs);

                    }.bind(this),

                    error: function (oError) {
                        console.error("Error loading PR numbers:", oError);
                    }
                });
            },

            onGoPress: function () {

                var oTable = this.byId("idTblRequisitions");
                var oModel = this.getOwnerComponent()
                    .getModel("Z_PR_APPROVAL_SRV");

                if (!oModel) {
                    MessageBox.error("Z_PR_APPROVAL_SRV model is not available.");
                    return;
                }

                var aFilters = []; //filterValues
                // var aPRNumbers = this.byId("idPrNumber").getTokens().map(function (oToken) {
                //     return oToken.getKey() || oToken.getText();
                // });
                var aPRNumbers = this.byId("idPrNumber").getSelectedKeys();
                var aPurchaseGroups = this.byId("idPurchaseGroup").getSelectedKeys();
                var aPlants = this.byId("idPlant").getSelectedKeys();
                var aVendors = this.byId("idVendor").getSelectedKeys();
                var aReleaseGroups = this.byId("idReleaseGroup").getSelectedKeys();
                var aReleaseCodes = this.byId("idReleaseCode").getSelectedKeys();
                if (aPRNumbers.length > 0) {

                    var aPRFilters = aPRNumbers.map(function (sPR) {
                        return new Filter(
                            "Banfn",
                            FilterOperator.EQ,
                            sPR
                        );
                    });
                    aFilters.push(
                        new Filter({
                            filters: aPRFilters,
                            and: false
                        })
                    );
                }

                if (aPurchaseGroups.length > 0) {
                    var aPurchaseGroupFilters = [];
                    aPurchaseGroups.forEach(function (sGroup) {
                        aPurchaseGroupFilters.push(
                            new Filter("Ekgrp", FilterOperator.EQ, sGroup)
                        );
                    });

                    aFilters.push(
                        new Filter({ filters: aPurchaseGroupFilters, and: false })
                    );
                }

                if (aReleaseGroups.length > 0) {

                    var aReleaseGroupFilters = aReleaseGroups.map(function (sReleaseGroup) {
                        return new Filter(
                            "Frggr",
                            FilterOperator.EQ,
                            sReleaseGroup
                        );
                    });
                    aFilters.push(
                        new Filter({
                            filters: aReleaseGroupFilters,
                            and: false
                        })
                    );
                }

                if (aReleaseCodes.length > 0) {

                    var aReleaseCodeFilters = aReleaseCodes.map(function (sReleaseCode) {
                        return new Filter(
                            "Frgco",
                            FilterOperator.EQ,
                            sReleaseCode
                        );
                    });
                    aFilters.push(
                        new Filter({
                            filters: aReleaseCodeFilters,
                            and: false
                        })
                    );
                }

                if (aPlants.length > 0) {
                    var aPlantFilters = aPlants.map(function (sPlant) {
                        return new Filter(
                            "Werks",
                            FilterOperator.EQ,
                            sPlant
                        );
                    });
                    aFilters.push(
                        new Filter({
                            filters: aPlantFilters,
                            and: false
                        })
                    );
                }

                if (aVendors.length > 0) {
                    var aVendorFilters = aVendors.map(function (sVendor) {
                        return new Filter(
                            "Lifnr",
                            FilterOperator.EQ,
                            sVendor
                        );
                    });
                    aFilters.push(
                        new Filter({
                            filters: aVendorFilters,
                            and: false
                        })
                    );
                }
                console.log("Filters:", aFilters);
                console.log("Purchase Groups:", aPurchaseGroups);

                // oModel.read("/PRHeaderSet", {
                //     filters: aFilters,
                //     success: function (oData) {
                //         console.log("PRHeaderSet GET SUCCESS:", oData);

                //         var aResults = oData.results || [];
                //         console.log("Count:", aResults.length);
                //         console.log("Number of PR records:", aResults.length);

                //         var oResultModel = new sap.ui.model.json.JSONModel({
                //             results: aResults,
                //             totalCount: aResults.length
                //         });
                //         // oTable.setModel(oResultModel, "PRResult");
                //         this.getView().setModel(oResultModel, "PRResult");
                //         var oTemplate = new sap.m.ColumnListItem({
                //             type: "Active",
                //             cells: [
                //                 // Requisition
                //                 new sap.m.Link({
                //                     text: "{PRResult>Banfn}",
                //                     press: this.onRequisitionLinkPress.bind(this)
                //                 }),

                //                 new sap.m.Text({ text: "{PRResult>Bsart}" }), // Doc Type

                //                 new sap.m.Text({ text: "{PRResult>Bnfpo}" }), // Item

                //                 new sap.m.Text({ text: "{PRResult>Matnr}" }), // Material

                //                 new sap.m.Text({ text: "{PRResult>Txz01}" }),   // Text Details

                //                 new sap.m.ObjectNumber({
                //                     number: {
                //                         path: "PRResult>Menge",     // Quantity
                //                         type: "sap.ui.model.type.Float",

                //                         formatOptions: {
                //                             minFractionDigits: 3,
                //                             maxFractionDigits: 3,
                //                             groupingEnabled: true
                //                         }
                //                     },

                //                     unit: "{PRResult>Meins}"
                //                 }),

                //                 new sap.m.ObjectNumber({
                //                     number: {
                //                         path: "PRResult>Netpr",              // Net Value
                //                         type: "sap.ui.model.type.Float",

                //                         formatOptions: {
                //                             minFractionDigits: 2,
                //                             maxFractionDigits: 2,
                //                             groupingEnabled: true
                //                         }
                //                     },
                //                     unit: "{PRResult>Waers}"

                //                 }),

                //                 new sap.m.Text({
                //                     text: {
                //                         parts: [                        // Vendor
                //                             "PRResult>Lifnr",
                //                             "PRResult>VendorName1"
                //                         ],
                //                         formatter:
                //                             this.formatVendor.bind(this)
                //                     }
                //                 }),


                //                 new sap.m.Text({ text: "{PRResult>Werks}" }),     // Plant     
                //                 new sap.m.Text({
                //                     text: {
                //                         path: "PRResult>Badat",
                //                         type: "sap.ui.model.type.Date",
                //                         formatOptions: {
                //                             pattern: "dd/MM/yyyy"
                //                         }
                //                     }
                //                 }),
                //                 new sap.m.HBox({
                //                     justifyContent: "Center",
                //                     alignItems: "Center",
                //                     width: "100%",
                //                     items: [

                //                         new sap.m.Button({
                //                             icon: "sap-icon://attachment",
                //                             type: "Transparent",
                //                             text: {
                //                                 path: "PRResult>Count"
                //                             },
                //                             visible: {
                //                                 path: "PRResult>AttaId",
                //                                 formatter: function (sAttaId) {
                //                                     return !!sAttaId && sAttaId.trim() !== "";
                //                                 }
                //                             },
                //                             press: this.onAttachmentPress.bind(this)
                //                         }),

                //                         new sap.m.Text({
                //                             text: "None",
                //                             visible: {
                //                                 path: "PRResult>AttaId",
                //                                 formatter: function (sAttaId) {
                //                                     return !sAttaId || sAttaId.trim() === "";
                //                                 }
                //                             }
                //                         })
                //                     ]
                //                 })
                //             ]
                //         });

                //         oTable.unbindItems();
                //         oTable.bindItems({ path: "PRResult>/results", template: oTemplate });
                //         console.log("Items binding:", oTable.getBinding("items"));
                //         this.calculateTotalNetValue();
                //     }.bind(this),

                //     error: function (oError) {
                //         console.error("PRHeaderSet GET ERROR:", oError);
                //         MessageBox.error("Error while fetching Purchase Requisitions.");
                //     }
                // });
                this._currentFilters = aFilters;
                this._currentPage = 0;

                this._loadPRPage();
            },

            _loadPRPage: function () {

                var oModel = this.getOwnerComponent()
                    .getModel("Z_PR_APPROVAL_SRV");

                var oTable = this.byId("idTblRequisitions");

                oModel.read("/PRHeaderSet", {

                    filters: this._currentFilters,

                    success: function (oData) {

                        var aAllResults = oData.results || [];

                        // Total records returned by backend
                        this._totalCount = aAllResults.length;

                        // Calculate records for current page
                        var iStart = this._currentPage * this._pageSize;
                        var iEnd = iStart + this._pageSize;

                        var aResults = aAllResults.slice(iStart, iEnd);

                        console.log("Page:", this._currentPage + 1);
                        console.log("Total Records:", this._totalCount);
                        console.log("Start:", iStart);
                        console.log("End:", iEnd);
                        console.log("Records on Current Page:", aResults.length);

                        var oResultModel = new sap.ui.model.json.JSONModel({
                            results: aResults,
                            totalCount: aResults.length
                        });

                        this.getView().setModel(
                            oResultModel,
                            "PRResult"
                        );

                        // Your existing template
                        var oTemplate = new sap.m.ColumnListItem({
                            type: "Active",
                            cells: [

                                new sap.m.Link({
                                    text: "{PRResult>Banfn}",
                                    press: this.onRequisitionLinkPress.bind(this)
                                }),

                                new sap.m.Text({
                                    text: "{PRResult>Bsart}"
                                }),

                                new sap.m.Text({
                                    text: "{PRResult>Bnfpo}"
                                }),

                                new sap.m.Text({
                                    text: "{PRResult>Matnr}"
                                }),

                                new sap.m.Text({
                                    text: "{PRResult>Txz01}"
                                }),

                                new sap.m.ObjectNumber({
                                    number: {
                                        path: "PRResult>Menge",
                                        type: "sap.ui.model.type.Float",
                                        formatOptions: {
                                            minFractionDigits: 3,
                                            maxFractionDigits: 3,
                                            groupingEnabled: true
                                        }
                                    },
                                    unit: "{PRResult>Meins}"
                                }),

                                new sap.m.ObjectNumber({
                                    number: {
                                        path: "PRResult>Netpr",
                                        type: "sap.ui.model.type.Float",
                                        formatOptions: {
                                            minFractionDigits: 2,
                                            maxFractionDigits: 2,
                                            groupingEnabled: true
                                        }
                                    },
                                    unit: "{PRResult>Waers}"
                                }),

                                new sap.m.Text({
                                    text: {
                                        parts: [
                                            "PRResult>Lifnr",
                                            "PRResult>VendorName1"
                                        ],
                                        formatter: this.formatVendor.bind(this)
                                    }
                                }),

                                new sap.m.Text({
                                    text: "{PRResult>Werks}"
                                }),

                                new sap.m.Text({
                                    text: {
                                        path: "PRResult>Badat",
                                        type: "sap.ui.model.type.Date",
                                        formatOptions: {
                                            pattern: "dd/MM/yyyy"
                                        }
                                    }
                                }),

                                new sap.m.HBox({
                                    justifyContent: "Center",
                                    alignItems: "Center",
                                    width: "100%",
                                    items: [

                                        new sap.m.Button({
                                            icon: "sap-icon://attachment",
                                            type: "Transparent",
                                            text: {
                                                path: "PRResult>Count"
                                            },
                                            visible: {
                                                path: "PRResult>AttaId",
                                                formatter: function (sAttaId) {
                                                    return !!sAttaId &&
                                                        sAttaId.trim() !== "";
                                                }
                                            },
                                            press: this.onAttachmentPress.bind(this)
                                        }),

                                        new sap.m.Text({
                                            text: "None",
                                            visible: {
                                                path: "PRResult>AttaId",
                                                formatter: function (sAttaId) {
                                                    return !sAttaId ||
                                                        sAttaId.trim() === "";
                                                }
                                            }
                                        })
                                    ]
                                })
                            ]
                        });

                        oTable.unbindItems();

                        oTable.bindItems({
                            path: "PRResult>/results",
                            template: oTemplate
                        });

                        this._updatePaginationButtons();

                        this.calculateTotalNetValue();
                        this._updatePageNumbers();

                    }.bind(this),

                    error: function (oError) {

                        console.error(
                            "PRHeaderSet GET ERROR:",
                            oError
                        );

                        MessageBox.error(
                            "Error while fetching Purchase Requisitions."
                        );
                    }
                });
            },
            calculateTotalNetValue: function () {

                var oTable = this.byId("idTblRequisitions");
                var oBinding = oTable.getBinding("items");

                if (!oBinding) {
                    this.byId("idTotalNetValue").setNumber("0");
                    return;
                }

                var aContexts = oBinding.getContexts();
                var fTotal = 0;
                aContexts.forEach(function (oContext) {
                    if (oContext) {
                        var oData = oContext.getObject();
                        var fNetValue = parseFloat(oData.Netpr);

                        if (!isNaN(fNetValue)) {
                            fTotal += fNetValue;
                        }
                    }
                });

                this.byId("idTotalNetValue").setNumber(
                    fTotal.toFixed(2)
                );
            },


            onAttachmentPress: function (oEvent) {
                var oButton = oEvent.getSource();
                var oContext = oButton.getBindingContext("PRResult");

                if (!oContext) {
                    MessageBox.error("Unable to get purchase requisition details.");
                    return;
                }

                var oData = oContext.getObject();
                var sBanfn = oData.Banfn;
                var sBnfpo = oData.Bnfpo;
                var sAttaId = oData.AttaId;
                var sZfilename = oData.Zfilename;

                console.log("Banfn:", sBanfn);
                console.log("Bnfpo:", sBnfpo);
                console.log("AttaId:", sAttaId);
                console.log("AttaId:", sZfilename);

                if (!sBanfn || !sBnfpo || !sAttaId) {
                    MessageBox.error(
                        "Attachment information is missing."
                    );
                    return;
                }
                this._loadAttachments(
                    sBanfn,
                    sBnfpo,
                    sAttaId,
                    sZfilename
                );
            },

            _loadAttachments: function (sBanfn, sBnfpo, sAttaId, sZfilename) {

                var aAttaIds = (sAttaId || "")
                    .split(",")
                    .map(function (sValue) {
                        return sValue.trim();
                    })
                    .filter(function (sValue) {
                        return sValue;
                    });

                var aFilenames = (sZfilename || "")
                    .split(",")
                    .map(function (sValue) {
                        return sValue.trim();
                    })
                    .filter(function (sValue) {
                        return sValue;
                    });

                console.log("Attachment IDs:", aAttaIds);
                console.log("Attachment filenames:", aFilenames);

                if (!aAttaIds.length) {
                    MessageToast.show("No attachments found.");
                    return;
                }

                var oList = new sap.m.List({
                    mode: "None"
                });

                aAttaIds.forEach(function (sCurrentAttaId, iIndex) {
                    var sCurrentFilename = aFilenames[iIndex] || sCurrentAttaId;
                    var oItem = new sap.m.StandardListItem({
                        title: sCurrentFilename,      // Filename is only displayed to the user
                        icon: "sap-icon://attachment",
                        type: "Active"
                    });

                    oItem.attachPress(function () {
                        this._openAttachment(
                            sBanfn,
                            sBnfpo,
                            sCurrentAttaId,
                            sCurrentFilename
                        );

                    }.bind(this));
                    oList.addItem(oItem);

                }.bind(this));

                if (this._oAttachmentDialog) {
                    this._oAttachmentDialog.destroy();
                    this._oAttachmentDialog = null;
                }

                this._oAttachmentDialog = new sap.m.Dialog({
                    title: "Attachments",
                    contentWidth: "600px",
                    contentHeight: "400px",
                    stretchOnPhone: true,

                    content: [
                        oList
                    ],

                    beginButton: new sap.m.Button({
                        text: "Close",
                        press: function () {
                            this._oAttachmentDialog.close();
                        }.bind(this)
                    }),

                    afterClose: function () {

                        this._oAttachmentDialog.destroy();
                        this._oAttachmentDialog = null;

                    }.bind(this)
                });

                this.getView().addDependent(
                    this._oAttachmentDialog
                );

                this._oAttachmentDialog.open();
            },


            _openAttachment: function (sBanfn, sBnfpo, sAttaId, sZfilename) {
                var oModel = this.getOwnerComponent()
                    .getModel("Z_PR_APPROVAL_SRV");
                var sPath = oModel.createKey(
                    "/AttachmentSet",
                    {
                        Banfn: sBanfn,
                        Bnfpo: sBnfpo,
                        AttaId: sAttaId,
                        Zfilename: sZfilename
                    }
                );

                var sUrl = oModel.sServiceUrl + sPath + "/$value";
                console.log("Attachment URL:", sUrl);
                var sFileName = (sZfilename || "").toLowerCase();

                if (sFileName.endsWith(".txt")) {   // TXT PREVIEW

                    $.ajax({
                        url: sUrl,
                        method: "GET",

                        success: function (sData) {
                            if (this._oAttachmentViewer) {
                                this._oAttachmentViewer.destroy();
                                this._oAttachmentViewer = null;
                            }

                            this._oAttachmentViewer = new sap.m.Dialog({
                                title: sZfilename,
                                contentWidth: "900px",
                                contentHeight: "auto",
                                stretchOnPhone: true,

                                content: [
                                    new sap.m.TextArea({
                                        value: sData,
                                        editable: false,
                                        width: "100%",
                                        height: "100%",
                                        rows: 20
                                    })
                                ],

                                beginButton: new sap.m.Button({
                                    text: "Close",
                                    press: function () {
                                        this._oAttachmentViewer.close();
                                    }.bind(this)
                                }),

                                afterClose: function () {
                                    this._oAttachmentViewer.destroy();
                                    this._oAttachmentViewer = null;
                                }.bind(this)
                            });

                            this.getView().addDependent(
                                this._oAttachmentViewer
                            );

                            this._oAttachmentViewer.open();

                        }.bind(this),

                        error: function (oError) {

                            console.error("TXT Preview Error:", oError);
                            sap.m.MessageBox.error(
                                "Unable to preview attachment."
                            );
                        }
                    });

                    return;
                }

                else if (sFileName.endsWith(".pdf")) {
                    console.log("Requesting PDF:", sUrl);     // pdf //

                    fetch(sUrl, {
                        method: "GET",
                        credentials: "same-origin",
                        headers: {
                            "Accept": "application/pdf"
                        }
                    })
                        .then(function (oResponse) {

                            console.log("PDF Status:", oResponse.status);
                            console.log("PDF Content-Type:",
                                oResponse.headers.get("Content-Type"));
                            console.log("PDF Content-Disposition:",
                                oResponse.headers.get("Content-Disposition"));

                            if (!oResponse.ok) {
                                throw new Error(
                                    "PDF request failed: " + oResponse.status
                                );
                            }

                            return oResponse.blob();
                        })
                        .then(function (oBlob) {

                            console.log("PDF Blob size:", oBlob.size);
                            console.log("PDF Blob type:", oBlob.type);

                            if (!oBlob.size) {
                                throw new Error(
                                    "PDF response is empty (0 bytes)"
                                );
                            }

                            var oPDFBlob = new Blob(                    // Force correct MIME type
                                [oBlob],
                                {
                                    type: "application/pdf"
                                }
                            );

                            console.log("Final PDF size:", oPDFBlob.size);
                            var sPDFUrl = URL.createObjectURL(oPDFBlob);
                            console.log("PDF Blob URL:", sPDFUrl);

                            if (this._oAttachmentViewer) {
                                this._oAttachmentViewer.destroy();
                                this._oAttachmentViewer = null;
                            }

                            var oHTML = new sap.ui.core.HTML({
                                content:
                                    '<iframe ' +
                                    'src="' + sPDFUrl + '#zoom=100" ' +
                                    'style="width:850px;height:700px;border:none;display:block;margin:auto;" ' +
                                    'frameborder="0">' +
                                    '</iframe>'

                            });
                            this._oAttachmentViewer = new sap.m.Dialog({
                                title: sZfilename,
                                stretch: true,
                                contentWidth: "850px",
                                contentHeight: "700px",
                                draggable: true,
                                resizable: true,

                                content: [
                                    oHTML
                                ],

                                beginButton: new sap.m.Button({
                                    text: "Close",
                                    press: function () {
                                        this._oAttachmentViewer.close();
                                    }.bind(this)
                                }),

                                afterClose: function () {

                                    URL.revokeObjectURL(sPDFUrl);

                                    if (this._oAttachmentViewer) {
                                        this._oAttachmentViewer.destroy();
                                        this._oAttachmentViewer = null;
                                    }

                                }.bind(this)
                            });

                            this.getView().addDependent(
                                this._oAttachmentViewer
                            );

                            this._oAttachmentViewer.open();

                        }.bind(this))
                        .catch(function (oError) {

                            console.error("PDF Preview Error:", oError);

                            sap.m.MessageBox.error(
                                "Unable to preview PDF: " + oError.message
                            );
                        });

                    return;
                }

                if (
                    sFileName.endsWith(".png") ||
                    sFileName.endsWith(".jpg") ||                    // IMAGE PREVIEW
                    sFileName.endsWith(".jpeg")
                ) {

                    var oImage = new sap.m.Image({
                        src: sUrl,
                        width: "100%",
                        height: "100%",
                        densityAware: false
                    });

                    if (this._oAttachmentViewer) {
                        this._oAttachmentViewer.destroy();
                        this._oAttachmentViewer = null;
                    }

                    this._oAttachmentViewer = new sap.m.Dialog({
                        title: sZfilename,
                        contentWidth: "90%",
                        contentHeight: "90%",
                        stretch: true,

                        content: [
                            oImage
                        ],

                        beginButton: new sap.m.Button({
                            text: "Close",
                            press: function () {
                                this._oAttachmentViewer.close();
                            }.bind(this)
                        }),

                        afterClose: function () {

                            this._oAttachmentViewer.destroy();
                            this._oAttachmentViewer = null;

                        }.bind(this)
                    });

                    this.getView().addDependent(
                        this._oAttachmentViewer
                    );

                    this._oAttachmentViewer.open();

                    return;
                }

                var oHTML = new sap.ui.core.HTML({                      // OTHER FILE TYPES
                    content:
                        '<iframe ' +
                        'src="' + sUrl + '" ' +
                        'style="width:100%; height:100%; border:none;" ' +
                        'frameborder="0">' +
                        '</iframe>'
                });

                if (this._oAttachmentViewer) {
                    this._oAttachmentViewer.destroy();
                    this._oAttachmentViewer = null;
                }

                this._oAttachmentViewer = new sap.m.Dialog({
                    title: sZfilename,
                    contentWidth: "90%",
                    contentHeight: "90%",
                    stretch: true,

                    content: [
                        oHTML
                    ],

                    beginButton: new sap.m.Button({
                        text: "Close",
                        press: function () {
                            this._oAttachmentViewer.close();
                        }.bind(this)
                    }),

                    afterClose: function () {

                        this._oAttachmentViewer.destroy();
                        this._oAttachmentViewer = null;

                    }.bind(this)
                });

                this.getView().addDependent(
                    this._oAttachmentViewer
                );

                this._oAttachmentViewer.open();
            },

            onAdaptFilters: function () {

                var that = this;
                if (this._oAdaptFilterDialog) {
                    this._oAdaptFilterDialog.destroy();      // Destroy existing dialog if already open
                    this._oAdaptFilterDialog = null;
                }
                var oCheckPR = new CheckBox({
                    text: "Purchase Requisition",                 // Create checkboxes
                    selected: this.byId("idFilterPR").getVisible()
                });

                var oCheckPurchaseGroup = new CheckBox({
                    text: "Purchase Group",
                    selected: this.byId("idFilterPurchaseGroup").getVisible()
                });

                var oCheckReleaseGroup = new CheckBox({
                    text: "Release Group",
                    selected: this.byId("idFilterReleaseGroup").getVisible()
                });

                var oCheckReleaseCode = new CheckBox({
                    text: "Release Code",
                    selected: this.byId("idFilterReleaseCode").getVisible()
                });

                var oCheckPlant = new CheckBox({
                    text: "Plant",
                    selected: this.byId("idFilterPlant").getVisible()
                });

                var oCheckVendor = new CheckBox({
                    text: "Vendor",
                    selected: this.byId("idFilterVendor").getVisible()
                });

                var oVBox = new sap.m.VBox({                             // Container
                    class: "sapUiSmallMargin",
                    items: [
                        oCheckPR,
                        oCheckPurchaseGroup,
                        oCheckReleaseGroup,
                        oCheckReleaseCode,
                        oCheckPlant,
                        oCheckVendor
                    ]
                });

                this._oAdaptFilterDialog = new Dialog({
                    title: "Adapt Filters",
                    contentWidth: "400px",
                    content: [
                        oVBox
                    ],

                    beginButton: new Button({
                        text: "Apply",
                        type: "Emphasized",
                        press: function () {

                            that.byId("idFilterPR")
                                .setVisible(oCheckPR.getSelected());

                            that.byId("idFilterPurchaseGroup")
                                .setVisible(oCheckPurchaseGroup.getSelected());

                            that.byId("idFilterReleaseGroup")
                                .setVisible(oCheckReleaseGroup.getSelected());

                            that.byId("idFilterReleaseCode")
                                .setVisible(oCheckReleaseCode.getSelected());

                            that.byId("idFilterPlant")
                                .setVisible(oCheckPlant.getSelected());

                            that.byId("idFilterVendor")
                                .setVisible(oCheckVendor.getSelected());

                            that._oAdaptFilterDialog.close();
                        }
                    }),

                    endButton: new Button({
                        text: "Cancel",
                        press: function () {
                            that._oAdaptFilterDialog.close();
                        }
                    }),

                    afterClose: function () {
                        that._oAdaptFilterDialog.destroy();
                        that._oAdaptFilterDialog = null;
                    }
                });

                this.getView().addDependent(this._oAdaptFilterDialog);

                this._oAdaptFilterDialog.open();
            },

            onClearFilters: function () {

                this.byId("idPrNumber").removeAllSelectedItems();

                // Clear other MultiComboBoxes
                this.byId("idPurchaseGroup").removeAllSelectedItems();
                this.byId("idReleaseGroup").removeAllSelectedItems();
                this.byId("idReleaseCode").removeAllSelectedItems();
                this.byId("idPlant").removeAllSelectedItems();
                this.byId("idVendor").removeAllSelectedItems();

                var oTable = this.byId("idTblRequisitions");
                oTable.unbindItems();

                this.byId("idTotalNetValue").setNumber("0");
                this.byId("idBtnApprove").setEnabled(false);
                this.byId("idBtnReject").setEnabled(false);

                MessageToast.show("Filters cleared");
            },

            onSelectionChange: function () {
                var oTable = this.byId("idTblRequisitions");
                var aSelected = oTable.getSelectedContexts();
                this.byId("idBtnApprove").setEnabled(aSelected.length > 0);
                this.byId("idBtnReject").setEnabled(aSelected.length > 0);
            },
            _getUniquePRCount: function (aPRData) {

                var oUniquePRs = {};

                aPRData.forEach(function (oPR) {

                    var sPR = String(
                        oPR.Banfn || ""
                    ).trim();

                    if (sPR) {
                        oUniquePRs[sPR] = true;
                    }
                });

                return Object.keys(oUniquePRs).length;
            },
            formatVendor: function (sLifnr, sName) {
                if (sName) {
                    return sLifnr + " - " + sName;
                }

                return sLifnr || "";
            },

            onFirstPage: function () {
                this._currentPage = 0;

                this._loadPRPage();
            },
            onPreviousPage: function () {
                if (this._currentPage > 0) {

                    this._currentPage--;

                    this._loadPRPage();
                }
            },
            onNextPage: function () {

                var iLastPage = Math.ceil(
                    this._totalCount / this._pageSize
                ) - 1;

                if (this._currentPage < iLastPage) {

                    this._currentPage++;

                    this._loadPRPage();
                }
            },
            onLastPage: function () {
                if (this._totalCount > 0) {

                    this._currentPage = Math.ceil(
                        this._totalCount / this._pageSize
                    ) - 1;

                    this._loadPRPage();
                }
            },
            _updatePaginationButtons: function () {

                var oPrevious = this.byId("idBtnPrevious");
                var oNext = this.byId("idBtnNext");
                var oFirst = this.byId("idBtnFirst");
                var oLast = this.byId("idBtnLast");

                var iLastPage = Math.ceil(
                    this._totalCount / this._pageSize
                ) - 1;

                oPrevious.setEnabled(
                    this._currentPage > 0
                );

                oFirst.setEnabled(
                    this._currentPage > 0
                );

                oNext.setEnabled(
                    this._currentPage < iLastPage
                );

                oLast.setEnabled(
                    this._currentPage < iLastPage
                );
            },
            _updatePageNumbers: function () {

                var oPageNumbers = this.byId("idPageNumbers");

                // Remove existing buttons
                oPageNumbers.removeAllItems();

                var iTotalPages = Math.ceil(
                    this._totalCount / this._pageSize
                );

                var iCurrentPage = this._currentPage;

                // Current page
                var oCurrentButton = new sap.m.Button({
                    text: String(iCurrentPage + 1),
                    type: "Emphasized",
                    press: this.onPageNumberPress.bind(this)
                });

                oCurrentButton.data("pageIndex", iCurrentPage);

                oPageNumbers.addItem(oCurrentButton);

                // Next page
                if (iCurrentPage + 1 < iTotalPages) {

                    var oNextButton = new sap.m.Button({
                        text: String(iCurrentPage + 2),
                        type: "Default",
                        press: this.onPageNumberPress.bind(this)
                    });

                    oNextButton.data("pageIndex", iCurrentPage + 1);

                    oPageNumbers.addItem(oNextButton);
                }
            },
            onPageNumberPress: function (oEvent) {

                var oButton = oEvent.getSource();

                var iPageIndex = oButton.data("pageIndex");

                this._currentPage = iPageIndex;

                this._loadPRPage();
            },
            onApprove: function () {
                var oTable = this.byId("idTblRequisitions");
                var aSelectedContexts = oTable.getSelectedContexts("PRResult");
                if (!aSelectedContexts.length) {
                    MessageToast.show(
                        "Select at least one requisition to approve"
                    );
                    return;
                }
                var aSelectedData = aSelectedContexts.map(function (oContext) {
                    return oContext.getObject();
                });

                console.log("Selected PRs for approval:", aSelectedData);

                // SINGLE APPROVAL
                if (aSelectedData.length === 1) {
                    this._openApproveDialog(aSelectedData[0]);
                    return;
                }

                // BULK APPROVAL
                MessageBox.confirm("Approve " +
                    this._getUniquePRCount(aSelectedData) +
                    " selected purchase requisition(s)?",
                    {
                        title: "Confirm Approval",

                        onClose: function (sAction) {

                            if (sAction === MessageBox.Action.OK) {

                                this._openBulkApproveDialog(
                                    aSelectedData
                                );
                            }

                        }.bind(this)
                    }
                );
            },
            _openApproveDialog: function (oPRData) {
                var that = this;
                // Destroy previous dialog if any
                if (this._oApproveDialog) {
                    this._oApproveDialog.destroy();
                    this._oApproveDialog = null;
                }
                // var iUniquePRCount =
                //     this._getUniquePRCount(oPRData);
                var oNotesTextArea = new TextArea({
                    width: "100%",
                    rows: 6,
                    placeholder: "Enter notes (optional)"
                });

                var oContent = new sap.m.VBox({
                    width: "100%",
                    items: [

                        new sap.m.Text({
                            text: "Purchase Requisition: " +
                                (oPRData.Banfn || "")
                        }).addStyleClass("sapUiSmallMarginBottom"),

                        new sap.m.Text({
                            text: "Item: " +
                                (oPRData.Bnfpo || "")
                        }).addStyleClass("sapUiSmallMarginBottom"),

                        new sap.m.Label({
                            text: "Notes"
                        }),

                        oNotesTextArea
                    ]
                });

                this._oApproveDialog = new Dialog({
                    title: "Approve Purchase Requisition",
                    contentWidth: "500px",
                    stretchOnPhone: true,

                    content: [
                        oContent
                    ],

                    beginButton: new Button({
                        text: "Approve",
                        type: "Accept",

                        press: function () {

                            var sNotes =
                                oNotesTextArea.getValue().trim();

                            console.log("Approval notes:", sNotes);

                            that._oApproveDialog.close();

                            that._submitApproval(
                                [oPRData],
                                "A",
                                sNotes
                            );
                        }
                    }),

                    endButton: new Button({
                        text: "Cancel",

                        press: function () {
                            that._oApproveDialog.close();
                        }
                    }),

                    afterClose: function () {

                        that._oApproveDialog.destroy();
                        that._oApproveDialog = null;
                    }
                });

                this.getView().addDependent(
                    this._oApproveDialog
                );

                this._oApproveDialog.open();
            },
            _openBulkApproveDialog: function (aPRData) {

                var that = this;

                if (this._oBulkApproveDialog) {
                    this._oBulkApproveDialog.destroy();
                    this._oBulkApproveDialog = null;
                }

                var iUniquePRCount = this._getUniquePRCount(aPRData);

                var oNotesTextArea = new TextArea({
                    width: "100%",
                    rows: 6,
                    placeholder: "Enter notes (optional)"
                });

                var oContent = new sap.m.VBox({
                    width: "100%",
                    items: [

                        new sap.m.Text({
                            text: "Selected Purchase Requisitions: " +
                                iUniquePRCount
                        }).addStyleClass("sapUiSmallMarginBottom"),

                        new sap.m.Label({
                            text: "Notes"
                        }),

                        oNotesTextArea
                    ]
                });

                this._oBulkApproveDialog = new Dialog({

                    title: "Approve Purchase Requisitions",

                    contentWidth: "500px",

                    stretchOnPhone: true,

                    content: [
                        oContent
                    ],

                    beginButton: new Button({

                        text: "Approve",

                        type: "Accept",

                        press: function () {

                            var sNotes =
                                oNotesTextArea.getValue().trim();

                            console.log(
                                "Bulk approval notes:",
                                sNotes
                            );

                            that._oBulkApproveDialog.close();

                            that._submitApproval(
                                aPRData,
                                "A",
                                sNotes
                            );
                        }
                    }),

                    endButton: new Button({

                        text: "Cancel",

                        press: function () {
                            that._oBulkApproveDialog.close();
                        }
                    }),

                    afterClose: function () {

                        that._oBulkApproveDialog.destroy();
                        that._oBulkApproveDialog = null;
                    }
                });

                this.getView().addDependent(
                    this._oBulkApproveDialog
                );

                this._oBulkApproveDialog.open();
            },
            _submitApproval: function (aPRData, sRequestId, sMessage) {

                var oModel = this.getOwnerComponent()
                    .getModel("Z_PR_APPROVAL_SRV");

                if (!oModel) {
                    MessageBox.error(
                        "Z_PR_APPROVAL_SRV model is not available."
                    );
                    return;
                }

                var aReqItems = [];

                aPRData.forEach(function (oPR) {

                    var oItem = {
                        RequestId: sRequestId,
                        Banfn: oPR.Banfn || "",
                        Bnfpo: oPR.Bnfpo || "",
                        Frggr: oPR.Frggr || "",
                        Frgco: oPR.Frgco || "",
                        WiId: oPR.WiId || "",
                        Message: sMessage
                    };

                    aReqItems.push(oItem);
                });

                var oPayload = {
                    RequestId: sRequestId,
                    Req_Items: aReqItems
                };

                console.log(
                    "Approve POST Payload:",
                    JSON.stringify(oPayload, null, 2)
                );

                oModel.create(
                    "/DecisionReqSet",
                    oPayload,
                    {

                        success: function (oData) {

                            console.log(
                                "Approve POST SUCCESS:",
                                oData
                            );

                            this._processApprovalResponse(
                                oData,
                                aPRData,
                                sRequestId
                            );
                            this.onGoPress();

                        }.bind(this),

                        error: function (oError) {

                            console.error(
                                "========== APPROVAL ERROR =========="
                            );

                            console.error(
                                "Status Code:",
                                oError.statusCode
                            );

                            console.error(
                                "Status Text:",
                                oError.statusText
                            );

                            console.error(
                                "Response Text:",
                                oError.responseText
                            );

                            console.error(
                                "Error Object:",
                                oError
                            );

                            console.error(
                                "===================================="
                            );

                            var sMessage =
                                "Error while approving purchase requisition(s).";

                            if (
                                oError &&
                                oError.responseText
                            ) {

                                var sResponse =
                                    oError.responseText.trim();

                                /*
                                 * JSON ERROR
                                 */
                                if (
                                    sResponse.charAt(0) === "{"
                                ) {

                                    try {

                                        var oErrorData =
                                            JSON.parse(
                                                sResponse
                                            );

                                        if (
                                            oErrorData.error &&
                                            oErrorData.error.message
                                        ) {

                                            if (
                                                typeof oErrorData.error.message ===
                                                "string"
                                            ) {

                                                sMessage =
                                                    oErrorData.error.message;

                                            } else if (
                                                oErrorData.error.message.value
                                            ) {

                                                sMessage =
                                                    oErrorData.error.message.value;
                                            }
                                        }

                                    } catch (e) {

                                        console.error(
                                            "Unable to parse JSON backend error:",
                                            e
                                        );
                                    }
                                }

                                /*
                                 * XML ERROR
                                 */
                                else if (
                                    sResponse.charAt(0) === "<"
                                ) {

                                    try {

                                        var oParser =
                                            new DOMParser();

                                        var oXML =
                                            oParser.parseFromString(
                                                sResponse,
                                                "text/xml"
                                            );

                                        /*
                                         * Try <message>
                                         */
                                        var aMessages =
                                            oXML.getElementsByTagName(
                                                "message"
                                            );

                                        if (
                                            aMessages.length > 0 &&
                                            aMessages[0].textContent
                                        ) {

                                            sMessage =
                                                aMessages[0].textContent.trim();
                                        }

                                        /*
                                         * Try <errordetail>
                                         */
                                        else {

                                            var aErrorDetails =
                                                oXML.getElementsByTagName(
                                                    "errordetail"
                                                );

                                            if (
                                                aErrorDetails.length > 0 &&
                                                aErrorDetails[0].textContent
                                            ) {

                                                sMessage =
                                                    aErrorDetails[0].textContent.trim();
                                            }
                                        }

                                    } catch (e) {

                                        console.error(
                                            "Unable to parse XML backend error:",
                                            e
                                        );
                                    }
                                }
                            }

                            MessageBox.error(sMessage);
                        }
                    }
                );
            },
            _processApprovalResponse: function (oData, aPRData, sRequestId) {

                console.log(
                    "Backend approval response:",
                    oData
                );

                var aResults = [];

                if (
                    oData &&
                    oData.Req_Items &&
                    oData.Req_Items.results
                ) {

                    aResults = oData.Req_Items.results;

                } else if (
                    oData &&
                    oData.Req_Items
                ) {

                    aResults = oData.Req_Items;
                }

                console.log(
                    "Approval results:",
                    aResults
                );

                var aSuccess = [];
                var aErrors = [];

                aResults.forEach(function (oResult) {

                    if (
                        String(oResult.Status || "")
                            .toUpperCase() === "SUCCESS"
                    ) {

                        aSuccess.push(oResult);

                    } else {

                        aErrors.push(oResult);
                    }

                });
                var sActionText =
                    sRequestId === "R" ? "rejected" : "approved";
                console.log(
                    "Successfully approved:",
                    aSuccess
                );

                console.log(
                    "Approval errors:",
                    aErrors
                );

                /*
                 * REMOVE ONLY SUCCESSFULLY APPROVED PRs
                 */
                // if (aSuccess.length > 0) {

                //     this._removeApprovedPRsFromTable(
                //         aSuccess
                //     );
                // }

                if (
                    aSuccess.length > 0 &&
                    aErrors.length === 0
                ) {

                    // MessageBox.success(
                    //     aSuccess.length +
                    //     " purchase requisition(s) approved successfully."
                    // );
                    var sActionText =
                        sRequestId === "R" ? "rejected" : "approved";

                    // MessageBox.success(
                    //     aSuccess.length +
                    //     " purchase requisition(s) " +
                    //     sActionText +
                    //     " successfully."
                    // );

                    var iUniqueSuccessPRCount =
                        this._getUniquePRCount(aSuccess);

                    MessageBox.success(
                        iUniqueSuccessPRCount +
                        " purchase requisition(s) " +
                        sActionText +
                        " successfully."
                    );

                } else if (
                    aSuccess.length === 0 &&
                    aErrors.length > 0
                ) {

                    var sErrorMessage =
                        "The following purchase requisition(s) could not be " +
                        sActionText +
                        ":\n\n";
                    aErrors.forEach(function (oError) {

                        sErrorMessage +=
                            (oError.Banfn || "") +
                            "/" +
                            (oError.Bnfpo || "") +
                            ": " +
                            (oError.Message || "Approval failed") +
                            "\n";
                    });

                    MessageBox.error(
                        sErrorMessage
                    );

                } else if (
                    aSuccess.length > 0 &&
                    aErrors.length > 0
                ) {

                    // var sPartialMessage =
                    //     aSuccess.length +
                    //     " requisition(s) " +
                    //     sActionText +
                    //     " successfully.\n\n";

                    // sPartialMessage +=
                    //     aErrors.length +
                    //     " requisition(s) could not be " +
                    //     sActionText +
                    //     ":\n\n";
                    var iUniqueSuccessPRCount =
                        this._getUniquePRCount(aSuccess);

                    var iUniqueErrorPRCount =
                        this._getUniquePRCount(aErrors);

                    var sPartialMessage =
                        iUniqueSuccessPRCount +
                        " requisition(s) " +
                        sActionText +
                        " successfully.\n\n";

                    sPartialMessage +=
                        iUniqueErrorPRCount +
                        " requisition(s) could not be " +
                        sActionText +
                        ":\n\n";

                    aErrors.forEach(function (oError) {

                        sPartialMessage +=
                            (oError.Banfn || "") +
                            "/" +
                            (oError.Bnfpo || "") +
                            ": " +
                            (oError.Message || "Approval failed") +
                            "\n";
                    });

                    MessageBox.warning(
                        sPartialMessage
                    );
                }

            },
            // _removeApprovedPRsFromTable: function (aSuccessResults) {

            //     var oTable = this.byId("idTblRequisitions");
            //     var oPRResultModel = oTable.getModel("PRResult");

            //     if (!oPRResultModel) {
            //         return;
            //     }

            //     var aData = oPRResultModel.getProperty("/results") || [];

            //     // Create list of successfully approved PR + Item combinations
            //     var oApprovedMap = {};

            //     aSuccessResults.forEach(function (oResult) {

            //         var sKey =
            //             String(oResult.Banfn || "") +
            //             "_" +
            //             String(oResult.Bnfpo || "");

            //         oApprovedMap[sKey] = true;
            //     });

            //     // Keep only PRs which were NOT successfully approved
            //     var aRemainingData = aData.filter(function (oPR) {

            //         var sKey =
            //             String(oPR.Banfn || "") +
            //             "_" +
            //             String(oPR.Bnfpo || "");

            //         return !oApprovedMap[sKey];
            //     });

            //     // Update table model
            //     oPRResultModel.setProperty(
            //         "/results",
            //         aRemainingData
            //     );

            //     oPRResultModel.refresh(true);

            //     // Clear selection
            //     oTable.removeSelections(true);

            //     // Disable buttons
            //     this.byId("idBtnApprove").setEnabled(false);
            //     this.byId("idBtnReject").setEnabled(false);

            //     console.log(
            //         "Remaining PRs in table:",
            //         aRemainingData
            //     );
            // },

            onRequisitionLinkPress: function (oEvent) {
                var oContext =
                    oEvent
                        .getSource()
                        .getBindingContext(
                            "Z_PR_APPROVAL_SRV"
                        );


                if (!oContext) {
                    return;
                }


                var sReq =
                    oContext.getProperty(
                        "Banfn"
                    );


                MessageToast.show(
                    "Open requisition " + sReq
                );

            },

            onRequisitionPress: function (oEvent) {

                var oContext =
                    oEvent
                        .getSource()
                        .getBindingContext(
                            "Z_PR_APPROVAL_SRV"
                        );


                if (!oContext) {
                    return;
                }


                console.log(
                    "Selected PR:",
                    oContext.getObject()
                );
            },


            onReject: function () {

                var oTable = this.byId("idTblRequisitions");

                var aSelectedContexts =
                    oTable.getSelectedContexts("PRResult");

                if (!aSelectedContexts.length) {

                    MessageToast.show(
                        "Select at least one requisition to reject"
                    );

                    return;
                }

                var aSelectedData =
                    aSelectedContexts.map(function (oContext) {
                        return oContext.getObject();
                    });

                console.log(
                    "Selected PRs for rejection:",
                    aSelectedData
                );

                // SINGLE REJECTION
                if (aSelectedData.length === 1) {

                    this._openRejectDialog(
                        aSelectedData[0]
                    );

                    return;
                }

                // BULK REJECTION
                MessageBox.confirm(
                    "Reject " +
                    this._getUniquePRCount(aSelectedData) +
                    " selected purchase requisition(s)?",
                    {
                        title: "Confirm Rejection",

                        onClose: function (sAction) {

                            if (sAction === MessageBox.Action.OK) {

                                this._openBulkRejectDialog(
                                    aSelectedData
                                );
                            }

                        }.bind(this)
                    }
                );
            },
            _openRejectDialog: function (oPRData) {

                var that = this;

                if (this._oRejectDialog) {
                    this._oRejectDialog.destroy();
                    this._oRejectDialog = null;
                }

                // var iUniquePRCount =
                //     this._getUniquePRCount(aPRData);


                var oNotesTextArea = new TextArea({
                    width: "100%",
                    rows: 6,
                    placeholder: "Enter rejection reason",
                    valueState: "None"
                });

                var oContent = new sap.m.VBox({
                    width: "100%",
                    items: [

                        new sap.m.Text({
                            text: "Purchase Requisition: " +
                                (oPRData.Banfn || "")
                        }).addStyleClass("sapUiSmallMarginBottom"),

                        new sap.m.Text({
                            text: "Item: " +
                                (oPRData.Bnfpo || "")
                        }).addStyleClass("sapUiSmallMarginBottom"),

                        new sap.m.Label({
                            text: "Rejection Notes",
                            required: true
                        }),

                        oNotesTextArea
                    ]
                });

                this._oRejectDialog = new Dialog({

                    title: "Reject Purchase Requisition",

                    contentWidth: "500px",

                    stretchOnPhone: true,

                    content: [
                        oContent
                    ],

                    beginButton: new Button({

                        text: "Reject",

                        type: "Reject",

                        press: function () {

                            var sNotes =
                                oNotesTextArea.getValue().trim();

                            // Mandatory validation
                            if (!sNotes) {

                                oNotesTextArea.setValueState(
                                    "Error"
                                );
                                oNotesTextArea.setValueStateText(
                                    "Rejection notes are mandatory."
                                );

                                MessageToast.show(
                                    "Please enter rejection notes."
                                );

                                return;
                            }

                            console.log(
                                "Rejection notes:",
                                sNotes
                            );

                            that._oRejectDialog.close();

                            that._submitApproval(
                                [oPRData],
                                "R",
                                sNotes
                            );
                        }
                    }),

                    endButton: new Button({

                        text: "Cancel",

                        press: function () {
                            that._oRejectDialog.close();
                        }
                    }),

                    afterClose: function () {

                        that._oRejectDialog.destroy();
                        that._oRejectDialog = null;
                    }
                });

                this.getView().addDependent(
                    this._oRejectDialog
                );

                this._oRejectDialog.open();
            },
            _openBulkRejectDialog: function (aPRData) {

                var that = this;

                if (this._oBulkRejectDialog) {
                    this._oBulkRejectDialog.destroy();
                    this._oBulkRejectDialog = null;
                }

                var iUniquePRCount = this._getUniquePRCount(aPRData);

                var oNotesTextArea = new TextArea({
                    width: "100%",
                    rows: 6,
                    placeholder: "Enter rejection reason",
                    valueState: "None"
                });

                var oContent = new sap.m.VBox({
                    width: "100%",
                    items: [

                        new sap.m.Text({
                            text: "Selected Purchase Requisitions: " +
                                iUniquePRCount
                        }).addStyleClass("sapUiSmallMarginBottom"),

                        new sap.m.Label({
                            text: "Rejection Notes",
                            required: true
                        }),

                        oNotesTextArea
                    ]
                });

                this._oBulkRejectDialog = new Dialog({

                    title: "Reject Purchase Requisitions",

                    contentWidth: "500px",

                    stretchOnPhone: true,

                    content: [
                        oContent
                    ],

                    beginButton: new Button({

                        text: "Reject",

                        type: "Reject",

                        press: function () {

                            var sNotes =
                                oNotesTextArea.getValue().trim();

                            if (!sNotes) {

                                oNotesTextArea.setValueState(
                                    "Error"
                                );

                                oNotesTextArea.setValueStateText(
                                    "Rejection notes are mandatory."
                                );

                                MessageToast.show(
                                    "Please enter rejection notes."
                                );

                                return;
                            }

                            console.log(
                                "Bulk rejection notes:",
                                sNotes
                            );

                            that._oBulkRejectDialog.close();

                            that._submitApproval(
                                aPRData,
                                "R",
                                sNotes
                            );
                        }
                    }),

                    endButton: new Button({

                        text: "Cancel",

                        press: function () {
                            that._oBulkRejectDialog.close();
                        }
                    }),

                    afterClose: function () {

                        that._oBulkRejectDialog.destroy();
                        that._oBulkRejectDialog = null;
                    }
                });

                this.getView().addDependent(
                    this._oBulkRejectDialog
                );

                this._oBulkRejectDialog.open();
            },

        });
});