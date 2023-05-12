/*
    Program: main.js
    Programmer: Olivia Escobar
    Date: April 14 2023
    Purpose: creating a Scene View map of Toronto Parks and benches using ArcGIS Maps SDK for JavaScript with custom
             client side feature layers and 3D widgets
*/


require(["esri/config"
    , "esri/Map"
    , "esri/views/SceneView"
    , "esri/layers/FeatureLayer"
    , "esri/symbols/WebStyleSymbol"
    , "esri/widgets/Daylight"
    , "esri/widgets/Home"
    , "esri/widgets/Legend"
    , "esri/widgets/BasemapToggle"
    , "esri/widgets/LineOfSight"
    , "esri/widgets/Attribution"
    , "esri/widgets/Expand"],
    function (esriConfig, Map, SceneView, FeatureLayer, WebStyleSymbol, Daylight, Home, Legend, BasemapToggle, LineOfSight, Attribution, Expand) {



        // API key from Esri's Developers account
        esriConfig.apiKey = "AAPKa72a68dbe3314f9ea01d5c61c7862f059pXSi8na5hbyGqL-eE9i9rEkKb1j3XWa0VNnQ6fMnvyUArMMm92ITs2VZqNieEYo";


        // define a 3D symbol for parks polygon layer
        const TorontoParksSymbol = {
            type: "polygon-3d",  // autocasts as new PolygonSymbol3D()
            symbolLayers: [{
                type: "fill",  // autocasts as new FillSymbol3DLayer()
                material: { color: "green" }
            }]
        };

        // create a renderer for TorontoParksSymbol
        const TorontoParksRenderer = {
            type: "simple",
            symbol: TorontoParksSymbol
        };

        // creating a popup template for parks polygon layer
        const TorontoParksPopupTemplate = {
            title: "Toronto Parks",
            content: [{
                type: "fields",
                fieldInfos: [{
                    fieldName: "FID",
                    label: "FID"
                }, {
                    fieldName: "FIELD_6",
                    label: "Area Class"
                }, {
                    fieldName: "FIELD_9",
                    label: "Area Name"
                }]
            }]
        }


        // define a WebStyleSymbol for Toronto Benches point layer
        const TorontoBenchesSymbol = new WebStyleSymbol({
            name: "Park_Bench_2",
            styleName: "EsriRealisticStreetSceneStyle"
        });


        // create a renderer for TorontoBenchesSymbol
        const TorontoBenchesRenderer = {
            type: "simple",
            symbol: TorontoBenchesSymbol
        };

        // add the Toronto Benches point layer as a feature layer
        let TorontoBenches = new FeatureLayer({
            url: "https://services7.arcgis.com/KE67pGGnh7x5qFyf/arcgis/rest/services/street_furniturebench_data_4326/FeatureServer/0https://services7.arcgis.com/KE67pGGnh7x5qFyf/arcgis/rest/services/street_furniturebench_data_4326/FeatureServer/0",
            title: "Toronto Benches",
            renderer: TorontoBenchesRenderer
        });

        // add the Toronto Parks polygon layer as a feature layer
        let TorontoParks = new FeatureLayer({
            url: "https://services7.arcgis.com/KE67pGGnh7x5qFyf/arcgis/rest/services/green_spaces_4326/FeatureServer/0",
            title: "Toronto Parks",
            renderer: TorontoParksRenderer,
            popupTemplate: TorontoParksPopupTemplate
        });

        // modify the 3D TorontoBenchesSymbol size and colour using the fetchSymbol() method
        TorontoBenchesSymbol.fetchSymbol()
            .then(function (Benches) {
                var objectSymbolLayer = Benches.symbolLayers.getItemAt(0); 
                objectSymbolLayer.material = { color: "brown" };
                objectSymbolLayer.height *= 20;
                objectSymbolLayer.width *= 20;
                objectSymbolLayer.depth *= 20;

                var TorontoRenderer = TorontoBenches.renderer.clone()
                TorontoRenderer.symbol = Benches;
                TorontoBenches.renderer = TorontoRenderer;
            });

        // create map and define properties
        const map = new Map({
            basemap: "arcgis-topographic",
            ground: "world-elevation",
            layers: [TorontoBenches, TorontoParks] 

        });

        // create view and define properties
        const view = new SceneView({
            map: map,
            center: [-79.383186, 43.653225], 
            zoom: 13, 
            container: "viewDiv",
            camera: {
                position: [
                    -79.39186,  
                    43.503225,   
                    14000       
                ],
                tilt: 50,
                heading: 0 
            }
        });

        // add basemap toggle widget
        let basemapToggle = new BasemapToggle({
            view: view,  
            nextBasemap: "hybrid"  
        });

        view.ui.add(basemapToggle, "top-right");

        // add daylight widget
        const daylightWidget = new Daylight({
            view: view
        });

        // make daylight widget expandable 
        const daylightWidgetExpand = new Expand({
            view: view,
            content: daylightWidget,
            expandTooltip: "daylight widget"
        });

        view.ui.add(daylightWidgetExpand, "top-right");

        // add home widget
        let homeWidget = new Home({
            view: view
        });

        view.ui.add(homeWidget, "top-left");

        // add legend widget
        let legend = new Legend({
            view: view
        });

        view.ui.add(legend, "bottom-right");


        // add line of sight widget
        const lineOfSight = new LineOfSight({
            view: view
        });

        // make line of sight widget expandable
        const LineofSightWidgetExpand = new Expand({
            view: view,
            content: lineOfSight,
            expandTooltip: "Line of Sight widget"
        });

        view.ui.add(LineofSightWidgetExpand, "top-right");


        // add an attribution widget
        const attribution = new Attribution({
            view: view
        });

        view.ui.add(attribution, "bottom-right");
    });

