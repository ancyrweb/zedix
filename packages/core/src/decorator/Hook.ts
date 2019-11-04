import MetadataCollector, { Metadata } from "../core/MetadataCollector";
import Request from "../core/Request";

type HookAction<TData = any> = (request: Request<TData>, event?: any) => any;

export type HookConfig<TData = any> = {
  type: string;
  action: HookAction<TData>;
};

export type HookUserConfig<TData = any> = HookConfig<TData> | HookAction<TData>
export type HookMetadata<TData = any> = Metadata<
  "hook",
  {
    config: HookConfig<TData>;
  }
>;

const mySymbol = Symbol("__classID__");

export default function Hook(config: HookUserConfig) {
  return function(instance, method) {
    if (typeof config === "function") {
      // By default if only a function is provided, we consider it a request hook for convenience
      // <rewieer 03/11/19> At this moment no other hook is supported anyway
      config = {
        type: "request",
        action: config
      }
    }

    MetadataCollector.add<HookMetadata>({
      type: "hook",
      class: instance.constructor,
      methodName: method,
      config
    });
  };
}