(function() {
    "use strict";
    /*global Cesium, describe, it, expect, beforeEach, afterEach*/
    
    describe("Polyline", function () {
    
        var context;
        var polyline;
        var us;
                
        beforeEach(function () {
            context = Cesium.Specs.createContext();
            polyline = new Cesium.Polyline();
            
            var camera = {
                eye    : new Cesium.Cartesian3(-1.0, 0.0, 0.0),
                target : Cesium.Cartesian3.getZero(),
                up     : Cesium.Cartesian3.getUnitZ()
            };
            us = context.getUniformState();
            us.setView(Cesium.Matrix4.createLookAt(camera.eye, camera.target, camera.up));
            us.setProjection(Cesium.Matrix4.createPerspectiveFieldOfView(Cesium.Math.toRadians(60.0), 1.0, 0.01, 10.0));        
        });
    
        afterEach(function () {
            polyline = polyline && polyline.destroy();
            us = null;
            
            Cesium.Specs.destroyContext(context);
        });
        
        it("gets default show", function() {
            expect(polyline.show).toBeTruthy();
        });
                
        it("sets positions", function() {
            var positions = [
                new Cesium.Cartesian3(1.0, 2.0, 3.0),
                new Cesium.Cartesian3(4.0, 5.0, 6.0)
            ];
            
            expect(polyline.getPositions()).not.toBeDefined();
            
            polyline.setPositions(positions);
            expect(polyline.getPositions()).toEqualArray(positions);
        });

        it("gets the default width", function() {
            expect(polyline.width).toEqual(2);
        });

        it("gets the default outline-width", function() {
            expect(polyline.outlineWidth).toEqual(5);
        });

        it("gets the default color", function() {
            expect(polyline.color).toEqualProperties({
                red   : 0.0,
                green : 0.0,
                blue  : 1.0,
                alpha : 1.0            
            });
        });

        it("gets the default outline-color", function() {
            expect(polyline.outlineColor).toEqualProperties({
                red   : 1.0,
                green : 1.0,
                blue  : 1.0,
                alpha : 1.0
            });
        });

        it("gets default bufferusage", function() {
            expect(polyline.bufferUsage).toEqualEnumeration(Cesium.BufferUsage.STATIC_DRAW);
        });

        it("updates", function() {
            polyline.update(context, Cesium.Specs.sceneState);
        });

        it("renders", function () {
            polyline.setPositions([
                new Cesium.Cartesian3(0.0, -1.0, 0.0),
                new Cesium.Cartesian3(0.0, 1.0, 0.0)    
            ]);
            
            polyline.color = { red : 1.0, green : 0.0, blue : 0.0, alpha : 1.0 };
            polyline.outlineColor = { red : 1.0, green : 0.0, blue : 0.0, alpha : 0.0 };
                
            context.clear();
            expect(context.readPixels()).toEqualArray([0, 0, 0, 0]);

            polyline.update(context, Cesium.Specs.sceneState);
            polyline.render(context, us);
            expect(context.readPixels()).not.toEqualArray([0, 0, 0, 0]);            
        });

        it("doesn't renders", function () {
            polyline.setPositions([
                new Cesium.Cartesian3(0.0, -1.0, 0.0),
                new Cesium.Cartesian3(0.0, 1.0, 0.0)    
            ]);
            
            polyline.color = { red : 1.0, green : 0.0, blue : 0.0, alpha : 1.0 };
            polyline.outlineColor = { red : 1.0, green : 0.0, blue : 0.0, alpha : 0.0 };
            polyline.show = false;
                
            context.clear();
            expect(context.readPixels()).toEqualArray([0, 0, 0, 0]);

            polyline.update(context, Cesium.Specs.sceneState);
            polyline.render(context, us);
            expect(context.readPixels()).toEqualArray([0, 0, 0, 0]);
        });
        
        it("is picked", function () {
            polyline.setPositions([
                new Cesium.Cartesian3(0.0, -1.0, 0.0),
                new Cesium.Cartesian3(0.0, 1.0, 0.0)    
            ]);

            polyline.update(context, Cesium.Specs.sceneState);

            var pickedObject = Cesium.Specs.pick(context, polyline, 0, 0);                        
            expect(pickedObject).toEqual(polyline);
        });

        it("is not picked", function () {
            polyline.setPositions([
                new Cesium.Cartesian3(0.0, -1.0, 0.0),
                new Cesium.Cartesian3(0.0, 1.0, 0.0)    
            ]);
            polyline.show = false;

            polyline.update(context, Cesium.Specs.sceneState);

            var pickedObject = Cesium.Specs.pick(context, polyline, 0, 0);                        
            expect(pickedObject).not.toBeDefined();
        });
    });
}());
