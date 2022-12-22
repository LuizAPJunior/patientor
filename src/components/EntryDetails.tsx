import React from "react";
import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry }  from "../types";
import { Box, Typography } from "@material-ui/core";
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';

/**
 * Helper function for exhaustive type checking
 */
 const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

const healthRating = (healthRating:number):string =>{
    switch(healthRating){
        case 0:
            return 'green';
        case 1:  
            return 'yellow';
        case 2:
            return 'orange';
        case 3:
            return 'red';  
        default:
            return 'blue';      

    }
};

const HealthCheck: React.FC<{entry: HealthCheckEntry}> = ({entry}) => {    
    return(
        <Box sx={{border: '1px solid #000', marginBottom: '1rem', padding: '1em'}}>
            <Typography>{entry.date} <MedicalInformationIcon/> </Typography>
            <Typography><i>{entry.description} </i></Typography> 
            <FavoriteIcon sx={{color:healthRating(entry.healthCheckRating)}}/>
            <Typography>diagnose by {entry.specialist}</Typography> 
        </Box>
    );
};


const Hospital: React.FC<{entry: HospitalEntry}> = ({entry}) => {
    return(
        <Box sx={{border: '1px solid #000', marginBottom: '1rem', padding: '1em'}}>
            <Typography>{entry.date} <LocalHospitalIcon/> </Typography>
            <Typography><i>{entry.description}</i></Typography> 
            <Typography>diagnose by {entry.specialist}</Typography> 
            <Typography>in {entry.discharge.date} {entry.discharge.criteria}</Typography> 
        </Box>
    );
};

const OccupationalHealthCare:  React.FC<{entry: OccupationalHealthcareEntry }> = ({entry}) => {
    return(
        <Box sx={{border: '1px solid #000', marginBottom: '1rem', padding: '1em'}}>
            <Typography>{entry.date} <WorkIcon/> {entry.employerName}</Typography>
            <Typography><i>{entry.description} </i></Typography> 
            <Typography>diagnose by {entry.specialist}</Typography> 
        </Box>
    );
};

const EntryDetails: React.FC<{entry: Entry}> = ({entry}) =>{
    switch(entry.type){
        case "HealthCheck":
            return <HealthCheck entry={entry}/>;
        case "Hospital":
            return <Hospital entry={entry}/>;  
        case "OccupationalHealthcare":   
            return <OccupationalHealthCare entry={entry}/>;  
        default:
            return assertNever(entry);    
    }
    
};


export  default EntryDetails;