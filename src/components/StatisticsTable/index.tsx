import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
} from '@material-ui/core';
import API from '../../utils/API';

type TableColumn = {
  id: string,
  label: string,
  minWidth: number,
  align?: 'right' | 'left' | 'center' | 'justify' | 'inherit',
  format?: (value: string | number) => string,
};

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 440,
    margin: 'auto',
    marginTop: '60px',
  },
  container: {
    maxHeight: 440,
  },
  head: {
    fontWeight: 600,
  },
});

export default function StatisticsTable(): JSX.Element {
  const [rows, setRows] = useState([]);
  const classes = useStyles();
  const columns: TableColumn[] = [
    { id: 'userName', label: 'Name', minWidth: 70 },
    {
      id: 'date',
      label: 'Game Date',
      minWidth: 100,
      align: 'right',
      format: (value: string) => new Date(value).toLocaleString('en-US'),
    },
    {
      id: 'score',
      label: 'Score',
      minWidth: 70,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchStr = 'api/get_users';
    API.get(fetchStr)
      .then((res) => res.data)
      .then((data) => {
        if (!data) {
          return;
        }

        const result: {
          userName: string,
          date?: string,
          score?: number,
          count?: number,
        }[] = [];

        data.forEach((userRow: {
          userName: string,
          history: { date: string, score: number }[]
        }) => {
          result.push({ userName: userRow.userName, count: userRow.history.length + 1 });

          userRow.history.forEach((histItem: { date: string, score: number }) => {
            result.push({ userName: '', date: histItem.date, score: histItem.score });
          });
        });

        if (isMounted) {
          setRows(result);
        }
      })
      .catch((error) => {
        setRows([{ userName: `Could not load statistic data: ${error.toString()}` }]);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="glass">
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                row.count
                  ? (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={`${row.userName}${row.count}`}
                    >
                      <TableCell key="userName" align="left" colSpan={3}>
                        {row.userName}
                      </TableCell>

                    </TableRow>
                  )
                  : (
                    <TableRow hover role="checkbox" tabIndex={-1} key={`${row.date}`}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
