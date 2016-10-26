namespace MyQ {
	export class MyPromise<RESULT> {
			constructor() { }

			private _ok: {(result: RESULT)} = null;
			private _ng: { (e: any) } = null;
			private _final: {()} = null;

			private _next: MyPromise<any> = null;
			private _finallyCalled = false;

			public resolve(arg: RESULT) {
					if (this._ok) {
							try {
									var ret = this._ok(arg);
									this._next.resolve(ret);
							} catch (e) {
									this.reject(e);
							} finally {
									this.final();
							}
					}
			}

			public reject(e: any) {
					try {
							if (this._next)
									this._next.reject(e);
							else if (this._ng)
									this._ng(e);
					} catch (e) {
							throw e;
					} finally {
							this.final();
					}
			}

			public final() {
					if (this._next) {
							this._next.final();
					} else if (this._final){
							if (!this._finallyCalled) {
									this._finallyCalled = true;
									this._final();
							}
					}
			}

			public then<NEW_RESULT>(func: { (result: RESULT):NEW_RESULT }): MyPromise < NEW_RESULT > {
					this._ok = func;
					this._next = new MyPromise<NEW_RESULT>();
					return this._next;
			}

			public catch(func: {( e: any )}): MyPromise<RESULT> {
					this._ng = func;
					return this;
			}

			public finally(func: {()}): MyPromise<RESULT> {
					this._final = func;
					return this;
			}

			public static when<T>(arg : T) : MyPromise<T> {
					var promise = new MyPromise<T>();

					setTimeout(() => {
							promise.resolve(arg);
					}, 0);

					return promise;
			}

			public static all(promises : MyPromise<any>[]) : MyPromise<any[]> {
					var promiseLength = promises.length;
					var callbackCount = 0;
					var promisesArgs = [];
					var allPromise = new MyPromise<any[]>();

					var resolve = function (index: number) {
							return function (arg) {
									callbackCount++;
									promisesArgs[index] = arg;
									if (promiseLength == callbackCount) {
											allPromise.resolve(promisesArgs);
									}
							}
					};
					var reject = function (index: number) {
							return function (e: any) {
									allPromise.reject(e);
							}
					};

					for (let i = 0; i < promises.length; i++) {
							promises[i].then(resolve(i)).catch(reject(i));
					}
					return allPromise;
			}

			public static allSettled(promises: MyPromise<any>[]): MyPromise<any[]> {
					var promiseLength = promises.length;
					var callbackCount = 0;
					var results = [];
					var allPromise = new MyPromise<any[]>();

					var resolve = function (index: number) {
							return function (arg) {
									callbackCount++;
									results[index] = { state : 'fulfilled', value : arg};
									if (promiseLength == callbackCount) {
											allPromise.resolve(results);
									}
							}
					};
					var reject = function (index: number) {
							return function (e: any) {
									callbackCount++;
									results[index] = { state : 'rejected', reason : e};
									if (promiseLength == callbackCount) {
											allPromise.resolve(results);
									}
							}
					};

					for (let i = 0; i < promises.length; i++) {
							promises[i].then(resolve(i)).catch(reject(i));
					}
					return allPromise;

			}

			public static race(promises: MyPromise<any>[]): MyPromise<any> {
					var racePromise = new MyPromise<any>();
					var raceCalled = false;

					var resolve = function (arg) {
							if (!raceCalled) {
									raceCalled = true;
									racePromise.resolve(arg);
							}
					};
					var reject = function (e: any) {
							if (!raceCalled) {
									raceCalled = true;
									racePromise.reject(e);
							}
					};

					for (let i = 0; i < promises.length; i++) {
							promises[i].then(resolve).catch(reject);
					}

					return racePromise;
			}
	}
}
