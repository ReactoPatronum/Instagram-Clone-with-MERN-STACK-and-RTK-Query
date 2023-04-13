/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Divider } from "@mui/material";
import { useSearchUserMutation } from "@/redux/services/userService";
import { toast } from "react-toastify";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "@/redux/slices/searchModalSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal() {
  const { modal } = useSelector((store) => store.searchModal);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchUser] = useSearchUserMutation();
  const router = useRouter();
  const handleOpen = () => dispatch(setModal(true));
  const handleClose = () => {
    dispatch(setModal(false));
    setSearch("");
  };

  //inputa girilen her karakteri algılayıp post request yapıyoruz.

  const searchedUsers = async () => {
    await searchUser({ search })
      .unwrap()
      .then((res) => {
        setUsers(res);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message);
      });
  };

  useEffect(() => {
    searchedUsers();
  }, [search]);

  return (
    <div>
      <div
        onClick={handleOpen}
        className="flex items-center cursor-pointer w-full hover:bg-gray-100 p-2 dark:hover:bg-gray-500  rounded-full transition-all duration-200"
      >
        <SearchOutlinedIcon fontSize="large" />
        <h5 className="mx-4 hidden lg:block">Ara</h5>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={modal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade className="w-11/12 max-w-sm h-4/5 border rounded-lg" in={modal}>
          <Box sx={style}>
            <h5 className="text-2xl ">Ara</h5>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ara"
              id="search"
              name="search"
              type="text"
              className="w-full my-5 rounded-lg  border-gray-200 border p-2 bg-gray-100 outline-none placeholder:text-xs"
            />
            <Divider />
            <div className="space-y-2 mt-3">
              {users?.map((user) => (
                <div
                  onClick={() => {
                    dispatch(setModal(false));
                    setSearch("");
                    router.push(`/profil/${user.username}`);
                  }}
                  className="flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded-lg transition-all duration-200"
                  key={user.username}
                >
                  <img
                    src={user.profilePicture}
                    alt="profil"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="mx-3">
                    <div className="flex items-center">
                      <h5 className="font-bold text-sm">{user.username}</h5>
                      <VerifiedIcon
                        fontSize="small"
                        className="text-blue-500 ml-1"
                      />
                    </div>
                    <h5 className="text-gray-500 text-sm">{user.fullName}</h5>
                  </div>
                </div>
              ))}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
