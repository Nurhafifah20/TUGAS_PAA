import React from "react";
import { Box, Button, TextField } from "@mui/material";
import axios from "axios";

export default function Login({ setUser }) {
  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data);
    axios.post("http://localhost:5000/login", data).then((response) => {
      if (response.status === 200) {
        window.localStorage.setItem("auth", response.data.token);
        return setUser(true);
      }
      return setUser(null);
    });
  }
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign In
      </Button>
    </Box>
  );
}
