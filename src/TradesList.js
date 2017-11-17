import React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import NumberFormat from 'react-number-format';


const TradesList = props => {
  const { trades } = props;

  const listItems = trades.map((trade) =>
    <TableRow key={trade.internalTradeID}>
      <TableCell>{trade.internalTradeID}</TableCell>
      <TableCell numeric><NumberFormat value={trade.size} displayType={'text'} thousandSeparator={true} /></TableCell>
      <TableCell numeric><NumberFormat value={trade.price} displayType={'text'} thousandSeparator={true} /></TableCell>
      <TableCell>{trade.counterparty}</TableCell>
      <TableCell>{trade.client}</TableCell>
    </TableRow>
  );
  return (
    <div>
      <Toolbar>Trades</Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Trade ID</TableCell>
            <TableCell numeric>Size</TableCell>
            <TableCell numeric>Price</TableCell>
            <TableCell>Counterparty</TableCell>
            <TableCell>Client</TableCell>
          </TableRow>      
        </TableHead>
        <TableBody>
          {listItems}
        </TableBody>
      </Table>        
    </div>
  );
}

export default TradesList;

