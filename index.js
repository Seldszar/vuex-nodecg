/* global nodecg */

const rfdc = require("rfdc");

const mergePromise = (original, promise) => {
  original.then = promise.then.bind(promise);
  original.catch = promise.catch.bind(promise);

  if (Promise.prototype.finally) {
    original.finally = promise.finally.bind(promise);
  }

  return original;
};

module.exports = options => {
  const moduleName = options.moduleName || "replicants";
  const clone = rfdc();

  const managedReplicants = new Map();
  const initialState = {};

  for (const [replicantName, replicantOptions] of Object.entries(options.replicants)) {
    managedReplicants.set(replicantName, nodecg.Replicant(replicantName, replicantOptions));
    initialState[replicantName] = replicantOptions.defaultValue;
  }

  const waitForReplicants = NodeCG.waitForReplicants(...managedReplicants.values());
  const install = store => {
    store.registerModule(moduleName, {
      state: initialState,
      namespaced: true,
      mutations: {
        REPLICANT_CHANGED(state, { name, value }) {
          state[name] = value;
        },
      },
      actions: {
        updateReplicant(_, { name, value }) {
          const replicant = managedReplicants.get(name);

          if (replicant === undefined) {
            throw new Error(`Replicant "${name}" not managed`);
          }

          replicant.value = clone(value);
        },
      },
    });

    managedReplicants.forEach(replicant => {
      replicant.on("change", newValue => {
        store.commit(`${moduleName}/REPLICANT_CHANGED`, {
          name: replicant.name,
          value: clone(newValue),
        });
      });
    });
  };

  return mergePromise(
    store => install(store),
    waitForReplicants.then(() => install),
  );
};
