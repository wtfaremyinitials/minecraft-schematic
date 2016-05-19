minecraft-schematic
===

Read and write Minecraft schematic files.

Usage
===

```js
var fs = require('fs');
var Schematic = require('minecraft-schematic');

var data = fs.readFileSync('./myawesomehouse.schematic');

Schematic.loadSchematic(data, function(error, build) {
	    if (error) throw error;
	build.getWidth();    // 10
	build.getLength();   // 12
	build.getHeight();   // 8
	build.getBlockID(0, 0, 0); // 1
	build.getBlockMeta(0, 0, 0); // 0
	build.setBlockID(3, 3, 3, 5);
	build.setBlockMeta(3, 3, 3, 2);
});
```

License
===

MIT.
