import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import {
  Select,
  TextField
} from 'redux-form-material-ui';
import Dialog, {
  DialogActions,
  DialogContent,  
  DialogTitle,
} from 'material-ui/Dialog';

import { required, number } from './helpers/validators';



let TradeForm = props => {
  const { handleSubmit, handleCancel, open } = props;
  const fieldStype = {minWidth: "400px"}

  return (    
    <form onSubmit={ handleSubmit }>
      <Dialog open={open} onRequestClose={handleCancel}>
        <DialogTitle>Report Trade</DialogTitle>
        <DialogContent>
          <div>            
            <Field name="client" component={Select} style={fieldStype} label="Client" value={''} displayEmpty={true} >
              <MenuItem value={''}><em>Select Client</em></MenuItem>
              <MenuItem value={'client1'}>Client 1</MenuItem>
              <MenuItem value={'client2'}>Client 2</MenuItem>
            </Field>
          </div>
          <div>        
            <Field name="traderName" validate={required} component={TextField} label="Trader Name" style={fieldStype}  />
          </div>
          <div>        
            <Field name="size" validate={[required, number]} component={TextField} label="Size" style={fieldStype} />
          </div>
          <div>        
            <Field name="price" validate={[required, number]} component={TextField} label="Price" style={fieldStype} />
          </div>
          <div>        
            <Field name="counterparty" validate={required} component={TextField} label="Counterparty Name" style={fieldStype} />
          </div>          
        </DialogContent>
        <DialogActions>
          <Button raised onClick={handleCancel}>Cancel</Button>        
          <Button raised onClick={handleSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>      
    </form>
  )
}

TradeForm = reduxForm({
  // a unique name for the form
  form: 'trade'
})(TradeForm)

export default TradeForm;