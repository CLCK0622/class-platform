"use client"

import React from "react";
import { Container, Typography, Box, Tabs, Tab, TextField, Button, Collapse, Alert, IconButton, Grid2 } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import NavBar from "./nav-bar.js";
import "../style/landing.scss";

export default function Home() {
    const [activeTab, setActiveTab] = React.useState(0);
    const [openLoginAlert, LoginAlert] = React.useState(false);
    const [openRegisterAlert, RegisterAlert] = React.useState(false);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        LoginAlert(false);
        RegisterAlert(false);
    };
    return (
        <>
            <NavBar />
            <Container maxWidth="sm" sx={{ marginTop: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Class Selection Demo
                </Typography>
                <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                    <Typography variant="body1" color="textSecondary">
                        Notice: xxx
                    </Typography>
                </Box>
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                    <Tab label="Log In" />
                    <Tab label="Register" />
                </Tabs>
                {activeTab === 0 && (
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField fullWidth label="Username" margin="normal" />
                        <TextField fullWidth label="Password" type="password" margin="normal" />
                        <Collapse in={openLoginAlert}>
                            <Alert
                                severity="warning"
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            LoginAlert(false);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{ mt: 2 }}
                            >
                                Login in progress...
                            </Alert>
                        </Collapse>
                        <Grid2
                            container
                            direction="row"
                            sx={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Button onClick={() => { LoginAlert(true); }} disabled={openLoginAlert} variant="contained" sx={{ mt: 2 }}>
                                Log In
                            </Button>
                        </Grid2>
                    </Box>
                )}
                {activeTab === 1 && (
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField fullWidth label="Username" margin="normal" />
                        <TextField fullWidth label="Email" type="email" margin="normal" />
                        <TextField fullWidth label="Password" type="password" margin="normal" />
                        <Collapse in={openRegisterAlert}>
                            <Alert
                                severity="warning"
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            RegisterAlert(false);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{ mt: 2 }}
                            >
                                Register in progress...
                            </Alert>
                        </Collapse>
                        <Grid2
                            container
                            direction="row"
                            sx={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Button onClick={() => {
                                RegisterAlert(true);
                            }} disabled={openRegisterAlert} variant="contained" sx={{ mt: 2 }}>
                                Register
                            </Button>
                        </Grid2>
                    </Box>
                )}
            </Container>
        </>
    );
}