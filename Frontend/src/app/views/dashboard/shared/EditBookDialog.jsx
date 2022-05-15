import * as React from 'react';
import {useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


import { ValidatorForm,  } from 'react-material-ui-form-validator'

export default function EditBookDialog(props) {
    const [state, setState] = useState({
        title:props.data.title ,
        image:props.data.image ,
        amount: props.data.amount,
    })

    useEffect(() => {
        if (props.data !== undefined ) { 
        console.log(props.data) 
         setState(props.data)

        }
    }, [props.data])


    const handleChange = (event) => {
        event.persist()
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }
    const {
        title,
        image,
        amount,
    } = state

    const handleSubmit = (event) => {
        console.log(state)
        props.handleEdit(state)
    }

    return (


        <div>
            <Dialog open={props.open} onClose={props.handleClose}>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogContent>
                    <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="Title"
                            fullWidth
                            name="title"
                            variant="standard"
                            value={title}
                            onChange={handleChange}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="image"
                            label="Image"
                            fullWidth
                            name="image"
                            variant="standard"
                            value={image}
                            onChange={handleChange}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="amount"
                            label="Amount"
                            fullWidth
                            name="amount"
                            variant="standard"
                            value={amount}
                            onChange={handleChange}
                        />
                    </ValidatorForm>

                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={props.handleClose}>Cancel</Button>
                    <Button color="success" onClick={handleSubmit}>Save</Button> 
                </DialogActions>
            </Dialog>
        </div>
    );
}
