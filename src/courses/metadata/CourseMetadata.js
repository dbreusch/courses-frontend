// class FormData
// Encapsulate "form field" metadata and methods to derive new metadata
// objects from the base data.

import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { VALIDATOR_NUMERIC } from '../../shared/util/validators';
import { VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { VALIDATOR_GT } from '../../shared/util/validators';
import { VALIDATOR_MIN } from '../../shared/util/validators';

import { formMetaData } from './formMetaData';

export class CourseMetadata {
  constructor() {
    this._metadata = [];
  }

  // convert text format constraints to actual validator functions
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

  // provide additional form metadata for presentational purposes
  addFormData() {
    if (this._metadata.length > 0) {
      // console.log('CourseMetadata: addFormData: _metadata > 0');
      const formKeys = Object.keys(formMetaData);
      if (formKeys.length > 0) {
        // console.log('CourseMetadata: addFormData: formKeys > 0');

        const defaults = {
          "isPublic": true,
          "initialIsValid": false,
          "isScrollable": false,
          "formDisplay": "form-control--inline",
          "type": "text",
          "element": "input"
        };
        const defaultsKeys = Object.keys(defaults);

        let newFields, newFieldsKeys;
        let oldKeys;
        this._metadata.forEach(field => {
          oldKeys = Object.keys(field);
          defaultsKeys.forEach((key, index) => {
            // console.log(`CourseMetadata: adding default key ${key} to ${field.id}`);
            if (!oldKeys.includes(key)) {
              field[key] = defaults[key];
            }
          });
        }
        );

        this._metadata.forEach(field => {
          if (formKeys.includes(field.id)) {
            newFields = formMetaData[field.id];
            newFieldsKeys = Object.keys(newFields);
            newFieldsKeys.forEach((key, index) => {
              // console.log(`CourseMetadata: adding additional key ${key} to ${field.id}`);
              field[key] = newFields[key];
            });
          }
        });
      }
    }
  }

  get metadata() {
    return this._metadata;
  }

  set metadata(data) {
    // console.log('CourseMetadata: set metadata');
    if (data.length > 0) {
      // console.log('CourseMetadata: assigning');
      this._metadata = data;
      // console.log('CourseMetadata: adding validators');
      this.addValidators();
      this.addFormData();
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
