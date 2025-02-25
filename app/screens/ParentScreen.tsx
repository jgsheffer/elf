import React from "react"
import { BirthdateForm } from "../components/BirthdateForm"
import { GradientContainer } from "../components/GradientContainer"

export const ParentScreen = () => {
  return (
    <GradientContainer title="Please Enter Your Date of Birth" showBackButton={true}>
      <BirthdateForm />
    </GradientContainer>
  )
}
