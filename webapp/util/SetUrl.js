jQuery.sap.declare("invictusbs.ui5.inventory.stock.transfer.util.SetUrl");


invictusbs.ui5.inventory.stock.transfer.util.SetUrl = {

    setUrl :  function (sServiceUrl, string) {


      var location = ""; // localRemote
      var url = "";

      if (location == "local") {

        if (sServiceUrl == "defHome") {
                url = "http://localhost:8080/SAPUI5_JDG_INVENTORY_STOCKTRANSFER/";
              };

        if (sServiceUrl == "store") {
          url = "model/stores.json";
        };


        if (sServiceUrl == "article") {
                url = "model/articlelist.json";
              };

              if (sServiceUrl == "requisitionCr") {
                url = "model/articlelist.json";
              };


      };

      if (location == "localRemote") {


        if (sServiceUrl == "defHome") {
                url = "http://localhost:8080/SAPUI5_JDG_INVENTORY_STOCKTRANSFER/";
              };

                if (sServiceUrl == "store") {
                    url = "http://jdgsnwgdev00.jdg.co.za:8000/sap/opu/odata/sap/ZECC_INVENTORY_SRV/SupplySitesSet";
                };


                if (sServiceUrl == "article") {
                  url = "http://jdgsnwgdev00.jdg.co.za:8000/sap/opu/odata/sap/ZECC_ARTICLELIST_SRV_01";
              };

              if (sServiceUrl == "requisitionCr") {
                url = "http://jdgsnwgdev00.jdg.co.za:8000/sap/opu/odata/sap/ZECC_INVENTORY_SRV";
              };




        url = "proxy/" + url.replace("://", "/");




      };

      if (!location) {

        if (sServiceUrl == "defHome") {
                url = "/sap/bc/ui5_ui5/sap/zecc_store_sto";
              };

                if (sServiceUrl == "store") {
                    url = "/sap/opu/odata/sap/ZECC_INVENTORY_SRV/SupplySitesSet";
                };


                if (sServiceUrl == "article") {
                  url = "/sap/opu/odata/sap/ZECC_ARTICLELIST_SRV_01";
              };

              if (sServiceUrl == "requisitionCr") {
                url = "/sap/opu/odata/sap/ZECC_INVENTORY_SRV";
              };



      };

      return url;


    }
  };