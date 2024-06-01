import React from "react";
import { useStepper } from "./shadcn/stepper.tsx";

export default function StepperNext(props: {
  children: React.ReactNode,
}) {

  const stepperControls = useStepper();

  return (
    <div onClick={stepperControls.nextStep}>
      {props.children}
    </div>
  )
}