console.log(`Starting Wegotchi...`);

enum StateType {
    Idle = "idle",
    Sleeping = "sleeping",
    Training = "training",
    Sick = "sick",
    Hunting = "hunting",
    Playing = "playing",
    Eating = "eating",
    Healing = "healing",
    Dead = "dead"
}

abstract class State {
    constructor(public type: StateType) {
    }

    public abstract onStateChanged(pet: PetContext): void;

    // abstract writeName(context: PetContext, name: string): void;
}

class IdleState extends State {
    constructor() {
        super(StateType.Idle);
    }

    public onStateChanged(pet: PetContext): void {
    }
}

class SleepingState extends State {
    constructor() {
        super(StateType.Sleeping);
    }

    public onStateChanged(pet: PetContext): void {
    }
}

class TrainingState extends State {
    constructor() {
        super(StateType.Training);
    }

    public onStateChanged(pet: PetContext): void {
    }
}

class SickState extends State {
    constructor() {
        super(StateType.Sick);
    }

    public onStateChanged(pet: PetContext): void {
    }
}

class HuntingState extends State {
    constructor() {
        super(StateType.Hunting);
    }

    public onStateChanged(pet: PetContext): void {
    }
}

class PlayingState extends State {
    constructor() {
        super(StateType.Playing);
    }

    public onStateChanged(pet: PetContext): void {
    }
}

class EatingState extends State {
    constructor() {
        super(StateType.Eating);
    }

    public onStateChanged(pet: PetContext): void {
    }
}

class HealingState extends State {
    constructor() {
        super(StateType.Healing);
    }

    public onStateChanged(pet: PetContext): void {
    }
}

class DeadState extends State {
    constructor() {
        super(StateType.Dead);
    }

    public onStateChanged(pet: PetContext): void {
    }
}

interface PetInfo {
    name: string;
    level: number;
    state: StateType;
    hp: number;
    stress: number;
    boredom: number;
    experience: number;
}

class PetContext {
    private _state: State;
    private _prevState: State;
    
    private _info: PetInfo;

    public constructor(name: string) {
        this.setState(new IdleState());
        this._info = {
            name: name,
            level: 0,
            state: StateType.Idle,
            hp: 100,
            stress: 10,
            boredom: 10,
            experience: 0
        }
    }

    public setState(newState: State) {
        const prevState = this._state;
        this._state = newState;
        this._state.onStateChanged(this);
    }

    public getInfo(): PetInfo {
        return this._info;
    }

    public isIdle(): boolean {
        if (this._state.type === StateType.Idle) {
            return true;
        } else {
            return false;
        }
    }
}

const pet = new PetContext("damas");

pet.setState(new EatingState()); // need money, increases hp, reduce stress, reduce boredom
pet.setState(new SleepingState()); // increase hp, reduce stress, cannot be applied for more than a few times a day
pet.setState(new PlayingState()); // reduce hp a little, reduce stress, reduce boredom
pet.setState(new HealingState()); // need money, increase hp, increase stress a little, make recover from sick
pet.setState(new TrainingState()); // need money, decrease hp, increase stress, increase experience, reduce boredom
pet.setState(new HuntingState()); // increase money, reduce hp, increase stress, increase experience, reduce boredom

pet.setState(new IdleState());

async function waitAsync(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
    const interval = 3000;

    let elapsedTime = 0;
    while (pet.getInfo().state !== StateType.Dead) {
        console.log(pet.getInfo());

        await waitAsync(interval);
        elapsedTime += interval;
    }

    console.log(`Terminating worker...`);
})();