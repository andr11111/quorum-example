import React from 'react'
import { Field, reduxForm } from 'redux-form'

let ViewTradeForm = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={ handleSubmit }>
      <div>
        <label htmlFor="tradeID">Trade ID</label>
        <Field name="tradeID" component="input" type="text" />
      </div>                         
      <button type="submit">Submit</button>
    </form>
  )
}

ViewTradeForm = reduxForm({
  // a unique name for the form
  form: 'viewTrade'
})(ViewTradeForm);

export default ViewTradeForm;