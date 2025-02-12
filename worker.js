import crypto from 'node:crypto';
import { createContext, Script } from 'node:vm';
import { FetchEvent } from './event';

export default function (code) {
  const target = new EventTarget();
  const context = {
    URL,
    URLSearchParams,
    Headers,
    Request,
    Response,
    fetch,
    crypto,
    console,
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    addEventListener(type, listener, options) {
      target.addEventListener(type, listener, options);
    },
    dispatchEvent(event) {
      target.dispatchEvent(event);
    },
    removeEventListener(type, listener, options) {
      target.removeEventListener(type, listener, options);
    }
  };

  const script = new Script(code);
  script.runInContext(createContext({ ...context, self: context }));

  return {
    dispatchFetch(url, options) {
      const event = new FetchEvent(new Request(url, options));
      target.dispatchEvent(event);
      return event.dispatch();
    }
  };
}