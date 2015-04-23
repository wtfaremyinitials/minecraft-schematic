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

            var length = tag.Schematic.Length;
            var width  = tag.Schematic.Width;
            var height = tag.Schematic.Height;

            var s = new Schematic(length, width, height);

            (function() {
                this.blockData = tag.Schematic.Blocks;
                this.blockMeta = tag.Schematic.Data;
            }).call(s);

            cb(undefined, s);
        });
    };
}

module.exports = Schematic;
