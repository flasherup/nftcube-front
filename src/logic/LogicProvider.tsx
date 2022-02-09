import * as React from "react";
export const LogicProviderContext = React.createContext<undefined>(undefined);
export type Logic = () => void;

export default function LogicProvider(props:any) {
    const logic = props['logic'] as Logic[];
    if (logic) {
        logic.forEach(l=>l());
    }
    //Clean logic from props
    const { ['logic']: removedKey, ...p } = props;
    return <LogicProviderContext.Provider value={'empty'} {...p} />;
}