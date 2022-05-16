import {
  Button,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import ServerTable from "ServerTable";
import Login from "Login";

function App() {
  const [clientData, setClientData] = useState([]);
  const [serverData, setServerData] = useState([]);
  const [user, setUser] = useState(
    window.localStorage.getItem("auth") ? true : null
  );
  function fetchData() {
    axios.get("http://localhost:3300/get-current").then((response) => {
      console.log(response.data);
      return setClientData(response.data);
    });
  }
  useEffect(() => {
    fetchData();
  }, []);

  function fetchServer() {
    axios
      .get("http://localhost:5000/get-sync-data", {
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem("auth"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setServerData(response.data);
      });
  }

  function disconnect() {
    window.localStorage.removeItem("auth");
    setUser(null);
    setServerData([]);
  }

  function sync() {
    axios.post("http://localhost:3300/sync", serverData).then(() => {
      fetchData();
    });
  }
  console.log(user);
  console.log(clientData);
  return (
    <Box p={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 3,
          gap: 2,
        }}
      >
        {user && (
          <Button variant="contained" color="error" onClick={disconnect}>
            Disconnect
          </Button>
        )}
        <Button variant="contained" onClick={fetchServer}>
          Fetch Data
        </Button>
        {serverData.length !== 0 && (
          <Button variant="contained" onClick={sync}>
            Sinkronkan
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Typography variant="h6"> Client </Typography>
        </Grid>
        <Grid item xs={12} md={5}>
          {user ? (
            <Typography variant="h6"> Server </Typography>
          ) : (
            <Typography variant="h6" textAlign={"center"}>
              Login to connect with server
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} md={7}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Created at</TableCell>
                  <TableCell>Last Update</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientData.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      {row.map((col) => {
                        return <TableCell>{col}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={5}>
          {user ? (
            <ServerTable data={serverData} />
          ) : (
            <Login setUser={setUser} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
