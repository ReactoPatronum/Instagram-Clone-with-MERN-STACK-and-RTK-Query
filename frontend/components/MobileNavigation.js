import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import Paper from "@mui/material/Paper";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "@/redux/slices/searchModalSlice";

export default function FixedBottomNavigation() {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);
  const router = useRouter();
  const { user } = useSelector((store) => store.auth);

  React.useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
  }, [value]);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          className="dark:bg-gray-700"
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            className=" dark:text-white"
            onClick={() => router.push("/anasayfa")}
            label="Anasayfa"
            icon={<HomeOutlinedIcon />}
          />
          <BottomNavigationAction
            onClick={() => dispatch(setModal(true))}
            className=" dark:text-white"
            label="Ara"
            icon={<SearchOutlinedIcon />}
          />
          <BottomNavigationAction
            className=" dark:text-white"
            onClick={() => router.push("/explore")}
            label="Keşfet"
            icon={<ExploreOutlinedIcon />}
          />
          <BottomNavigationAction
            className=" dark:text-white"
            onClick={() => router.push(`/profil/${user.username}`)}
            label="Profil"
            icon={<AccountCircleOutlinedIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
