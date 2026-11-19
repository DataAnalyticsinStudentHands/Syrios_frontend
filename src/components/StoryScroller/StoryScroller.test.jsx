// @vitest-environment jsdom

import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import StoryScroller from './StoryScroller';

const options = {
  licenseKey: 'gplv3-license',
  navigation: true,
  scrollingSpeed: 0,
};

const story = (anchors, { onRender, extra = false, onClick } = {}) => (context) => {
  onRender?.(context);
  return (
    <StoryScroller.Wrapper>
      {anchors.map((anchor) => (
        <section className='section' key={anchor}>
          <h2>{anchor}</h2>
          {extra && <button type='button' onClick={onClick}>Read {anchor}</button>}
        </section>
      ))}
    </StoryScroller.Wrapper>
  );
};

beforeEach(() => {
  Object.defineProperty(document, 'domain', { configurable: true, value: window.location.hostname });
  window.history.replaceState(null, '', '/StoryReader');
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  const consoleError = console.error;
  vi.spyOn(console, 'error').mockImplementation((message, ...args) => {
    // The public engine runs without a commercial test license. Keep unrelated
    // React/engine errors visible while silencing only its license notice.
    if (String(message).startsWith('fullPage: Incorrect `licenseKey`')
      || message === 'fullPage: https://alvarotrigo.com/fullPage/pricing') return;
    consoleError(message, ...args);
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.history.replaceState(null, '', '/StoryReader');
});

describe('StoryScroller with the real fullPage engine', () => {
  it('initializes after sections exist and opens the requested hash without animation', () => {
    window.history.replaceState(null, '', '/StoryReader#second');
    const sectionsAtInit = vi.fn(() => document.querySelectorAll('#fullpage > .section').length);
    const renderer = vi.fn();

    render(<StoryScroller {...options} anchors={['first', 'second']} afterRender={sectionsAtInit} render={story(['first', 'second'], { onRender: renderer })} />);

    expect(sectionsAtInit).toHaveReturnedWith(2);
    expect(window.fullpage_api.version).toBe('4.0.41');
    expect(window.fullpage_api.getActiveSection().anchor).toBe('second');
    expect(document.querySelector('.section.active h2').textContent).toBe('second');
    expect(renderer.mock.calls[0][0].fullpageApi).toBeNull();
    expect(renderer.mock.lastCall[0].fullpageApi).toBe(window.fullpage_api);
    expect(renderer.mock.lastCall[0].state.initialized).toBe(true);
  });

  it('keeps API section navigation and generated anchor links working', () => {
    render(<StoryScroller {...options} anchors={['first', 'second']} render={story(['first', 'second'])} />);

    act(() => window.fullpage_api.moveTo('second'));

    expect(window.location.hash).toBe('#second');
    expect(document.querySelector('.section.active h2').textContent).toBe('second');
    expect(document.querySelector('#fp-nav a[href="#second"]').classList.contains('active')).toBe(true);

    act(() => document.querySelector('#fp-nav a[href="#first"]').click());

    expect(window.location.hash).toBe('#first');
    expect(document.querySelector('.section.active h2').textContent).toBe('first');
  });

  it('reuses the scroller when only the render callback and equal anchors change', () => {
    const afterRender = vi.fn();
    const originalClick = vi.fn();
    const updatedClick = vi.fn();
    const frames = [{ id: 'first' }, { id: 'second' }];
    const view = render(<StoryScroller {...options} contentKey={frames} anchors={['first', 'second']} afterRender={afterRender} render={story(['first', 'second'], { extra: true, onClick: originalClick })} />);
    const navigation = document.querySelector('#fp-nav');
    act(() => window.fullpage_api.moveTo('second'));

    view.rerender(<StoryScroller {...options} contentKey={frames} anchors={['first', 'second']} afterRender={afterRender} render={story(['first', 'second'], { extra: true, onClick: updatedClick })} />);

    expect(afterRender).toHaveBeenCalledTimes(1);
    expect(document.querySelector('#fp-nav')).toBe(navigation);
    act(() => screen.getByRole('button', { name: 'Read second' }).click());
    expect(updatedClick).toHaveBeenCalledTimes(1);
    expect(originalClick).not.toHaveBeenCalled();
    expect(window.fullpage_api.getActiveSection().anchor).toBe('second');
    expect(window.fullpage_api.getFullpageData().options).not.toHaveProperty('contentKey');
  });

  it('replaces anchors and sections without leaving old engine markup or breaking React removal', () => {
    const afterRender = vi.fn();
    const view = render(<StoryScroller {...options} anchors={['first', 'second']} afterRender={afterRender} render={story(['first', 'second'])} />);

    view.rerender(<StoryScroller {...options} anchors={['replacement']} afterRender={afterRender} render={story(['replacement'])} />);

    expect(afterRender).toHaveBeenCalledTimes(2);
    expect(document.querySelectorAll('#fp-nav')).toHaveLength(1);
    expect(document.querySelectorAll('#fp-nav a')).toHaveLength(1);
    expect(document.querySelector('#fp-nav a').getAttribute('href')).toBe('#replacement');
    expect(screen.queryByRole('heading', { name: 'first' })).toBeNull();
    expect(window.fullpage_api.getActiveSection().anchor).toBe('replacement');
    expect(() => view.unmount()).not.toThrow();
    expect(document.querySelector('#fp-nav')).toBeNull();
  });

  it('removes global engine styles, navigation, observers and listeners on unmount', () => {
    const windowAdd = vi.spyOn(window, 'addEventListener');
    const windowRemove = vi.spyOn(window, 'removeEventListener');
    const documentAdd = vi.spyOn(document, 'addEventListener');
    const documentRemove = vi.spyOn(document, 'removeEventListener');
    const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
    const view = render(<StoryScroller {...options} anchors={['first', 'second']} render={story(['first', 'second'])} />);

    expect(document.documentElement.classList.contains('fp-enabled')).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    view.unmount();

    expect(document.documentElement.classList.contains('fp-enabled')).toBe(false);
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.querySelector('#fp-nav')).toBeNull();
    expect(document.querySelector('#fullpage')).toBeNull();
    expect(disconnect).toHaveBeenCalled();
    for (const [add, remove, events] of [
      [windowAdd, windowRemove, ['hashchange', 'resize']],
      // fullPage keeps one module-wide, deduplicated wheel velocity tracker.
      // Its instance-scoped navigation/scroll-blocking listeners must disappear.
      [documentAdd, documentRemove, ['keydown', 'keyup']],
    ]) {
      const bindings = add.mock.calls.filter(([event]) => events.includes(event));
      expect(bindings.length).toBeGreaterThan(0);
      for (const [event, listener] of bindings) {
        expect(remove.mock.calls.some(([removedEvent, removedListener]) => removedEvent === event && removedListener === listener), `removes ${event}: ${listener.name}`).toBe(true);
      }
    }
    const wheel = new WheelEvent('wheel', { deltaY: 120, cancelable: true });
    document.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(false);
  });

  it('unwraps overflow before replacing immutable frame content even when anchors stay the same', () => {
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(1200);
    const anchors = ['first', 'second'];
    const afterRender = vi.fn();
    const frames = [{ id: 1 }, { id: 2 }];
    const replacementFrames = [{ id: 3 }, { id: 4 }];
    const view = render(<StoryScroller {...options} contentKey={frames} anchors={anchors} afterRender={afterRender} render={story(anchors, { extra: true })} />);

    expect(document.querySelector('.fp-overflow')).toBeTruthy();
    expect(() => view.rerender(<StoryScroller {...options} contentKey={replacementFrames} anchors={anchors} afterRender={afterRender} render={story(anchors)} />)).not.toThrow();
    expect(afterRender).toHaveBeenCalledTimes(2);
    expect(document.querySelectorAll('#fp-nav')).toHaveLength(1);
    expect(document.querySelectorAll('.fp-overflow')).toHaveLength(2);
    expect(screen.queryByRole('button', { name: 'Read first' })).toBeNull();
    expect(screen.getByRole('heading', { name: 'first' })).toBeTruthy();
    expect(() => view.unmount()).not.toThrow();
  });

  it('survives the React StrictMode mount-cleanup-remount cycle', () => {
    const anchors = ['first', 'second'];
    const view = render(
      <React.StrictMode>
        <StoryScroller {...options} anchors={anchors} render={story(anchors)} />
      </React.StrictMode>,
    );

    expect(document.querySelectorAll('#fp-nav')).toHaveLength(1);
    expect(document.querySelectorAll('#fullpage > .section')).toHaveLength(2);
    act(() => window.fullpage_api.moveTo('second'));
    expect(window.fullpage_api.getActiveSection().anchor).toBe('second');
    expect(() => view.unmount()).not.toThrow();
    expect(document.documentElement.classList.contains('fp-enabled')).toBe(false);
  });
});
