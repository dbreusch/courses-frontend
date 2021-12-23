import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { VALIDATOR_NUMERIC } from '../../shared/util/validators';
import { VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { VALIDATOR_GT } from '../../shared/util/validators';
import { VALIDATOR_MIN } from '../../shared/util/validators';

export const formFields = [
  {
    "id": "n",
    "alias": "purchaseSequence",
    "label": "Purchase Sequence",
    "validators": [VALIDATOR_REQUIRE(), VALIDATOR_NUMERIC(), VALIDATOR_MIN(1)],
    "type": "number",
    "errorText": "Please enter an integer purchase sequence > 0.",
    "initialValue": "loadedCourse.purchaseSequence",
    "updateable": "true"
  },
  {
    "id": "title",
    "label": "Title",
    "validators": [VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)],
    "errorText": "Title must be at least five characters.",
    "initialValue": "loadedCourse.title",
    "updateable": "true"
  },
  {
    "id": "category",
    "label": "Category",
    "validators": [VALIDATOR_REQUIRE()],
    "errorText": "Please enter a valid category value.",
    "initialValue": "loadedCourse.category",
    "updateable": "true"
  },
  {
    "id": "tools",
    "label": "Tools",
    "validators": [VALIDATOR_REQUIRE()],
    "errorText": "Please enter a valid tools value.",
    "initialValue": "loadedCourse.tools",
    "updateable": "true"
  },
  {
    "id": "hours",
    "label": "Hours",
    "validators": [VALIDATOR_REQUIRE(), VALIDATOR_NUMERIC(), VALIDATOR_GT(0)],
    "errorText": "# of hours value must be > 0.",
    "initialValue": "loadedCourse.hours",
    "updateable": "true"
  },
  {
    "id": "sections",
    "label": "Sections",
    "validators": [VALIDATOR_REQUIRE(), VALIDATOR_NUMERIC(), VALIDATOR_GT(0)],
    "errorText": "Please enter an integer # of sections value > 0.",
    "initialValue": "loadedCourse.sections",
    "updateable": "true"
  },
  {
    "id": "lectures",
    "label": "Lectures",
    "validators": [VALIDATOR_REQUIRE(), VALIDATOR_NUMERIC(), VALIDATOR_GT(0)],
    "errorText": "Please enter an integer # of lectures value > 0.",
    "initialValue": "loadedCourse.lectures",
    "updateable": "true"
  },
  {
    "id": "instructor",
    "label": "Instructor",
    "validators": [VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(3)],
    "errorText": "Instructor name must be at least three characters.",
    "initialValue": "loadedCourse.instructor",
    "updateable": "true"
  },
  {
    "id": "dateBought",
    "label": "Date Bought",
    "type": "date",
    "validators": [VALIDATOR_REQUIRE()],
    "errorText": "Please enter a valid bought date.",
    "initialValue": "loadedCourse.dateBought",
    "updateable": "true"
  },
  {
    "id": "dateCompleted",
    "label": "Date Completed",
    "type": "date",
    "validators": [],
    "errorText": "Please enter a valid completion date.",
    "initialValue": "loadedCourse.dateCompleted",
    "initialIsValid": "true",
    "updateable": "true"
  },
  {
    "id": "description",
    "element": "textarea",
    "label": "Description",
    "validators": [],
    "errorText": "Please enter a valid description.",
    "initialValue": "loadedCourse.description",
    "initialIsValid": "true",
    "updateable": "true"
  },
  {
    "id": "notes",
    "element": "textarea",
    "label": "Notes",
    "validators": [],
    "errorText": "Please enter valid notes.",
    "initialValue": "loadedCourse.notes",
    "initialIsValid": "true",
    "updateable": "true"
  },
  {
    "id": "provider",
    "label": "Provider",
    "validators": [],
    "errorText": "Please enter a valid provider name.",
    "initialValue": "loadedCourse.provider",
    "initialIsValid": "true",
    "updateable": "true"
  },
];
