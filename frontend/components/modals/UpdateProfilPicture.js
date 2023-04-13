/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { CircularProgress, Tooltip } from "@mui/material";
import { useUpdateProfilPictureMutation } from "@/redux/services/userService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setProfilPicture } from "@/redux/slices/authSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
//kullanıcının profile resmini güncelleme
export default function TransitionsModal({ picture, profile, refetch }) {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [updateProfilPicture] = useUpdateProfilPictureMutation();
  const [backdrop, setBackdrop] = React.useState(false);
  const [imageURL, setImageURL] = React.useState("");
  const [image, setImage] = React.useState("");
  const ref = React.useRef(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setImage("");
    setImageURL("");
  };

  async function handleImage(e) {
    setImage(e.target.files[0]);
    handleOpen();
  }

  async function changeProfilPicture() {
    setOpen(false);
    setBackdrop(true);
    await updateProfilPicture({ image, profile })
      .unwrap()
      .then((res) => {
        if (res.isSuccess) {
          setOpen(false);
          dispatch(setProfilPicture(res.imageUrl));
          refetch();
          toast.success(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message);
      })
      .finally(() => {
        setBackdrop(false);
      });
  }

  React.useEffect(() => {
    if (image) {
      setImageURL({ name: image.name, URL: URL.createObjectURL(image) });
    }
  }, [image]);

  return (
    <div>
      <div className="z-50">
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backdrop}
        >
          <div className="flex flex-col items-center">
            <CircularProgress color="inherit" />
            <h5 className="text-lg">Lütfen Bekleyin</h5>
          </div>
        </Backdrop>
      </div>
      <Tooltip title="Profil resmini değiştir" placement="bottom">
        <img
          onClick={() => ref.current.click()}
          className="rounded-full object-cover w-20 h-20 sm:w-28 sm:h-28 cursor-pointer"
          alt="profilePicture"
          src={picture}
        />
      </Tooltip>
      <input
        accept="image/*"
        hidden
        ref={ref}
        type="file"
        onChange={handleImage}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade className="rounded-lg p-0 border" in={open}>
          <Box sx={style}>
            <div className="flex items-center justify-between mx-3 py-2 px-1">
              <button
                onClick={handleClose}
                className="text-red-500 font-semibold text-sm"
              >
                İptal
              </button>
              <button
                onClick={changeProfilPicture}
                className="text-blue-500 font-semibold text-sm"
              >
                Uygula
              </button>
            </div>
            <img
              className="object-cover h-full w-full "
              src={imageURL.URL}
              alt="uploadimage"
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
