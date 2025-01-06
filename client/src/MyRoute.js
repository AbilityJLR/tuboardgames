import { createBrowserRouter, Navigate } from "react-router-dom";
import Spyfall from "./games/pages/Spyfall"
import GameBrowse from "./games/pages/GameBrowse"
import Lobby from "./games/pages/Lobby";
import Victory from "./games/pages/Victory";
import Login from "./games/pages/Login"

const Router = createBrowserRouter([
  {
    path: `/gamesbrowse`,
    search: `?username=:username`,
    element: <GameBrowse />
  },
  {
    path: "/:gid/lobby",
    search: `?username=:username&room=:room`,
    element: <Lobby />
  },
  {
    path: "/spyfall",
    search: `?username=:username`,
    element: <Spyfall />
  },
  {
    path: "/victory",
    search: `?username=:username&room=:room`,
    element: <Victory />
  },
  {
    path: "/",
    element: <Login />
  },
  {
    path: "*",
    element: <Navigate to="/" replace={true} />
  }
])

export default Router
