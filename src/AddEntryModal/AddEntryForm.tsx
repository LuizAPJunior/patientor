import { useStateValue } from "../state";
import { HealthCheckRating, Entry, EntryType } from "../types";
import { Field, Formik, Form} from "formik";
import { Grid, Button } from "@material-ui/core";
import { TextField, DiagnosisSelection, HealthCheckOption, SelectField, EntryTypeOption } from "../AddPatientModal/FormField";


// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property

export type EntryFormValues =  UnionOmit<Entry, 'id'>;


interface Props{
    onSubmit: (values: EntryFormValues) => void;
    onCancel: () => void;
}


const healthCheckOptions: HealthCheckOption[] = [
    { value: HealthCheckRating.Healthy, label: "Healthy" },
    { value: HealthCheckRating.LowRisk, label: "Low Risk" },
    { value: HealthCheckRating.HighRisk, label: "High Risk" },
    { value: HealthCheckRating.CriticalRisk, label: "Critical Risk" }
  ];


const typeOptions: EntryTypeOption[] = [
  {value: "HealthCheck", label: "Health Check"},
  {value: "Hospital", label: "Hospital"},
  {value: "OccupationalHealthcare", label: "Occupational Healthcare"}
];  

const AddEntryForm = ({onSubmit, onCancel}: Props) => {

    const [{diagnoses}] = useStateValue();

    return(
    <Formik 
    initialValues={{
        type:  "HealthCheck" || "Hospital" || "OccupationalHealthcare",
        description: "",
        date:"",
        specialist:"",
        diagnosisCodes: [],
        healthCheckRating:  HealthCheckRating.Healthy
    }}
    validate={(values) => {
      const requiredError = "Field is required";
      const errors: { [field: string]: string } = {};
      if(!values.description){
        errors.description = requiredError;
      }
      if(!values.date){
        errors.date = requiredError;
      }
      else if(!/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(values.date)){
        errors.date = "Date is formatted incorrectly";
      }
      if(!values.specialist){
        errors.specialist = requiredError;
      }
      if(values.type==="OccupationalHealthcare"){
        errors.employerName = requiredError;
      }
    
      return errors;
    }}
    onSubmit={onSubmit}
    >
        {({ isValid, dirty, setFieldValue, setFieldTouched, values, errors }) => {
          console.log(errors);
          
        const  setType = (type: EntryType) =>{
          switch(type){
            case "HealthCheck":
              return( 
                <SelectField label="Health check rating" name="healthCheckRating" options={healthCheckOptions} />
              );
            case "Hospital":
              return(
              <> 
                <Field
                label="Date Of Discharge"
                placeholder="YYYY-MM-DD"
                name="discharge.date"
                component={TextField}
                />
                <Field
                label="Criteria"
                placeholder="Criteria"
                name="discharge.criteria"
                component={TextField}
                />
              </>
              ); 
            case "OccupationalHealthcare":
                return (
                  <>
                    <Field
                    label="Start Date Of Sick Leave"
                    placeholder="YYYY-MM-DD"
                    name="sickLeave.startDate"
                    component={TextField}
                    />
                    <Field
                    label="End Date Of Sick Leave"
                    placeholder="YYYY-MM-DD"
                    name="sickLeave.endDate"
                    component={TextField}
                    />
                    <Field
                    label="Employer Name"
                    placeholder="Employer Name"
                    name="employerName"
                    component={TextField}
                    />
                  </>
                );

          }
        };  
        return (
         
          <Form className="form ui">
             <SelectField label="Choose your Entry type" name="type" options={typeOptions} />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date Of Medical Record"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                diagnoses={Object.values(diagnoses)}
            />  
           {setType(values.type)}
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
    );

};

export default AddEntryForm;