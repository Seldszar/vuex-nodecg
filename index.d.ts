import { Plugin } from "vuex";

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
}

declare function VuexNodeCG<T>(options: VuexNodeCG.Options): Promise<Plugin<T>>;

export = VuexNodeCG;
