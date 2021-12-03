import React, { ComponentType } from "react";

type Params = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- type inference purposes
  component: ComponentType<any>;
  displayName?: string;
  nestedComponents?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- type inference purposes
    [key: string]: Params | ComponentType<any>;
  };
};

type CompositeComponent<P extends Params> = P["component"] & { displayName: P["displayName"] } & {
    [K in keyof P["nestedComponents"]]: P["nestedComponents"][K] extends Params
      ? CompositeComponent<P["nestedComponents"][K]>
      : P["nestedComponents"][K];
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- type inference purposes
function isParams(input: Params | ComponentType<any>): input is Params {
  return "component" in input;
}

export const createCompositeComponent = <P extends Params>(params: P): CompositeComponent<P> => {
  const generateComponentPart = (componentParams: Params) => {
    const { component, displayName, nestedComponents } = componentParams;
    component.displayName = displayName || component.displayName;

    if (nestedComponents) {
      Object.keys(nestedComponents).forEach((nestedComponentKey) => {
        const nestedComponentOrParams = nestedComponents[nestedComponentKey];
        (component as React.ComponentType & Record<string, unknown>)[nestedComponentKey] = isParams(
          nestedComponentOrParams,
        )
          ? generateComponentPart(nestedComponentOrParams)
          : nestedComponentOrParams;
      });
    }

    return component;
  };

  return generateComponentPart(params) as CompositeComponent<P>;
};
