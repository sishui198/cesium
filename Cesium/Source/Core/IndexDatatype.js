/*global define*/
define(['./Enumeration'], function(Enumeration) {
    "use strict";

    /**
     * DOC_TBA
     *
     * @exports IndexDatatype
     */
    var IndexDatatype = {
        /**
         * DOC_TBA
         *
         * @constant
         * @type {Enumeration}
         */
        UNSIGNED_BYTE : new Enumeration(0x1401, "unsignedByte"), // UNSIGNED_BYTE
        /**
         * DOC_TBA
         *
         * @constant
         * @type {Enumeration}
         */
        UNSIGNED_SHORT : new Enumeration(0x1403, "unsignedShort") // UNSIGNED_SHORT
    };

    return IndexDatatype;
});
