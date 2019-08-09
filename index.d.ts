import * as Vuex from "vuex";

declare namespace VuexNodeCG {
  interface ReplicantOptions {
    defaultValue?: any;
    persistent?: boolean;
    schemaPath?: string;
  }

  interface Options {
    moduleName?: string;
    replicants: Record<string, ReplicantOptions>;
  }

  type Plugin<S> = Vuex.Plugin<S> & Promise<Vuex.Plugin<S>>;
}

declare function VuexNodeCG<S = any>(options: VuexNodeCG.Options): VuexNodeCG.Plugin<S>;

export = VuexNodeCG;
