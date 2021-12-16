import React from 'react';

import axios from 'axios';
import {
  Navigate,
  useNavigate,
} from 'react-router-dom';

import {
  API,
  tenant,
} from '../../api';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { Screen } from '../../components/Screen/Screen';
import { ScreenHeading } from '../../components/ScreenHeading/ScreenHeading';
import { TextInput } from '../../components/TextInput/TextInput';
import { useAuthContext } from '../../store/auth-context';
import classes from './NewArticleScreen.module.css';

type TProps = NoChildren

interface IImageData {
  imageId: string
  name: string
}

type TUploadImageSuccess = IImageData[]

export const NewArticleScreen: React.FC<TProps> = () => {
  const authContext = useAuthContext()

  let headers = {}
  if (authContext.token) {
    headers = {
      "X-API-KEY": tenant.apiKey,
      Authorization: authContext.token?.accessToken,
    }
  }

  const [title, setTitle] = React.useState("")
  const [perex, setPerex] = React.useState("")
  const [image, setImage] = React.useState<File | Blob | undefined>()
  const [imageSource, setImageSource] = React.useState("")
  const [content, setContent] = React.useState("")

  const [imageError, setImageError] = React.useState("")
  const [otherErrors, setOtherErrors] = React.useState("")
  const [showModal, setShowModal] = React.useState(false)

  const navigate = useNavigate()

  const fileSelectedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0])
      const reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = () => {
        const imageDataUrl = reader.result
        if (typeof imageDataUrl === "string") {
          setImageSource(imageDataUrl)
        }
      }
    }
  }

  const uploadImage = async () => {
    const formData = new FormData()
    if (image) {
      setImageError("")
      formData.append("image", image)
      try {
        const response = await axios.post<TUploadImageSuccess>(
          `${API.server}${API.endpoints.IMAGES}`,
          formData,
          {
            headers: headers,
          }
        )
        return response
      } catch (err) {
        console.log("uploadImageError: ", err)
      }
    } else {
      setImageError("You forgot to upload and image!")
      setShowModal(true)
    }
  }

  const postArticle = async () => {
    const imageResponse = await uploadImage()
    if (title.length > 0 && perex.length > 0 && content.length > 0) {
      setOtherErrors("")
      try {
        if (imageResponse) {
          const response = await axios.post(
            `${API.server}${API.endpoints.ARTICLES}`,
            {
              title: title,
              perex: perex,
              imageId: imageResponse.data[0].imageId,
              content: content,
            },
            {
              headers: headers,
            }
          )
          navigate("/my-articles")
        }
      } catch (err) {
        console.log("postingArticleError: ", err)
      }
    } else {
      setOtherErrors("All input fields must contain at least one character!")
      setShowModal(true)
    }
  }

  const inputImageRef = React.useRef<HTMLInputElement>(null)

  if (!authContext.token) return <Navigate to="../articles" />

  return (
    <Screen loggedIn={authContext.token ? true : false}>
      <Modal onModalClose={() => setShowModal(false)} show={showModal}>
        <p className={classes.modalMessage}>{imageError && imageError}</p>
        <p className={classes.modalMessage}>{otherErrors && otherErrors}</p>
        <div className={classes.confirmButtonWrapper}>
          <Button color="primary" onClick={() => setShowModal(false)} title="Got it" />
        </div>
      </Modal>
      <div className={classes.page}>
        <div className={classes.headingRow}>
          <ScreenHeading title="Create new article" />
          <div className={classes.buttonWrapper}>
            <Button color="primary" title="Publish Article" onClick={() => postArticle()} />
          </div>
        </div>
        <TextInput
          onChange={(e) => setTitle(e.currentTarget.value)}
          value={title}
          label="Article Title"
          placeholder="My First Article"
        />
        <h4 className={classes.label}>Article Perex</h4>
        <textarea
          placeholder="Type Your Perex"
          className={classes.perexBody}
          value={perex}
          onChange={(e) => setPerex(e.target.value)}
        />
        <h4 className={classes.label}>Featured Image</h4>
        <input
          ref={inputImageRef}
          style={{ display: "none" }}
          type="file"
          onChange={(e) => fileSelectedHandler(e)}
        />
        <div className={classes.imageContainer}>
          <Button
            style={{ width: "147px" }}
            color="secondary"
            title="Upload an Image"
            onClick={() => inputImageRef.current?.click()}
          />
          {/* <div className={classes.imageFileName}>{image?.name}</div> */}
        </div>
        {imageSource && <img className={classes.displayImage} src={imageSource} alt="Upload" />}
        <h4 className={classes.label + " " + classes.extraMarginTop}>Content</h4>
        <textarea
          placeholder="Supports markdown. Yay!"
          className={classes.contentBody}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </Screen>
  )
}
