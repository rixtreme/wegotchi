console.log(`Starting Wegotchi...`);

abstract class State {
    abstract writeName(context: StateContext, name: string): void;
}

class LowerCaseState implements State {
    public writeName(context: StateContext, name: string): void {
        console.log(name.toLowerCase())
        context.setState(new MultipleUpperCaseState());
    }
}

class MultipleUpperCaseState implements State {
    private _count: number = 0;

    public writeName(context: StateContext, name: string): void {
        console.log(name.toUpperCase());
        this._count = this._count + 1;
        if (this._count > 1) {
            context.setState(new LowerCaseState());
        }
    }
}

class StateContext {
    private _state: State;

    public constructor() {
        this._state = new LowerCaseState();
    }

    public setState(newState: State) {
        this._state = newState;
    }

    public writeName(name: string) {
        this._state.writeName(this, name);
    }
}

const context = new StateContext();
context.writeName("Monday");
context.writeName("Tuesday");
context.writeName("Wednesday");
context.writeName("Thursday");
context.writeName("Friday");
context.writeName("Saturday");
context.writeName("Sunday");