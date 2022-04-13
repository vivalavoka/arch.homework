const { saga_created } = require("../Errors/SagaErrors");

const stubFunc = () => {};
const SAGA_STATUS = {
    success: 'success',
    failed: 'failed',
};

const SAGA_STEP = {
    start: 'start',
    reject: 'reject',
    accept: 'accept',
}

module.exports = class SagaBuilder {
    constructor() {
        this._steps = [];
        this._curStep = -1;

        this._SagaRepository;
    }

    static create() {
        return new SagaBuilder();
    }

    repository(repository) {
        this._SagaRepository = repository;
        return this;
    }

    step(stepName = null) {
        this._curStep++;
        this._steps.push({
            name: stepName,
            step: this._curStep,
            invoke: null,
            onConfirm: null,
            withCompensation: null
        });
        return this;
    }

    invoke(handler = null) {
        this._steps[this._curStep].invoke = handler;
        return this;
    }

    onConfirm(handler = null) {
        this._steps[this._curStep].onConfirm = handler;
        return this;
    }

    withCompensation(handler = null) {
        this._steps[this._curStep].withCompensation = handler;
        return this;
    }

    build() {
        return this;
    }

    handle(command) {
        
    }

    async next(command) {
        const tx = command.tx;
        const saga_key = command.saga_key;
        const sagaRep = this._SagaRepository.get(tx.client);

        let step = command.step || 0;
        let stepFunc = null;
        for (let i = step; i < this._steps.length; i++) {
            if (this._steps[i].invoke) {
                stepFunc = this._steps[i].invoke;
                step = i;
                break;
            }
        }

        const {transaction_id} = await sagaRep.create({saga_key, step});
        command.transaction_id = transaction_id;
        
        return stepFunc(command);
    }

    async response(command) {
        const tx = command.tx;
        const transaction_id = command.transaction_id;
        const sagaRep = this._SagaRepository.get(tx.client);

        const sagaData = await sagaRep.getByTxId({transaction_id});
        command.step = sagaData.step;

        if (command.status === SAGA_STATUS.success) {
            await sagaRep.process({transaction_id});
            command.step++;

            await this.next(command);
        }
    }
}