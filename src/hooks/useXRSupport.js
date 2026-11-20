import { useEffect, useState } from 'react';

// Capability is checked without opening a session or prompting for permission.
// Headset wear cannot be established from a normal browser page.
export function useXRSupport(enabled = true) {
  const [state, setState] = useState({ supported: false, checking: enabled, reason: '' });

  useEffect(() => {
    let alive = true;
    let generation = 0;
    const xr = typeof navigator !== 'undefined' ? navigator.xr : null;

    const check = async () => {
      const current = ++generation;
      if (!enabled) {
        setState({ supported: false, checking: false, reason: '' });
        return;
      }
      if (typeof window === 'undefined' || !window.isSecureContext) {
        setState({ supported: false, checking: false, reason: 'Open the HTTPS version of /dev in your headset browser.' });
        return;
      }
      if (!xr?.isSessionSupported) {
        setState({ supported: false, checking: false, reason: 'Open /dev in a WebXR headset browser, such as Meta Quest Browser.' });
        return;
      }
      setState((previous) => ({ ...previous, checking: true }));
      try {
        const supported = Boolean(await xr.isSessionSupported('immersive-vr'));
        if (alive && current === generation) {
          setState({ supported, checking: false, reason: supported ? '' : 'No immersive XR headset is available to this browser.' });
        }
      } catch {
        if (alive && current === generation) {
          setState({ supported: false, checking: false, reason: 'XR access is unavailable. Check your headset browser permissions and try again.' });
        }
      }
    };

    check();
    xr?.addEventListener?.('devicechange', check);
    window.addEventListener('focus', check);
    return () => {
      alive = false;
      generation += 1;
      xr?.removeEventListener?.('devicechange', check);
      window.removeEventListener('focus', check);
    };
  }, [enabled]);

  return state;
}

export default useXRSupport;
