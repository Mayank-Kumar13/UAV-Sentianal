// =============================================
// InputHandler — Keyboard Input Manager
// =============================================

export function createInputHandler() {
  const keys = {};
  let initialized = false;
  let refuelRequested = false;

  function onKeyDown(e) {
    // Intercept Ctrl+F for refuel shortcut
    if (e.ctrlKey && e.code === 'KeyF') {
      e.preventDefault();
      refuelRequested = true;
      return;
    }

    keys[e.code] = true;

    // Prevent arrow keys from scrolling the page
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
  }

  function onKeyUp(e) {
    keys[e.code] = false;
  }

  function init() {
    if (initialized) return;
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    initialized = true;
  }

  function destroy() {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    initialized = false;
  }

  function isPressed(code) {
    return !!keys[code];
  }

  /**
   * Returns normalized input values for the physics engine.
   * All values smoothly mapped to [-1, 1] or [0, 1] ranges.
   */
  function getInputs() {
    // Throttle: W increases, S decreases (returned as delta direction)
    const throttleUp = isPressed('KeyW') ? 1 : 0;
    const throttleDown = isPressed('KeyS') ? 1 : 0;

    // Roll: A left, D right
    const rollLeft = isPressed('KeyD') ? 1 : 0;
    const rollRight = isPressed('KeyA') ? 1 : 0;

    // Pitch: ArrowUp = pitch up (nose up), ArrowDown = pitch down
    const pitchUp = isPressed('ArrowUp') ? 1 : 0;
    const pitchDown = isPressed('ArrowDown') ? 1 : 0;

    // Brake
    const brake = isPressed('Space');

    const refuel = refuelRequested;
    refuelRequested = false; // Reset after reading

    return {
      throttleDelta: throttleUp - throttleDown,  // -1, 0, or 1
      rollInput: rollRight - rollLeft,            // -1, 0, or 1
      pitchInput: pitchUp - pitchDown,            // -1 (down), 0, or 1 (up)
      brake,
      refuel,
    };
  }

  return {
    init,
    destroy,
    isPressed,
    getInputs,
  };
}
