import "./global.css";
import "./theme/theme.css";
import "./locales/i18n";
import ReactDOM from "react-dom/client";
//import { worker } from "./_mock";
//import menuService from "./api/services/menuService";
import { registerLocalIcons } from "./components/icon";
import AppRouter from "./routes/AppRouter";
//import { urlJoin } from "./utils";

await registerLocalIcons();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<AppRouter />);
