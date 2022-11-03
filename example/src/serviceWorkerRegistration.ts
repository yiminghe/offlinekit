import { registerSW } from "offlinekit/register";

const appVersion = process.env.REACT_APP_VERSION;

registerSW({
  url: "/service-worker.js",
  upgrade() {
    alert("有新版本，即将刷新页面");
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  },
  onNewAppVersion: async ({ newAppVersion }) => {
    const result = window.confirm(
      `有升级新版本: ${appVersion} -> ${newAppVersion}，是否刷新页面?`
    );
    return result;
  },
  checkUpdateInterval: 1000,
});
