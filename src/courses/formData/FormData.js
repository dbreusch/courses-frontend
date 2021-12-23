// class FormData
// Encapsulate "form field" metadata and methods to derive new metadata
// objects from the base data.

import { formFields } from './formFields';

export class FormData {
  constructor() {
    this.formData = formFields;
  }

  get formFields() {
    return this.formData;
  }

  get formInput() {
    return this.createFormInput();
  }

  createFormInput() {
    let formInput = {};
    for (let i = 0; i < this.formData.length; i++) {
      formInput[this.formData[i].id] = { value: '', isValid: false };
    }
    return formInput;
  }

  get validFormKeys() {
    return this.createValidFormKeys();
  }

  createValidFormKeys() {
    let validFormKeys = [];
    for (let i = 0; i < this.formData.length; i++) {
      validFormKeys.push(this.formData[i].id);
    }
    return validFormKeys;
  }

}
