const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

config.resolver.sourceExts.push('cjs')

// Firebase packages ship both ESM and CJS builds. When firebaseConfig.js
// uses ESM `import` syntax, Metro adds the "import" condition and resolves
// @firebase/app to its ESM build. But @firebase/auth's CJS code adds the
// "require" condition and gets the CJS build. Two different module instances
// means two separate component registries → "Component auth has not been
// registered yet". Force all @firebase/* to always use their CJS builds.
const firebaseCjsMap = {
  '@firebase/app':       'dist/index.cjs.js',
  '@firebase/component': 'dist/index.cjs.js',
  '@firebase/util':      'dist/index.cjs.js',
  '@firebase/logger':    'dist/index.cjs.js',
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const cjsFile = firebaseCjsMap[moduleName]
  if (cjsFile) {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'node_modules', moduleName, cjsFile),
    }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
