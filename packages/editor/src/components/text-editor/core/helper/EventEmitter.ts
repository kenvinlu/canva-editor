type StringKeyOf<T> = Extract<keyof T, string>;
type CallbackType<T extends Record<string, unknown>, EventName extends StringKeyOf<T>> = T[EventName] extends unknown[]
    ? T[EventName]
    : [T[EventName]];
type CallbackFunction<T extends Record<string, unknown>, EventName extends StringKeyOf<T>> = (
    ...props: CallbackType<T, EventName>
) => unknown;

export class EventEmitter {
    // eslint-disable-next-line @typescript-eslint/ban-types
    private callbacks: { [key: string]: Function[] } = {};

    public on(event: string, fn: CallbackFunction<Record<string, unknown>, string>): this {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }

        this.callbacks[event].push(fn);

        return this;
    }

    public emit(event: string, ...args: CallbackType<Record<string, unknown>, string>): this {
        const callbacks = this.callbacks[event];

        if (callbacks) {
            callbacks.forEach((callback) => callback.apply(this, args));
        }

        return this;
    }

    public off(event: string, fn?: CallbackFunction<Record<string, unknown>, string>): this {
        const callbacks = this.callbacks[event];

        if (callbacks) {
            if (fn) {
                this.callbacks[event] = callbacks.filter((callback) => callback !== fn);
            } else {
                delete this.callbacks[event];
            }
        }

        return this;
    }
}
