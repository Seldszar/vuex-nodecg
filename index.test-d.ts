/// <reference lib="dom" />

import { expectType } from "tsd";
import { Plugin } from "vuex";

import VuexNodeCG = require(".");

const plugin = VuexNodeCG({
  replicants: {},
});

expectType<Plugin<any>>(plugin);
expectType<Promise<Plugin<any>>>(plugin);
expectType<VuexNodeCG.Plugin<any>>(plugin);
