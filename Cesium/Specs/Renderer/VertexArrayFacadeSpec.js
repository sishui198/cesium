(function() {
    "use strict";
    /*global Cesium, describe, it, expect, beforeEach, afterEach*/

    describe("VertexArrayFacade", function () {
        var context;

        beforeEach(function () {
            context = Cesium.Specs.createContext();
        });

        afterEach(function () {
            Cesium.Specs.destroyContext(context);
        });

        it("creates a vertex array with static floats", function () {
            var positionIndex = 0;
            var vaf = new Cesium.VertexArrayFacade(context, [{
                    index                  : positionIndex,
                    componentsPerAttribute : 3,
                    componentDatatype      : Cesium.ComponentDatatype.FLOAT,
                    usage                  : Cesium.BufferUsage.STATIC_DRAW
                }], 1);

            var writer = vaf.writers[positionIndex];
            expect(writer).toBeDefined();

            writer(0, 1.0, 2.0, 3.0);   // Write [1.0, 2.0, 3.0] at index zero.
            vaf.commit();               // Commit writes

            expect(vaf.va[0].va.getAttribute(0).vertexBuffer).toBeDefined();
            expect(vaf.va[0].va.getAttribute(0).vertexBuffer.getSizeInBytes()).toEqual(1 * 3 * 4);
            expect(vaf.va[0].va.getAttribute(0).vertexBuffer.getUsage()).toEqualEnumeration(Cesium.BufferUsage.STATIC_DRAW);
            expect(vaf.va[0].va.getAttribute(0).componentsPerAttribute).toEqual(3);
            expect(vaf.va[0].va.getAttribute(0).componentDatatype).toEqualEnumeration(Cesium.ComponentDatatype.FLOAT);
            expect(vaf.va[0].va.getAttribute(0).offsetInBytes).toEqual(0);
            expect(vaf.va[0].va.getAttribute(0).strideInBytes).toEqual(3 * 4);
        });

        it("resizes a vertex array with static floats", function () {
            var positionIndex = 0;
            var vaf = new Cesium.VertexArrayFacade(context, [{
                    index                  : positionIndex,
                    componentsPerAttribute : 3,
                    componentDatatype      : Cesium.ComponentDatatype.FLOAT,
                    usage                  : Cesium.BufferUsage.STATIC_DRAW
                }], 1);

            var writer = vaf.writers[positionIndex];
            expect(writer).toBeDefined();

            writer(0, 1.0, 2.0, 3.0);   // Write [1.0, 2.0, 3.0] at index zero.

            vaf.resize(2);              // Two vertices
            writer(1, 1.0, 2.0, 3.0);   // Write [4.0, 5.0, 6.0] at index one.
            vaf.commit();               // Commit writes

            expect(vaf.va[0].va.getAttribute(0).vertexBuffer).toBeDefined();
            expect(vaf.va[0].va.getAttribute(0).vertexBuffer.getSizeInBytes()).toEqual(2 * 3 * 4);
            expect(vaf.va[0].va.getAttribute(0).vertexBuffer.getUsage()).toEqualEnumeration(Cesium.BufferUsage.STATIC_DRAW);
            expect(vaf.va[0].va.getAttribute(0).componentsPerAttribute).toEqual(3);
            expect(vaf.va[0].va.getAttribute(0).componentDatatype).toEqualEnumeration(Cesium.ComponentDatatype.FLOAT);
            expect(vaf.va[0].va.getAttribute(0).offsetInBytes).toEqual(0);
            expect(vaf.va[0].va.getAttribute(0).strideInBytes).toEqual(3 * 4);
        });

        it("creates a vertex array with static floats and unsigned bytes", function () {
            var positionIndex = 0;
            var colorIndex = 2;
            var vaf = new Cesium.VertexArrayFacade(context, [
                {
                    index                  : positionIndex,
                    componentsPerAttribute : 3,
                    componentDatatype      : Cesium.ComponentDatatype.FLOAT,
                    usage                  : Cesium.BufferUsage.STATIC_DRAW
                },
                {
                    index                  : colorIndex,
                    componentsPerAttribute : 4,
                    componentDatatype      : Cesium.ComponentDatatype.UNSIGNED_BYTE,
                    usage                  : Cesium.BufferUsage.STATIC_DRAW
                }
            ], 1);

            var positionWriter = vaf.writers[positionIndex];
            var colorWriter = vaf.writers[colorIndex];

            expect(positionWriter).toBeDefined();
            expect(colorWriter).toBeDefined();

            positionWriter(0, 1.0, 2.0, 3.0);   // Write position [1.0, 2.0, 3.0] at index zero.
            colorWriter(0, 0, 255, 0, 255);     // Write color [0, 255, 0, 255] at index zero.
            vaf.commit();                       // Commit writes

            // Position attribute
            expect(vaf.va[0].va.getAttribute(0).vertexBuffer).toBeDefined();
            expect(vaf.va[0].va.getAttribute(0).vertexBuffer.getSizeInBytes()).toEqual(1 * ((3 * 4) + (4 * 1)));
            expect(vaf.va[0].va.getAttribute(0).vertexBuffer.getUsage()).toEqualEnumeration(Cesium.BufferUsage.STATIC_DRAW);
            expect(vaf.va[0].va.getAttribute(0).componentsPerAttribute).toEqual(3);
            expect(vaf.va[0].va.getAttribute(0).componentDatatype).toEqualEnumeration(Cesium.ComponentDatatype.FLOAT);
            expect(vaf.va[0].va.getAttribute(0).offsetInBytes).toEqual(0);
            expect(vaf.va[0].va.getAttribute(0).strideInBytes).toEqual((3 * 4) + (4 * 1));

            // Color attribute
            expect(vaf.va[0].va.getAttribute(1).vertexBuffer).toEqual(vaf.va[0].va.getAttribute(0).vertexBuffer);
            expect(vaf.va[0].va.getAttribute(1).componentsPerAttribute).toEqual(4);
            expect(vaf.va[0].va.getAttribute(1).componentDatatype).toEqualEnumeration(Cesium.ComponentDatatype.UNSIGNED_BYTE);
            expect(vaf.va[0].va.getAttribute(1).offsetInBytes).toEqual(3 * 4);
            expect(vaf.va[0].va.getAttribute(1).strideInBytes).toEqual(vaf.va[0].va.getAttribute(0).strideInBytes);
        });

        it("creates a vertex array with static and dynamic attributes", function () {
            var positionIndex = 0;
            var txCoordIndex = 2;
            var vaf = new Cesium.VertexArrayFacade(context, [
                {
                    index                  : positionIndex,
                    componentsPerAttribute : 3,
                    componentDatatype      : Cesium.ComponentDatatype.FLOAT,
                    usage                  : Cesium.BufferUsage.STATIC_DRAW
                },
                {
                    index                  : txCoordIndex,
                    componentsPerAttribute : 2,
                    componentDatatype      : Cesium.ComponentDatatype.UNSIGNED_SHORT,
                    usage                  : Cesium.BufferUsage.DYNAMIC_DRAW,
                    normalize              : true
                }
            ], 1);

            var positionWriter = vaf.writers[positionIndex];
            var txCoordWriter = vaf.writers[txCoordIndex];

            expect(positionWriter).toBeDefined();
            expect(txCoordWriter).toBeDefined();

            positionWriter(0, 1.0, 2.0, 3.0);
            txCoordWriter(0, 32 * 1024, 64 * 1024);
            vaf.commit();

            // Position attribute
            expect(vaf.va[0].va.getAttribute(0).vertexBuffer).toBeDefined();
            expect(vaf.va[0].va.getAttribute(0).vertexBuffer.getSizeInBytes()).toEqual(1 * (3 * 4));
            expect(vaf.va[0].va.getAttribute(0).vertexBuffer.getUsage()).toEqualEnumeration(Cesium.BufferUsage.STATIC_DRAW);
            expect(vaf.va[0].va.getAttribute(0).componentsPerAttribute).toEqual(3);
            expect(vaf.va[0].va.getAttribute(0).componentDatatype).toEqualEnumeration(Cesium.ComponentDatatype.FLOAT);
            expect(vaf.va[0].va.getAttribute(0).offsetInBytes).toEqual(0);
            expect(vaf.va[0].va.getAttribute(0).strideInBytes).toEqual(3 * 4);

            // Texture coordinate attribute
            expect(vaf.va[0].va.getAttribute(1).vertexBuffer).toBeDefined();
            expect(vaf.va[0].va.getAttribute(1).vertexBuffer.getSizeInBytes()).toEqual(1 * (2 * 2));
            expect(vaf.va[0].va.getAttribute(1).vertexBuffer.getUsage()).toEqualEnumeration(Cesium.BufferUsage.DYNAMIC_DRAW);
            expect(vaf.va[0].va.getAttribute(1).componentsPerAttribute).toEqual(2);
            expect(vaf.va[0].va.getAttribute(1).componentDatatype).toEqualEnumeration(Cesium.ComponentDatatype.UNSIGNED_SHORT);
            expect(vaf.va[0].va.getAttribute(1).offsetInBytes).toEqual(0);
            expect(vaf.va[0].va.getAttribute(1).strideInBytes).toEqual(2 * 2);
        });

        it("sub-commits", function () {
            var positionIndex = 0;
            var temperatureIndex = 2;
            var vaf = new Cesium.VertexArrayFacade(context, [
                {
                    index                  : positionIndex,
                    componentsPerAttribute : 3,
                    componentDatatype      : Cesium.ComponentDatatype.FLOAT,
                    usage                  : Cesium.BufferUsage.STATIC_DRAW
                },
                {
                    index                  : temperatureIndex,
                    componentsPerAttribute : 1,
                    componentDatatype      : Cesium.ComponentDatatype.FLOAT,
                    usage                  : Cesium.BufferUsage.STREAM_DRAW
                }
            ], 2);

            var positionWriter = vaf.writers[positionIndex];
            var temperatureWriter = vaf.writers[temperatureIndex];

            expect(positionWriter).toBeDefined();
            expect(temperatureWriter).toBeDefined();

            positionWriter(0, 1.0, 2.0, 3.0);
            temperatureWriter(0, 98.6);
            positionWriter(1, 7.0, 8.0, 9.0);
            temperatureWriter(1, 32.0);
            vaf.commit();

            // Rewrite all vertices
            positionWriter(0, 10.0, 20.0, 30.0);
            temperatureWriter(0, 37.0);
            positionWriter(1, 70.0, 80.0, 90.0);
            temperatureWriter(1, 0.0);
            vaf.commit();

            // Sub-commit to just one vertex
            temperatureWriter(1, 212.0);
            vaf.subCommit(1, 1);
            vaf.endSubCommits();

            // Position attribute
            expect(vaf.va[0].va.getAttribute(0).vertexBuffer).toBeDefined();
            expect(vaf.va[0].va.getAttribute(0).vertexBuffer.getSizeInBytes()).toEqual(2 * (3 * 4));
            expect(vaf.va[0].va.getAttribute(0).vertexBuffer.getUsage()).toEqualEnumeration(Cesium.BufferUsage.STATIC_DRAW);
            expect(vaf.va[0].va.getAttribute(0).componentsPerAttribute).toEqual(3);
            expect(vaf.va[0].va.getAttribute(0).componentDatatype).toEqualEnumeration(Cesium.ComponentDatatype.FLOAT);
            expect(vaf.va[0].va.getAttribute(0).offsetInBytes).toEqual(0);
            expect(vaf.va[0].va.getAttribute(0).strideInBytes).toEqual(3 * 4);

            // Temperature attribute
            expect(vaf.va[0].va.getAttribute(1).vertexBuffer).toBeDefined();
            expect(vaf.va[0].va.getAttribute(1).vertexBuffer.getSizeInBytes()).toEqual(2 * 4);
            expect(vaf.va[0].va.getAttribute(1).vertexBuffer.getUsage()).toEqualEnumeration(Cesium.BufferUsage.STREAM_DRAW);
            expect(vaf.va[0].va.getAttribute(1).componentsPerAttribute).toEqual(1);
            expect(vaf.va[0].va.getAttribute(1).componentDatatype).toEqualEnumeration(Cesium.ComponentDatatype.FLOAT);
            expect(vaf.va[0].va.getAttribute(1).offsetInBytes).toEqual(0);
            expect(vaf.va[0].va.getAttribute(1).strideInBytes).toEqual(1 * 4);
        });

        it("throws when constructed without a context", function() {
            expect(function() {
                return new Cesium.VertexArrayFacade(undefined, undefined, undefined);
            }).toThrow();
        });

        it("throws when constructed undefined attributes", function() {
            expect(function() {
                return new Cesium.VertexArrayFacade(context, undefined, undefined);
            }).toThrow();
        });

        it("throws when constructed without attributes", function() {
            expect(function() {
                return new Cesium.VertexArrayFacade(context, []);
            }).toThrow();
        });

        it("throws when constructed with attributes without componentsPerAttribute", function() {
            expect(function() {
                return new Cesium.VertexArrayFacade(context, [{}]);
            }).toThrow();
        });

        it("throws when constructed with attributes with an invalid componentDatatype", function() {
            expect(function() {
                return new Cesium.VertexArrayFacade(context, [{
                    componentsPerAttribute : 1,
                    componentDatatype : "invalid component datatype"
                }]);
            }).toThrow();
        });

        it("throws when constructed with attributes with an invalid usage", function() {
            expect(function() {
                return new Cesium.VertexArrayFacade(context, [{
                    componentsPerAttribute : 1,
                    usage : "invalid component usage"
                }]);
            }).toThrow();
        });

        it("throws when constructed with attributes with duplicate indices", function() {
            expect(function() {
                return new Cesium.VertexArrayFacade(context, [
                    {
                        index : 0,
                        componentsPerAttribute : 1
                    },
                    {
                        index : 0,
                        componentsPerAttribute : 1
                    }
                ]);
            }).toThrow();
        });
    });

}());