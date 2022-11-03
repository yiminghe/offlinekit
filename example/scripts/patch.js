const fs = require('fs');

{
  const filepath = require.resolve('babel-preset-react-app/create.js');
  let config = fs.readFileSync(filepath, 'utf-8');
  if (config.indexOf('babel-plugin-transform-typescript-metadata') === -1) {
    config = config.replace(
      `require('@babel/plugin-proposal-nullish-coalescing-operator').default,`,
      `
    require('@babel/plugin-proposal-nullish-coalescing-operator').default,
    require('babel-plugin-transform-typescript-metadata').default,
    `,
    );
    fs.writeFileSync(filepath, config);
    console.log('babel patched');
  }
}
