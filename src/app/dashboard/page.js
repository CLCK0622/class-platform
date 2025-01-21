"use client";

import { Box, Container, Typography } from "@mui/material";
import * as React from "react";
import NavBar from "../nav-bar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = React.useState(null);

    useEffect(() => {
        async function fetchSession() {
            const token = localStorage.getItem("token");
            if (!token) {
                setTimeout(() => {
                    router.push("/");
                }, 250);
                return;
            }

            const res = await fetch("/api/session", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        }

        fetchSession();
    }, []);

    return (
        <>
            <NavBar />
            <Container maxWidth="xl" sx={{ marginTop: 8 }}>
                <Box><Typography sx={{ textAlign: "center", mt: 10, fontSize: 30 }}>Dashboard</Typography></Box>
                <Box maxWidth="xl" bgcolor="white" sx={{ textAlign: "center", mt: 5 }}>Hi! {user ? (user.username) : "null user"}</Box>
        </Container >
        </>
    );
}