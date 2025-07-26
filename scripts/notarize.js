const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  console.log('Notarizing the app...');
  return await notarize({
    appBundleId: 'com.vijay.desktime', // Your appId from package.json
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,     // Set in terminal
    appleIdPassword: process.env.APPLE_ID_PASS, // Set in terminal
    teamId: process.env.APPLE_TEAM_ID, 
  });
};
