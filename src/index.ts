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

interface IntervalChange {
    hp: number;
    stress: number;
    boredom: number;
    experience: number;
}

abstract class State {
    private _pet: PetContext;

    constructor(public type: StateType) {
    }

    public abstract onStateChanged(pet: PetContext): void;
}

class IdleState extends State {
    constructor() {
        super(StateType.Idle);
    }

    public onStateChanged(pet: PetContext): void {
        pet.setIntervalChange({
            hp: -0.2,
            stress: +0.2,
            boredom: +0.2,
            experience: 0
        });
    }
}

class SleepingState extends State {
    constructor() {
        super(StateType.Sleeping);
    }

    public onStateChanged(pet: PetContext): void {
        pet.setIntervalChange({
            hp: +0.2,
            stress: -0.2,
            boredom: 0,
            experience: 0
        });
    }
}

class TrainingState extends State {
    constructor() {
        super(StateType.Training);
    }

    public onStateChanged(pet: PetContext): void {
        const experienceChange = 1/pet.getInfo().level;

        pet.setIntervalChange({
            hp: -0.2,
            stress: +0.2,
            boredom: -0.2,
            experience: experienceChange
        });
    }
}

class SickState extends State {
    constructor() {
        super(StateType.Sick);
    }

    public onStateChanged(pet: PetContext): void {
        pet.setIntervalChange({
            hp: -0.2,
            stress: +0.2,
            boredom: +0.2,
            experience: 0
        });
    }
}

class HuntingState extends State {
    constructor() {
        super(StateType.Hunting);
    }

    public onStateChanged(pet: PetContext): void {
        const experienceChange = 1/pet.getInfo().level;

        pet.setIntervalChange({
            hp: -0.2,
            stress: +0.2,
            boredom: -0.2,
            experience: experienceChange
        });
    }
}

class PlayingState extends State {
    constructor() {
        super(StateType.Playing);
    }

    public onStateChanged(pet: PetContext): void {
        pet.setIntervalChange({
            hp: -0.2,
            stress: -0.2,
            boredom: -0.2,
            experience: +0.1
        });
    }
}

class EatingState extends State {
    constructor() {
        super(StateType.Eating);
    }

    public onStateChanged(pet: PetContext): void {
        pet.setIntervalChange({
            hp: +0.2,
            stress: -0.2,
            boredom: -0.1,
            experience: 0
        });
    }
}

class HealingState extends State {
    constructor() {
        super(StateType.Healing);
    }

    public onStateChanged(pet: PetContext): void {
        pet.setIntervalChange({
            hp: +0.4,
            stress: -0.1,
            boredom: 0,
            experience: 0
        });
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
    private _intervalChange: IntervalChange;

    public constructor(name: string) {
        this._info = {
            name: name,
            level: 1,
            state: StateType.Idle,
            hp: 100,
            stress: 10,
            boredom: 10,
            experience: 0
        }

        this.setState(StateType.Idle);
    }

    public onInterval() {
        console.log(`Updating pet info at state: ${this._state.type}`);

        this._info.hp += this._intervalChange.hp;
        this._info.stress += this._intervalChange.stress;
        this._info.boredom += this._intervalChange.boredom;
        this._info.experience += this._intervalChange.experience;

        this._info.hp = this._info.hp > 100 ? 100 : this._info.hp < 0 ? 0 : this._info.hp;
        this._info.stress = this._info.stress > 100 ? 100 : this._info.stress < 0 ? 0 : this._info.stress;
        this._info.boredom = this._info.boredom > 100 ? 100 : this._info.boredom < 0 ? 0 : this._info.boredom;
        this._info.experience = this._info.experience > 100 ? 100 : this._info.experience < 0 ? 0 : this._info.experience;

        if (this._info.hp <= 0 && this._info.stress >= 100 && this._info.boredom >= 100) {
            this.setState(StateType.Dead);
        }

        if (this._info.experience >= 100) {
            this._info.level += 1;
            this._info.experience = 0;
        }
    }

    public setIntervalChange(intervalChange: IntervalChange) {
        this._intervalChange = intervalChange;
    }

    public setState(type: StateType) {
        if (!!this._state && this._info.state === type) {
            return;
        }

        let newState: State;
        switch (type) {
            case StateType.Dead:
                newState = new DeadState();
                break;
            case StateType.Eating:
                newState = new EatingState();
                break;
            case StateType.Healing:
                newState = new HealingState();
                break;
            case StateType.Hunting:
                newState = new HuntingState();
                break;
            case StateType.Playing:
                newState = new PlayingState();
                break;
            case StateType.Sick:
                newState = new SickState();
                break;
            case StateType.Sleeping:
                newState = new SleepingState();
                break;
            case StateType.Training:
                newState = new TrainingState();
                break;
            case StateType.Idle:
            default:
                newState = new IdleState();
                break;
        }

        const prevState = this._state;
        this._state = newState;
        this._info.state = this._state.type;
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

// const pet = new PetContext("damas");

// pet.setState(new EatingState()); // need money, increases hp, reduce stress, reduce boredom
// pet.setState(new SleepingState()); // increase hp, reduce stress, cannot be applied for more than a few times a day
// pet.setState(new PlayingState()); // reduce hp a little, reduce stress, reduce boredom
// pet.setState(new HealingState()); // need money, increase hp, increase stress a little, make recover from sick
// pet.setState(new TrainingState()); // need money, decrease hp, increase stress, increase experience, reduce boredom
// pet.setState(new HuntingState()); // increase money, reduce hp, increase stress, increase experience, reduce boredom

// pet.setState(new IdleState());

async function waitAsync(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
    const interval = 30;
    let elapsedTime = 0;

    const pet = new PetContext("damas");
    while (pet.getInfo().state !== StateType.Dead) {
        pet.onInterval();
        console.log(pet.getInfo());

        if (elapsedTime > 3000 && elapsedTime < 6000) {
            pet.setState(StateType.Training);
        } else if (elapsedTime > 6000 && elapsedTime < 12000) {
            pet.setState(StateType.Eating);
        } else if (elapsedTime > 12000 && elapsedTime < 18000) {
            pet.setState(StateType.Hunting);
        } else if (elapsedTime > 18000 && elapsedTime < 24000) {
            pet.setState(StateType.Healing);
        } else if (elapsedTime > 24000 && elapsedTime < 30000) {
            pet.setState(StateType.Playing);
        } else if (elapsedTime > 30000 && elapsedTime < 36000) {
            pet.setState(StateType.Sleeping);
        } else if (elapsedTime > 36000 && elapsedTime < 40000) {
            pet.setState(StateType.Sick);
        } else if (elapsedTime > 40000 && elapsedTime < 46000) {
            pet.setState(StateType.Healing);
        } else if (elapsedTime > 46000) {
            pet.setState(StateType.Idle);
        }

        await waitAsync(interval);
        elapsedTime += interval;
    }

    console.log(`Terminating worker...`);
})();