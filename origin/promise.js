const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function CustomPromise(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
        if (this.state === PENDING) {
            this.state = FULFILLED;
            this.value = value;
            this.onFulfilledCallbacks.forEach(callback => callback(this.value));
        }
    };

    const reject = reason => {
        if (this.state === PENDING) {
            this.state = REJECTED;
            this.reason = reason;
            this.onRejectedCallbacks.forEach(callback => callback(this.reason));
        }
    };

    try {
        executor(resolve, reject);
    }
    catch (error) {
        reject(error);
    }
}

CustomPromise.prototype.then = function (onFulfilled, onRejected) {
    const promise2 = new CustomPromise((resolve, reject) => {
        if (this.state === FULFILLED) {
            setTimeout(() => {
                try {
                    const x = onFulfilled(this.value);
                    resolvePromise(promise2, x, resolve, reject);
                }
                catch (error) {
                    reject(error);
                }
            }, 0);
        }

        if (this.state === REJECTED) {
            setTimeout(() => {
                try {
                    const x = onRejected(this.reason);
                    resolvePromise(promise2, x, resolve, reject);
                }
                catch (error) {
                    reject(error);
                }
            }, 0);
        }

        if (this.state === PENDING) {
            this.onFulfilledCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (error) {
                        reject(error);
                    }
                }, 0);
            });

            this.onRejectedCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason);
                        console.log(promise2);
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (error) {
                        reject(error);
                    }
                }, 0);
            });
        }
    });

    return promise2;
};

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected'));
    }

    if (x && (typeof x === 'object' || typeof x === 'function')) {
        let called = false;

        try {
            const then = x.then;

            if (typeof then === 'function') {
                then.call(
                    x,
                    y => {
                        if (called) {
                            return;
                        }
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    e => {
                        if (called) {
                            return;
                        }
                        called = true;
                        reject(e);
                    }
                );
            }
            else {
                resolve(x);
            }
        }
        catch (error) {
            if (called) {
                return;
            }
            called = true;
            reject(error);
        }
    }
    else {
        resolve(x);
    }
}

let aaa ;
aaa = new Promise((res, jet) => {
    // res(1)
    console.log(aaa);
    res(2)
})
console.log(22);
