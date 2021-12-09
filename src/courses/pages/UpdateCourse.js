import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './CourseForm.css';

// const DUMMY_PLACES = [
//     {
//         id: 'p1',
//         title: 'Empire State Building',
//         description: 'One of the most famous skyscrapers in the world',
//         imageUrl: 'https://graylinenewyork.com/files/7515/1843/2729/ben-dumond-empire-state-building-new-york.jpg',
//         address: '20 W 34th St, New York, NY 10001',
//         location: {
//             lat: 40.7484405,
//             lng: -73.9878584
//         },
//         creator: 'u1'
//     },
//     {
//         id: 'p2',
//         title: 'Emp. State Building',
//         description: 'One of the most famous skyscrapers in the world',
//         imageUrl: 'https://graylinenewyork.com/files/7515/1843/2729/ben-dumond-empire-state-building-new-york.jpg',
//         address: '20 W 34th St, New York, NY 10001',
//         location: {
//             lat: 40.7484405,
//             lng: -73.9878584
//         },
//         creator: 'u2'
//     }
// ];

const UpdateCourse = () => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const placeId = useParams().placeId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${backendUrl}/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true
            },
            description: {
              value: responseData.place.description,
              isValid: true
            }
          },
          true
        );
      } catch (err) {
        // console.log(err.message);
      }
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData, backendUrl]);

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `${backendUrl}/places/${placeId}`,
        'PATCH',
        JSON.stringify(
          {
            title: formState.inputs.title.value,
            description: formState.inputs.description.value
          }
        ),
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.token
        }
      );
      history.push(`/${auth.userId}/places`);
    } catch (err) {
      // console.log(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace &&
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialIsValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
            errorText="Please enter a valid description (at least 5 characters)"
            initialValue={loadedPlace.description}
            initialIsValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      }
    </React.Fragment>
  );
};

export default UpdateCourse;
