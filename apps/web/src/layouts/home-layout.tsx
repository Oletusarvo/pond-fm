import { Outlet } from "react-router-dom";
import { HomeScreen } from "../screens/home-screen";

/**Renders the layout of the home-screen. */
export function HomeLayout() {
  return (
    <>
      <HomeScreen />
      <Outlet />
    </>
  );
}
