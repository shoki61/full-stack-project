import React, { useContext, Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { UseForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const history = useHistory()
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = UseForm({
    title: {
      value: '',
      isValid: false
    },
    description:{
      value: '',
      isValid: false
    },
    address:{
      value: '',
      isValid: false
    }
  }, false);

  const placeSubmitHandler =async event => {
    try {
      event.preventDefault();
      await sendRequest(
        'http://localhost:500/api/places',
        'POST',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: auth.userId
        }),
        { 'Content-Type': 'application/json' }
      );
      history.push('/');
    } catch(e) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <form onSubmit={placeSubmitHandler} className='place-form'>
        { isLoading && <LoadingSpinner asOverlay/> }
        <Input 
          id='title'
          element='input' 
          type='text' 
          label='Title' 
          validators={[VALIDATOR_REQUIRE()]} 
          errorText='Please enter a valid title'
          onInput={inputHandler}
        />
        <Input 
          id='description'
          element='textarea'
          label='Description'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter a valid description (at leats 5 characters).'
          onInput={inputHandler}
        />
        <Input 
          id='address'
          element='input'
          label='Address'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid address.'
          onInput={inputHandler}
        />
        <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>
      </form>
    </Fragment>
  )
};

export default NewPlace;