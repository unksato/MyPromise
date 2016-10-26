namespace MyQ {
  export class MyDeferred<RESULT> {
    private constructor() { }

    public static defer<T>(): MyDeferred<T> {
      return new MyDeferred<T>();
    }

    public promise: MyPromise<RESULT> = new MyPromise<RESULT>();

    public resolve(arg: RESULT) {
      setTimeout(() => {
        this.promise.resolve(arg);
      }, 0)
    }

    public reject(e) {
      setTimeout(() => {
        this.promise.reject(e);
      }, 0);
    }
  }
}
