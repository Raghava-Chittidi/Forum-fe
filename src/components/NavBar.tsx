import { selectorStateType } from "../types/types";
import { authActions } from "../store";
import { usernameToColour } from "../util/util";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import ForumIcon from "@mui/icons-material/Forum";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const settings = ["Profile", "Logout"];

const NavBar = React.memo(function navBar() {
    const isLoggedIn = useSelector((state: selectorStateType) => state.auth.isLoggedIn);
    const username = useSelector((state: selectorStateType) => state.auth.userData?.username);
    const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const logoutHandler = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/logout`, { withCredentials: true });
            navigate("/login");
            dispatch(authActions.logout());
        } catch (err) {
            console.log(err);
            toast.error(err.message || "Unable to logout. Please try again later");
        }
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "#4169E1",
                boxShadow: "none",
                width: "100%",
            }}
        >
            <Container sx={{ width: "100%", m: 0, minWidth: "100vw" }}>
                <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                            onClick={() => navigate("/threads")}
                            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        >
                            <ForumIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
                            <Typography
                                noWrap
                                component="a"
                                sx={{
                                    mr: 3,
                                    fontWeight: 700,
                                    fontSize: "1.4rem",
                                    textDecoration: "none",
                                }}
                            >
                                ForumZone
                            </Typography>
                        </Box>
                        {isLoggedIn && (
                            <Typography
                                sx={{ fontWeight: 700, cursor: "pointer" }}
                                variant="body1"
                                onClick={() => {
                                    navigate("/threads/create");
                                }}
                            >
                                Create Thread
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {isLoggedIn ? (
                            <>
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: usernameToColour(username!),
                                        }}
                                    >
                                        {username![0].toUpperCase()}
                                    </Avatar>
                                </IconButton>
                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                            <Typography
                                                textAlign="center"
                                                onClick={setting === "Logout" ? logoutHandler : () => {}}
                                            >
                                                {setting}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                    textDecoration: "none",
                                    color: "white",
                                    fontFamily: "monospace",
                                    cursor: "pointer",
                                }}
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Typography>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
});
export default NavBar;
