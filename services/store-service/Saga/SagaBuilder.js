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
        this._stepsOrder = [];
        this._startHandler = {};
        this._rejectHandler = {};
        this._acceptHandler = {};

        this._SagaRepository;
        this._curStep;
    }

    static create() {
        return new this();
    }

    transaction(Transaction) {
        this._Transaction = Transaction;
        return this;
    }

    command(Command) {
        this._Command = Command;
        return this;
    }

    repository(repository) {
        this._SagaRepository = repository;
        return this;
    }

    step(stepName) {
        this._stepsOrder.push(stepName);
        this._startHandler[stepName] = stubFunc;
        this._rejectHandler[stepName] = stubFunc;
        this._acceptHandler[stepName] = stubFunc;

        this._curStep = stepName;
        return this;
    }

    onStart(handler = stubFunc) {
        this._startHandler[this._curStep] = handler;
        return this;
    }

    onAccept(handler = stubFunc) {
        this._acceptHandler[this._curStep] = handler;
        return this;
    }

    onReject(handler = stubFunc) {
        this._rejectHandler[this._curStep] = handler;
        return this;
    }

    _handleAction(command) {
        switch (command.handler) {
            case SAGA_STEP.start:
                return this._startHandler[command.step](command);
            case SAGA_STEP.reject:
                return this._rejectHandler[command.step](command);
            case SAGA_STEP.accept:
                return this._acceptHandler[command.step](command);
        }
    }

    build() {
        return (command) => this.run(command);
    }

    async run(...args) {
        await new Promise((res) => {
            setTimeout(() => {
                res();
            }, 5000);
        });
        const command = await this._Command.init(...args);
        const tx = await this._Transaction.init();
        command.tx = tx;

        const sagaRep = this._SagaRepository.get(tx.client);

        try {
            if (command.handler !== SAGA_STEP.start) {
                const sagaResult = await sagaRep.getData({saga_key: command.saga_key});
                if (sagaResult && sagaResult.data)
                    command.saga_data = sagaResult.data;
            }

            await this._handleAction(command);

            const saga_key = command.saga_key;
            switch(command.handler) {
                case SAGA_STEP.start:
                    const saga_data = command.saga_data;
                    await sagaRep.create({saga_key, data: saga_data});
                    break;
                case SAGA_STEP.reject:
                    await sagaRep.reject({saga_key});
                    break;
                case SAGA_STEP.accept:
                    await sagaRep.accept({saga_key});
                    break;
            }

            await tx.commit();
            command.status = SAGA_STATUS.success;
        } catch(error) {
            console.error(error);
            await tx.abort();
            command.status = SAGA_STATUS.failed;
            command.reason = error.json.message;
        }
        return command;
    }
}