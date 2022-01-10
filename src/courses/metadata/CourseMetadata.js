// class FormData
// Encapsulate "form field" metadata and methods to derive new metadata
// objects from the base data.

import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { VALIDATOR_NUMERIC } from '../../shared/util/validators';
import { VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { VALIDATOR_GT } from '../../shared/util/validators';
import { VALIDATOR_MIN } from '../../shared/util/validators';

export class CourseMetadata {
  constructor() {
    this._metadata = [];
  }

  addValidators() {
    // console.log('CourseMetadata: addValidators');
    this._metadata.forEach(field => {
      // console.log(field.id);
      field.validators = [];
      field.constraints.forEach(constraint => {
        // console.log(constraint);
        switch (constraint[0]) {
          case 'require':
            // console.log('VALIDATOR_REQUIRE recognized');
            field.validators.push(VALIDATOR_REQUIRE());
            break;
          case 'numeric_int':
          case 'numeric_float':
            // console.log('VALIDATOR_NUMERIC recognized');
            field.validators.push(VALIDATOR_NUMERIC());
            break;
          case 'min':
            // console.log('VALIDATOR_MIN recognized');
            if (constraint.length < 2) {
              console.log(`Validation constraint ${constraint} requires second argument!`);
            } else {
              field.validators.push(VALIDATOR_MIN(constraint[1]));
            }
            break;
          case 'min_length':
            // console.log('VALIDATOR_MINLENGTH recognized');
            if (constraint.length < 2) {
              console.log(`Validation constraint ${constraint} requires second argument!`);
            } else {
              field.validators.push(VALIDATOR_MINLENGTH(constraint[1]));
            }
            break;
          case 'gt':
            // console.log('VALIDATOR_GT recognized');
            if (constraint.length < 2) {
              console.log(`Validation constraint ${constraint} requires second argument!`);
            } else {
              field.validators.push(VALIDATOR_GT(constraint[1]));
            }
            break;
          default:
            console.log(`Validation constraint ${constraint} not recognized!`);
        }
      });
    });
  }

  get metadata() {
    return this._metadata;
  }

  set metadata(data) {
    // console.log('CourseMetadata: set metadata');
    if (data.length > 0) {
      // console.log('CourseMetadata: assigning');
      this._metadata = data;
      // console.log('CourseMetadata: loading');
      this.addValidators();
    }
    // else {
    //   console.log('CourseMetadata: set metadata input is empty');
    // }
  }

  get formInput() {
    return this.createFormInput();
  }

  createFormInput() {
    let formInput = {};
    for (let i = 0; i < this._metadata.length; i++) {
      formInput[this._metadata[i].id] = { value: '', isValid: false };
    }
    return formInput;
  }

  get validFormKeys() {
    return this.createValidFormKeys();
  }

  createValidFormKeys() {
    let validFormKeys = [];
    for (let i = 0; i < this._metadata.length; i++) {
      validFormKeys.push(this._metadata[i].id);
    }
    return validFormKeys;
  }

}
