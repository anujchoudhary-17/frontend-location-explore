import React, { useCallback, useContext, useReducer } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form_hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();
  const placeSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);
      await sendRequest("http://localhost:5000/api/places", "POST", formData);
      history.push("/");
    } catch (err) {}
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card>
        {isLoading && <LoadingSpinner asOverlay />}
        <form className="place-form" onSubmit={placeSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title!"
            onInput={inputHandler}
          />

          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter description (at least 5 characters)."
            onInput={inputHandler}
          />

          <Input
            id="address"
            element="input"
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid address."
            onInput={inputHandler}
          />
          <ImageUpload center id="image" onInput={inputHandler} />
          <Button type="submit" disabled={!formState.isValid}>
            Add Place
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default NewPlace;
