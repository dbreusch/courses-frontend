import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
// import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './CourseSummary.css';

const CourseItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const history = useHistory();

  // const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT_C || 3002;

  // const assetUrl = process.env.REACT_APP_ASSET_URL;

  // const openMapHandler = () => setShowMap(true);

  // const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${backendUrl}:${backendPort}/${props.id}`,
        'DELETE',
        null,
        {
          'Authorization': 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
      history.push(`/${auth.userId}/courses`);  // send user back to courses page
    } catch (err) {
      console.log(err.message);
    }
  };

  let desc = '';
  if (props.description) {
    desc = props.description;
    if (props.description.length > 25) {
      desc = props.description.slice(0, 24) + "...";
    }
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/* <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="course-summary__modal-content"
        footerClass="course-summary__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map
            center={props.coordinates}
            zoom={16}
          />
        </div>
      </Modal> */}

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="course-summary__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
          </React.Fragment>
        }>
        <p>Do you want to proceed and delete this course?
          Please note that it can't be undone thereafter.</p>
      </Modal>

      <li className="course-summary">
        <Card className="course-summary__content">
          {isLoading && <LoadingSpinner asOverlay />}
          {/* <div className="course-summary__image">
            <img src={`${assetUrl}/${props.image}`} alt={props.title} />
          </div> */}
          <div className="course-summary__info">
            <h2>{props.title}</h2>
            <h3>{props.instructor}</h3>
            <p>{desc}</p>
          </div>
          <div className="course-summary__actions">
            {/* <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button> */}
            {auth.userId === props.creatorId && (
              <Button to={`/courses/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}
              >DELETE
              </Button>
            )}
            <Button to={`/`} cancel>BACK</Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default CourseItem;
