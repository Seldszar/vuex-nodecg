/// <reference lib="dom" />

import { expectType } from "tsd";
import { Plugin } from "vuex";

import VuexNodeCG = require(".");

expectType<Promise<Plugin<any>>>(VuexNodeCG({ replicants: {} }))
