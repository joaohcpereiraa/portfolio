import useBedroomStore from "./useBedroomStore";

// Whether item `index` of the open `focusId` group (posters, badges) is the
// one taken out of the scene.
export const isTaken = (focusId, index) => {
  const { focused, takenIndex } = useBedroomStore.getState();
  return focused === focusId && takenIndex === index;
};
