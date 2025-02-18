const {
    AppBar,
    Container,
    Toolbar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Button,
    Tooltip,
    Avatar
} = require("@mui/material");
import * as React from "react";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Link} from "@mui/material";

function NavBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const router = useRouter();

    const pages = [{name: '选课中心', href: "/selectCourses"}, {name: '单词背诵', href: "/recite"},];

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", {method: "POST"});
            localStorage.removeItem("token");
            setTimeout(() => {
                router.push("/");
            }, 250);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        async function fetchSession() {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch("/api/session", {
                headers: {Authorization: `Bearer ${token}`},
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
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/dashboard"
                        sx={{
                            mr: 1,
                            display: 'flex',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Demo
                    </Typography>
                    <Box sx={{flexGrow: 1, display: 'flex'}}>
                        {pages.map((page, index) => (
                            <Button
                                key={index}
                                onClick={handleCloseNavMenu}
                                href={page.href}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{flexGrow: 0}}>
                        {user ? (
                            <Tooltip title="显示菜单">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar alt="Remy Sharp" src={user.avatar_url || ""}/>
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Link href={"/"}>
                                <Button sx={{color: "white"}}>登录/注册</Button>
                            </Link>
                        )}
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <Link color="inherit" underline="none" sx={{textAlign: 'center'}} href={"/courses"}>
                                <MenuItem>我的课程</MenuItem>
                            </Link>
                            <Link color="inherit" underline="none" sx={{textAlign: 'center'}} href={"/dashboard"}>
                                <MenuItem>个人中心</MenuItem>
                            </Link>
                            <MenuItem sx={{textAlign: 'center'}} onClick={handleLogout}>
                                登出
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;