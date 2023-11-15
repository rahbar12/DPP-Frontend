const NavBar = ({user, setToken}) => {
    const logOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        return setToken("");
    }
    return (
        <div style={{height: "10%", display: "flex", marginLeft: "2%", marginRight: "2%", alignItems: "center"}}>
            <span style={{ marginRight: "auto", fontWeight: "700" }}>{user.name}</span>
            <span style={{ cursor: "pointer", fontWeight: "700" }} onClick={logOut} className="underline">Log Out</span>
        </div>
    )
}

export default NavBar;