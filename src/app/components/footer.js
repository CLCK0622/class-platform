import React from "react";
import Link from "next/link";
import styles from "../../style/footer.module.scss";
import { Typography, Container, Box } from "@mui/material";
import { Facebook, Twitter, Instagram, GitHub } from "@mui/icons-material";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <Container maxWidth="lg">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    py={4}
                >
                    <Typography variant="body1" color="textSecondary" align="center">
                        © 2024-{new Date().getFullYear()} 选课报课网站. All rights reserved.
                    </Typography>
                    <Typography variant="body1" color="textSecondary" align="center">
                        Made with Next.js. Powered by Vercel.
                    </Typography>
                </Box>
            </Container>
        </footer>
    );
};

export default Footer;
