import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
// import ImageUpload from '../../shared/components/FormElements/ImageUpload';
// import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
// import { VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { formInput } from '../formData/formInput';
import { formFields } from '../formData/formFields';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './CourseForm.css';

const NewCourse = () => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    formInput,
    false
  );

  const history = useHistory();

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT_C || 3002;

  const courseSubmitHandler = async event => {
    event.preventDefault();

    // Note: that the purchaseSequence field being referred to as "n" is an artifact
    // of support for loading courses from an Excel spreadsheet, where this is the
    // column title
    try {
      // const formData = new FormData();
      // formData.append('n', formState.inputs.purchaseSequence.value);
      // formData.append('title', formState.inputs.title.value);
      // formData.append('category', formState.inputs.category.value);
      // formData.append('tools', formState.inputs.tools.value);
      // formData.append('hours', formState.inputs.hours.value);
      // formData.append('sections', formState.inputs.sections.value);
      // formData.append('lectures', formState.inputs.lectures.value);
      // formData.append('instructor', formState.inputs.instructor.value);
      // formData.append('dateBought', formState.inputs.dateBought.value);
      // formData.append('dateFinished', formState.inputs.dateFinished.value);
      await sendRequest(
        `${backendUrl}:${backendPort}/addCourse`,
        'POST',
        JSON.stringify(
          {
            course:
            {
              n: formState.inputs.n.value,
              Title: formState.inputs.title.value,
              Category: formState.inputs.category.value,
              Tools: formState.inputs.tools.value,
              Hours: formState.inputs.hours.value,
              Sections: formState.inputs.sections.value,
              Lectures: formState.inputs.lectures.value,
              Instructor: formState.inputs.instructor.value,
              Bought: formState.inputs.dateBought.value,
              Finished: formState.inputs.dateFinished.value
            }
          }
        ),
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.token
        }
      );
      history.push(`/${auth.userId}/courses`); // send user back to courses page
    } catch (err) {
      // console.log(err.message);
    }
  };

  // 12/13/21
  // There is NO WAY around using eval in the code below.  I tried using Function
  // but it gave the same warnings about eval and then failed because the variable
  // was not in scope.  I also tried moving evaluation into the Input component but
  // that just moves the problem -- still can't do a "double interpolation" without
  // using the unsafe eval function!  At least the eslint directive turns off the
  // warning about it.
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="course-form" onSubmit={courseSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        {
          formFields.map(field => {
            return <Input
              key={field.id}
              id={field.id}
              element={field.element}
              label={field.label}
              validators={field.validators}
              errorText={field.errorText}
              onInput={inputHandler}
              initialValue=''
              initialIsValid={false}
            />;
          }
          )
        }
        {/* <Input
          id="purchaseSequence"
          element="input"
          type="text"
          label="Purchase Sequence"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errorText="Please enter a valid purchase sequence"
        />
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errorText="Please enter a valid title"
        />
        <Input
          id="category"
          element="textarea"
          label="Category"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errorText="Please enter a valid category"
        />
        <Input
          id="tools"
          element="input"
          type="text"
          label="Tools"
          validators={[VALIDATOR_REQUIRE]}
          onInput={inputHandler}
          errorText="Please enter a valid tool (or tools)."
        />
        <Input
          id="hours"
          element="input"
          type="text"
          label="Hours"
          validators={[VALIDATOR_REQUIRE]}
          onInput={inputHandler}
          errorText="Please enter a valid number of hours."
        />
        <Input
          id="sections"
          element="input"
          type="text"
          label="Sections"
          validators={[VALIDATOR_REQUIRE]}
          onInput={inputHandler}
          errorText="Please enter a valid number of sections."
        />
        <Input
          id="lectures"
          element="input"
          type="text"
          label="Lectures"
          validators={[VALIDATOR_REQUIRE]}
          onInput={inputHandler}
          errorText="Please enter a valid number of lectures."
        />
        <Input
          id="instructor"
          element="input"
          type="text"
          label="Instructor"
          validators={[VALIDATOR_REQUIRE]}
          onInput={inputHandler}
          errorText="Please enter a valid instructor."
        />
        <Input
          id="dateBought"
          element="input"
          type="text"
          label="Date Bought"
          validators={[VALIDATOR_REQUIRE]}
          onInput={inputHandler}
          errorText="Please enter a valid bought date."
        />
        <Input
          id="dateFinished"
          element="input"
          type="text"
          label="Date Finished"
          validators={[VALIDATOR_REQUIRE]}
          onInput={inputHandler}
          errorText="Please enter a valid finished date."
        /> */}
        {/* <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        /> */}
        <div className="course-item__actions">
          <Button type="submit" disabled={!formState.isValid}>
            ADD COURSE
          </Button>
          <Button to={`/`} cancel>CANCEL</Button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default NewCourse;
