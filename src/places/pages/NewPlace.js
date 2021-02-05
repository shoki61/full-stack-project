import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import { UseForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';

const NewPlace = () => {

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

  

  const placeSubmitHandler = event => {
    event.preventDefault();
  };

  return <form onSubmit={placeSubmitHandler} className='place-form'>
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
};

export default NewPlace;