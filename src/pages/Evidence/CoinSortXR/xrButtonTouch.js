const MAX_TRACKING_GAP = 0.12;
const MAX_POKE_TRAVEL = 0.12;
const BACK_LIMIT = -0.025;
const idle = () => ({ pressed: false, activated: false, hovered: false });

/** Keep one state per fingertip/button pair; time is monotonic seconds. */
export function createButtonTouchState() {
  return { previous: null, previousTime: null, armed: false, latched: false };
}

/** Call after a button moves, tracking is lost, or an XR session is suspended. */
export function resetButtonTouch(state) {
  state.previous = null;
  state.previousTime = null;
  state.armed = false;
  state.latched = false;
}

/**
 * A physical front-face poke in button-local coordinates (+Z faces the user).
 * Observation of a released fingertip arms the button. Crossing its touch plane
 * activates once, with a separate withdrawal threshold to reject resting jitter.
 */
export function updateButtonTouch(state, {
  point, halfWidth, halfHeight, radius = 0.008, time, enabled = true,
} = {}) {
  if (!enabled || !point || ![point.x, point.y, point.z, time, halfWidth, halfHeight].every(Number.isFinite)
    || halfWidth <= 0 || halfHeight <= 0) {
    resetButtonTouch(state);
    return idle();
  }
  const fingertipRadius = Number.isFinite(radius) ? Math.min(0.02, Math.max(0.002, radius)) : 0.008;
  const touchZ = fingertipRadius + 0.002;
  const releaseZ = fingertipRadius + 0.016;
  // Do not enlarge XY bounds by the fingertip radius: neighbouring button hit
  // areas must remain disjoint even when a finger brushes between their edges.
  const inside = (candidate) => Math.abs(candidate.x) <= halfWidth && Math.abs(candidate.y) <= halfHeight;
  const inBounds = inside(point);
  const hovered = inBounds && point.z >= BACK_LIMIT && point.z <= releaseZ + 0.01;
  const previous = state.previous;
  const elapsed = state.previousTime === null ? null : time - state.previousTime;
  const travel = previous ? Math.hypot(point.x - previous.x, point.y - previous.y, point.z - previous.z) : Infinity;
  const continuous = previous && elapsed > 0 && elapsed <= MAX_TRACKING_GAP && travel <= MAX_POKE_TRAVEL;

  if (!continuous) {
    resetButtonTouch(state);
    // A first observation may arm a released front-facing finger, but it can
    // never activate from an initial intersection or a tracking teleport.
    state.armed = point.z > releaseZ;
    state.previous = { x: point.x, y: point.y, z: point.z };
    state.previousTime = time;
    return { pressed: false, activated: false, hovered };
  }

  let activated = false;
  if (state.armed && !state.latched && previous.z > touchZ && point.z <= touchZ) {
    // Intersect the short tracked motion segment with the front touch plane.
    // This also catches a fast normal poke whose endpoint passed the back face.
    const amount = (previous.z - touchZ) / (previous.z - point.z);
    const crossing = {
      x: previous.x + (point.x - previous.x) * amount,
      y: previous.y + (point.y - previous.y) * amount,
    };
    if (inside(crossing)) {
      activated = true;
      state.armed = false;
      state.latched = true;
    }
  }
  // Crossing behind the plane outside its face consumes the approach. Moving
  // sideways from there must not become a new tap on the back of the button.
  if (!activated) {
    if (point.z > releaseZ || !inBounds) {
      state.latched = false;
      state.armed = point.z > touchZ;
    } else if (point.z <= touchZ) state.armed = false;
  }

  state.previous = { x: point.x, y: point.y, z: point.z };
  state.previousTime = time;
  return {
    pressed: state.latched && inBounds && point.z >= BACK_LIMIT && point.z <= touchZ + 0.006,
    activated,
    hovered,
  };
}
