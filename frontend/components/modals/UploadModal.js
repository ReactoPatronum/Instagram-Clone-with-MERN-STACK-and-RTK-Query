/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Backdrop,
  CircularProgress,
  Divider,
  TextField,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { deepOrange } from "@mui/material/colors";
import { useCreatePostMutation } from "../../redux/services/postServices";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { style } from "../../styles/style";
import { useSelector } from "react-redux";

export default function TransitionsModal({ text, icon }) {
  const router = useRouter();
  const [createPost] = useCreatePostMutation();
  const [open, setOpen] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [description, setDescription] = React.useState("");
  const ref = React.useRef(null);
  const [imageURL, setImageURL] = React.useState([]);
  const [backdrop, setBackdrop] = React.useState(false);
  const { user } = useSelector((store) => store.auth);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false), setImages([]), setDescription("");
  };

  function handleImage(e) {
    setImages((current) => [...current, ...e.target.files]);
  }

  //resmi blob olarak kaydedip ekranda önizleme
  React.useEffect(() => {
    setImageURL([]);
    images.map((image) =>
      setImageURL((current) => [
        ...current,
        { name: image.name, URL: URL.createObjectURL(image) },
      ])
    );
  }, [images]);

  //gönderiyi oluştur
  async function createPostAndUploadImage() {
    if (!images || !description) {
      toast.error("İlgili Alanları Doldurunuz.");
      return false;
    }
    try {
      setBackdrop(true);
      handleClose();
      await createPost({ images, description })
        .unwrap()
        .then((res) => {
          if (res.isSuccess) {
            toast.success("Gönderi Başarıyla Oluşturuldu.");
            router.push(`/profil/${user.username}`);
          }
        })
        .finally(() => setBackdrop(false));
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  }

  return (
    <div className="w-full">
      <div className="z-50">
        <Backdrop
          className="z-50"
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backdrop}
        >
          <div className="flex flex-col items-center">
            <CircularProgress color="inherit" />
            <h5 className="text-lg">Lütfen Bekleyin</h5>
          </div>
        </Backdrop>
      </div>
      <div
        onClick={handleOpen}
        className="flex items-center cursor-pointer w-full hover:bg-gray-100 p-2 dark:hover:bg-gray-500  rounded-full transition-all duration-200"
      >
        {icon}
        <h5 className="mx-4 hidden lg:block">{text}</h5>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade
          className="border-none rounded-lg min-h-[30vh] w-4/5 max-w-3xl p-0"
          in={open}
        >
          <Box sx={style}>
            <div className="flex items-center  py-3 justify-between">
              {imageURL.length > 0 ? (
                <button
                  onClick={() => ref.current.click()}
                  className="  text-blue-500 ml-2"
                >
                  Ekle
                </button>
              ) : (
                <div></div>
              )}
              <Typography
                id="transition-modal-title"
                variant="h8"
                component="h2"
                className="font-semibold"
              >
                Yeni gönderi oluştur
              </Typography>
              {imageURL.length > 0 ? (
                <button
                  onClick={() => createPostAndUploadImage()}
                  className="  text-blue-500 mr-2"
                >
                  Paylaş
                </button>
              ) : (
                <div></div>
              )}
            </div>
            <input
              multiple
              hidden
              ref={ref}
              type="file"
              onChange={handleImage}
            />
            <Divider />
            {!imageURL.length > 0 ? (
              <div className="flex flex-col items-center justify-center mt-10 h-full space-y-2">
                <ImageOutlinedIcon fontSize="large" />
                <h5 className="text-lg tracking-widest">Fotoğraf Yükle</h5>
                <button
                  onClick={() => ref.current.click()}
                  className="text-white font-semibold text-sm rounded-md bg-blue-500 p-1 px-4"
                >
                  Bilgisayardan seç
                </button>
              </div>
            ) : (
              <div className="">
                <Carousel
                  showStatus={false}
                  showThumbs={true}
                  showIndicators={false}
                >
                  {imageURL.map((image, i) => (
                    <img
                      key={i}
                      className="object-cover h-full w-full "
                      src={image.URL}
                      alt="uploadimage"
                    />
                  ))}
                </Carousel>
                <div className="px-2 my-4">
                  <div className="flex items-center mb-2">
                    <Avatar
                      sx={{ width: 30, height: 30, bgcolor: deepOrange[500] }}
                    >
                      E
                    </Avatar>
                    <div className="mx-2">Emre</div>
                  </div>
                  <TextField
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    id="outlined-multiline-static"
                    multiline
                    rows={2}
                    placeholder="Açıklama Yaz"
                  />
                </div>
              </div>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
