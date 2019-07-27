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
}

abstract class State {
    constructor(public type: StateType) {
    }

    // abstract writeName(context: PetContext, name: string): void;
}

class IdleState extends State {
    constructor() {
        super(StateType.Idle);
    }

    public writeName(context: PetContext, name: string): void {
        console.log(name.toLowerCase())
        context.setState(new SleepingState());
    }
}

class SleepingState extends State {
    constructor() {
        super(StateType.Sleeping);
    }
    
    private _count: number = 0;

    public writeName(context: PetContext, name: string): void {
        console.log(name.toUpperCase());
        this._count = this._count + 1;
        if (this._count > 1) {
            context.setState(new IdleState());
        }
    }
}

class TrainingState extends State {
    constructor() {
        super(StateType.Training);
    }
}

class SickState extends State {
    constructor() {
        super(StateType.Sick);
    }
}

class HuntingState extends State {
    constructor() {
        super(StateType.Hunting);
    }
}

class PlayingState extends State {
    constructor() {
        super(StateType.Playing);
    }
}

class EatingState extends State {
    constructor() {
        super(StateType.Eating);
    }
}

class HealingState extends State {
    constructor() {
        super(StateType.Healing);
    }
}

class PetContext {
    private _state: State;

    public constructor() {
        this._state = new IdleState();
    }

    public setState(newState: State) {
        this._state = newState;
    }

    public isIdle(): boolean {
        if (this._state.type === StateType.Idle) {
            return true;
        } else {
            return false;
        }
    }
}

const pet = new PetContext();

console.log(pet.isIdle()); // increase boredom, reduce hp, increase stress little

pet.setState(new EatingState()); // need money, increases hp, reduce stress, reduce boredom
pet.setState(new SleepingState()); // increase hp, reduce stress, cannot be applied for more than a few times a day
pet.setState(new PlayingState()); // reduce hp a little, reduce stress, reduce boredom
pet.setState(new HealingState()); // need money, increase hp, increase stress a little, make recover from sick
pet.setState(new TrainingState()); // need money, decrease hp, increase stress, increase experience, reduce boredom
pet.setState(new HuntingState()); // increase money, reduce hp, increase stress, reduce boredom