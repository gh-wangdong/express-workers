export class FetchEvent extends Event {
  constructor(request) {
    super('fetch');
    this.request = request;
    this._respondWithPromise = null;
    this._waitUntilPromises = [];
  }

  respondWith(promise) {
    this.stopImmediatePropagation();
    this._respondWithPromise = promise;
  }

  waitUntil(promise) {
    this._waitUntilPromises.push(promise);
  }

  async dispatch() {
    const [response] = await Promise.all([this._respondWithPromise, Promise.all(this._waitUntilPromises)]);
    if (response instanceof Response === false) {
      return new Response('Not Found', { status: 404 });
    }
    return response;
  }
}