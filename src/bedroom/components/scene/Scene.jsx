import useBedroomStore from "../../store/useBedroomStore";
import Room from "../room/Room";
import Furniture from "../room/Furniture";
import Guide from "../guide/Guide";
import Clickable from "./Clickable";
import Laptop from "../items/Laptop";
import Badges from "../items/Badges";
import ShelfDecor from "../items/ShelfDecor";
import WorldMap from "../items/WorldMap";
import Handheld from "../items/Handheld";
import BedsideLamp from "../items/BedsideLamp";
import DeskLamp from "../items/DeskLamp";
import Papers from "../items/Papers";
import Phone from "../items/Phone";
import Posters from "../items/Posters";
import { DESK_LAMP_SPOT, LAMP_SPOT, SHELF_SPOT } from "../../data/items";
import { isDrag } from "../../utils/pointer";

// Clicking the room itself (not an item) while something is focused closes it.
const handleBackgroundClick = (e) => {
  if (isDrag(e)) return;
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
      <group position={DESK_LAMP_SPOT.position} rotation={DESK_LAMP_SPOT.rotation}>
        <DeskLamp />
      </group>
      <group position={SHELF_SPOT.position} rotation={SHELF_SPOT.rotation}>
        <ShelfDecor />
      </group>
    </group>

    <Guide />

    <Clickable id="map"><WorldMap /></Clickable>
    <Clickable id="computer"><Laptop /></Clickable>
    <Clickable id="experience"><Badges /></Clickable>
    <Clickable id="tech"><Handheld /></Clickable>
    <Clickable id="cv"><Papers /></Clickable>
    <Clickable id="phone"><Phone /></Clickable>
    <Clickable id="projects"><Posters /></Clickable>
  </>
);

export default Scene;
