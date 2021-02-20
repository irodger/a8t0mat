import { AppBar, Toolbar, Typography } from "@material-ui/core";

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h5" color="inherit" style={{ marginLeft: "16px" }}>
          A8T0M4T
        </Typography>
        <div style={{ marginLeft: "auto" }}>
          use it when you feel - Bcё 3ae6aJLo
        </div>
      </Toolbar>
    </AppBar>
  );
}
