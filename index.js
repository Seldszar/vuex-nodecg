/* global nodecg */

const rfdc = require("rfdc");

module.exports = async options => {
  const moduleName = options.moduleName || "replicants";
  const clone = rfdc();

  const managedReplicants = new Map();
  const initialState = {};

  for (const [replicantName, replicantOptions] of Object.entries(options.replicants)) {
    managedReplicants.set(replicantName, nodecg.Replicant(replicantName, replicantOptions));
  }

  await NodeCG.waitForReplicants(...managedReplicants.values());

  return store => {
    let isReady = false;

    managedReplicants.forEach(replicant => {
      replicant.on("change", newValue => {
        const rawValue = clone(newValue);

        if (isReady) {
          store.commit(`${moduleName}/REPLICANT_CHANGED`, {
            name: replicant.name,
            value: rawValue,
          });

          return;
        }

        initialState[replicant.name] = rawValue;
      });
    });

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

    isReady = true;
  };
};
