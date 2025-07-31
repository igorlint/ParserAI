import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import api from '../services/api';
import Layout from '../components/Layout';

interface HistoryRecord {
  id: number;
  sku: string;
  warehouseId: number;
  type: string;
  quantityChange: number;
  initiator: string;
  createdAt: string;
}

const HistoryPage: React.FC = () => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  useEffect(() => {
    api.get<HistoryRecord[]>('/stock/history')
      .then(res => setRecords(res.data))
      .catch(console.error);
  }, []);
  return (
    <Layout>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Qty Change</TableCell>
              <TableCell>Initiator</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.sku}</TableCell>
                <TableCell>{r.warehouseId}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell>{r.quantityChange}</TableCell>
                <TableCell>{r.initiator}</TableCell>
                <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default HistoryPage;
