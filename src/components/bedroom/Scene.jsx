import useBedroomStore from "#store/bedroom";
import Room from "./Room";
import Furniture from "./Furniture";
import Guide from "./guide/Guide";
import Clickable from "./Clickable";
import Laptop from "./Laptop";
import CorkBoard from "./items/CorkBoard";
import ShelfDecor from "./items/ShelfDecor";
import WorldMap from "./items/WorldMap";
import Handheld from "./items/Handheld";
import BedsideLamp from "./items/BedsideLamp";
import Papers from "./items/Papers";
import Phone from "./items/Phone";
import Posters from "./items/Posters";
import { LAMP_SPOT, SHELF_SPOT } from "./items";

// Clicking the room itself (not an item) while something is focused closes it.
const handleBackgroundClick = (e) => {
  if (e.delta > 6) return;
  const { focused, requestClose } = useBedroomStore.getState();
  if (focused) requestClose();
};

const Scene = () => (
  <>
    <group onClick={handleBackgroundClick}>
      <Room />
      <Furniture />
      <group position={LAMP_SPOT.position} rotation={LAMP_SPOT.rotation}>
        <BedsideLamp />
      </group>
      <group position={SHELF_SPOT.position} rotation={SHELF_SPOT.rotation}>
        <ShelfDecor />
      </group>
    </group>

    <Guide />

    <Clickable id="map"><WorldMap /></Clickable>
    <Clickable id="computer"><Laptop /></Clickable>
    <Clickable id="timeline"><CorkBoard /></Clickable>
    <Clickable id="tech"><Handheld /></Clickable>
    <Clickable id="cv"><Papers /></Clickable>
    <Clickable id="phone"><Phone /></Clickable>
    <Clickable id="projects"><Posters /></Clickable>
  </>
);

export default Scene;
