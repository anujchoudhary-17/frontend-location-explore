import React, { useState, useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form_hook";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";
const Auth = () => {
  const auth = useContext(AuthContext);
  const [onLogin, setOnLogin] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = (event) => {
    event.preventDefault();
    auth.login();

    console.log("Submitting");
  };

  const switchModeHandler = () => {
    if (!onLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        { ...formState.inputs, name: { value: "", isValid: false } },
        false
      );
    }

    setOnLogin(!onLogin);
  };

  return (
    <React.Fragment>
      <form className="place-form" onSubmit={authSubmitHandler}>
        <h2 className="center">
          {onLogin ? "Login Required" : "Sign Up Required"}
        </h2>
        {onLogin ? null : (
          <Input
            id="name"
            element="input"
            type="text"
            label="Full Name"
            validators={[VALIDATOR_MINLENGTH(2)]}
            errorText="Please enter name (at least 2 characters)."
            onInput={inputHandler}
          />
        )}
        <Input
          id="email"
          element="input"
          type="text"
          label="Email"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email!"
          onInput={inputHandler}
        />

        <Input
          id="password"
          element="input"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(8)]}
          errorText="Please enter password (at least 8 characters)."
          onInput={inputHandler}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="submit"
            className="center"
            disabled={!formState.isValid}
          >
            {onLogin ? "Login" : "Sign Up"}
          </Button>

          <Button inverse onClick={switchModeHandler} className="center">
            {onLogin ? "Sign Up" : "Already have an account?"}
          </Button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default Auth;