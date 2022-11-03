import { AppModule } from "./app.module";
import { NestFactory } from "nest-web/core";
import { RenderService } from "./render.service";

async function init() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const renderService = app.get(RenderService);
  renderService.render();

  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    import("./serviceWorkerRegistration");
  }
}
init();
