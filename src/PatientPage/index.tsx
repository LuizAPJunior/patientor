/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from 'react';
import axios from 'axios';
import { useParams} from "react-router-dom";
import { apiBaseUrl } from '../constants';
import { addEntry, useStateValue } from '../state';
import { Box, Typography, Button } from "@material-ui/core";
import { Diagnosis, Patient, Entry } from '../types';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { setPatient, setDiagnoses } from '../state';
import EntryDetails from '../components/EntryDetails';
import AddEntryModal from '../AddEntryModal'; 
import { EntryFormValues } from '../AddEntryModal/AddEntryForm';



const PatientPage  =  () => {

    const { id } = useParams<{ id: string }>();
    const [{patients}, dispatch] = useStateValue();
    const entries = patients[`${id}`]['entries']; 
    const patient = patients[`${id}`];

    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>();

    const openModal = (): void => setModalOpen(true);

    const closeModal = (): void => {
      setModalOpen(false);
      setError(undefined);
    };
  
    const submitNewEntry = async (values: EntryFormValues) => {
      try {
        const { data: newEntry } = await axios.post<Entry>(
          `${apiBaseUrl}/patients/${id}/entries`,
          values
        );
        dispatch(addEntry(patient, newEntry));
        closeModal();
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          console.error(e?.response?.data || "Unrecognized axios error");
          setError(String(e?.response?.data?.error) || "Unrecognized axios error");
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
        }
      }
    };
  


     
    React.useEffect(()=>{
        const fetchPatient = async () => {
            const patient = patients[`${id}`];
            if(!patient.ssn) {
                try {
                    const { data: patientFromApi } = await axios.get<Patient>(
                        
                        `${apiBaseUrl}/patients/${id}`
                      ); 
                    dispatch(setPatient(patientFromApi));       
                } catch (error) {
                    console.log(error);   
                }
            }
        };
        
        
        void fetchPatient();   
    },[dispatch]);

    React.useEffect(()=>{
        const fetchDiagnoses = async () => {
            // const patient = patients[`${id}`];
           
                try {
                    const { data: diagnosesFromApi } = await axios.get<Diagnosis[]>(
                        
                        `${apiBaseUrl}/diagnoses/`
                      ); 
                    dispatch(setDiagnoses(diagnosesFromApi));       
                } catch (error) {
                    console.log(error);   
                }
            
        };
        
        
        void fetchDiagnoses();   
    },[dispatch]);


    const genderIcon = (gender: string) : unknown => {
        switch(gender){
            case "male":
                return <MaleIcon/>;
            break;    
            case "female":
                return <FemaleIcon/>;
            break;      
            case "other":
                return <PersonPinIcon/>;
            break;  
            default:
                return <MaleIcon/>;
            break;    
                        
        }
    };

    return (
        <Box>
            <Typography variant="h6">
            {  patients[`${id}`].name }
            {" "}  
            { genderIcon(patients[`${id}`].gender)}
            </Typography>
            <Typography>
            
            ssn: {patients[`${id}`].ssn }
            </Typography>
            <Typography>
                occuppation: {patients[`${id}`].occupation}
            </Typography>
             {entries[0]? <p><b>entries</b></p>: null}
             {/* {entries.map(entry =>  <Box key={entry.id}>
                <Typography>{ entry.date} <i>{entry.description}</i></Typography>
                <ul>{ entry.diagnosisCodes?.map(diagnosisCode => <li key={diagnosisCode}>{diagnosisCode} {diagnoses[diagnosisCode]? diagnoses[diagnosisCode].name: null} </li>)} </ul>
             </Box>)} */}
             {entries.map(entry =>  <EntryDetails entry={entry} key={entry.id}/>)}   
             <AddEntryModal
                modalOpen={modalOpen}
                onSubmit={submitNewEntry}
                error={error}
                onClose={closeModal}
            />
            <Button variant="contained" onClick={() => openModal()}>
                Add New Entry
            </Button>
        </Box>

    );
};

export default PatientPage;