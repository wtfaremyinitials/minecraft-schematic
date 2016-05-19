var nbt = require('prismarine-nbt');

// TODO: Support WorldEdit origin and offset tags
// TODO: Entities?

class Schematic {

    constructor(x, y, z) {
        this.blockData = new Buffer(x * y * z);
        this.blockData.fill(0);
        this.blockMeta = new Buffer(x * y * z);
        this.blockMeta.fill(0);

        this.length = x;
        this.width  = z;
        this.height = y;
    }

    getWidth() {
        return this.width;
    }

    getLength() {
        return this.length;
    }

    getHeight() {
        return this.height;
    }

    getBlockID(x, y, z) {
        return this.blockData[y * this.width * this.length + z * this.width + x];
    }

    getBlockMeta(x, y, z) {
        // (Y×length + Z) × width + X
        return this.blockMeta[y * this.width * this.length + z * this.width + x];
    }

    setBlockID(x, y, z, id) {
        this.blockData[y * this.width * this.length + z * this.width + x] = id;
    }

    setBlockMeta(x, y, z, meta) {
        this.blockMeta[y * this.width * this.length + z * this.width + x] = meta;
    }

    dump() {
        return nbt.writeUncompressed({ root: 'Schematic', value: {
            'Length': {
                type: 'short',
                value: this.length
            },
            'Width': {
                type: 'short',
                value: this.width
            },
            'Height': {
                type: 'short',
                value: this.height
            },
            'Blocks': {
                type: 'byteArray',
                value: this.blockData
            },
            'Data': {
                type: 'byteArray',
                value: this.blockMeta
            }
        }});
    }

    static loadSchematic(data, cb) {
        nbt.parse(data, function(err, tag) {
            if(err) {
                cb(err);
                return;
            }

            var length = tag.value.value.Length.value;
            var width = tag.value.value.Width.value;
            var height = tag.value.value.Height.value;

            var s = new Schematic(length, width, height);

            (function() {
                this.blockData = tag.value.value.Blocks.value;
                this.blockMeta = tag.value.value.Data.value;
            }).call(s);

            cb(undefined, s);
        });
    };
}

module.exports = Schematic;
