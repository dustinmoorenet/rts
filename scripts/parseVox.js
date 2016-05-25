const vox = require('vox.js');

function createMan() {
    const parser = new vox.Parser();

    parser.parse('src/assets/man/max.vox')
        .then((voxelData) => {
            console.log('voxelData', voxelData);
        })
        .catch((err) => {
            console.log('err', err);
        });
}

createMan();
