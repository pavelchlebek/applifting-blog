import React from 'react';

import axios from 'axios';
import {
  Navigate,
  useNavigate,
  useParams,
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
import { IArticleDetail } from '../ArticleDetailScreen/ArticleDetailScreen';
import classes from './EditArticleScreen.module.css';

type TProps = NoChildren

interface IImageData {
  imageId: string
  name: string
}

type TUploadImageSuccess = IImageData[]

export const EditArticleScreen: React.FC<TProps> = () => {
  const authContext = useAuthContext()

  const params = useParams()
  const articleId = params.articleId

  const getHeaders = React.useMemo(() => {
    if (authContext.token) {
      return {
        "X-API-KEY": tenant.apiKey,
        Authorization: authContext.token?.accessToken,
      }
    }
  }, [authContext.token])

  const [title, setTitle] = React.useState("")
  const [perex, setPerex] = React.useState("")
  const [image, setImage] = React.useState<File | Blob | undefined>()
  const [imageSource, setImageSource] = React.useState("")
  const [content, setContent] = React.useState("")

  const [originalImageId, setOriginalImageId] = React.useState("")

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
            headers: getHeaders,
          }
        )
        return response
      } catch (err) {
        console.log("uploadImageError: ", err)
      }
    } else {
      // setImageError("You forgot to upload and image!")
      // setShowModal(true)
    }
  }

  const postArticle = async () => {
    const imageResponse = await uploadImage()
    if (title.length > 0 && perex.length > 0 && content.length > 0) {
      setOtherErrors("")
      try {
        await axios.patch(
          `${API.server}${API.endpoints.ARTICLES}/${articleId}`,
          {
            title: title,
            perex: perex,
            imageId: imageResponse && imageResponse.data[0].imageId,
            content: content,
          },
          {
            headers: getHeaders,
          }
        )
        navigate("/my-articles")
      } catch (err) {
        console.log("postingArticleError: ", err)
      }
    } else {
      setOtherErrors("All input fields must contain at least one character!")
      setShowModal(true)
    }
  }

  const inputImageRef = React.useRef<HTMLInputElement>(null)

  // fetching article to be edited
  React.useEffect(() => {
    const getPicture = async (imageId: string) => {
      try {
        const response = await axios.get(`${API.server}${API.endpoints.IMAGES}/${imageId}`, {
          headers: getHeaders,
          responseType: "blob",
        })
        const imageString = response.data
        const reader = new FileReader()
        reader.readAsDataURL(imageString)
        reader.onload = () => {
          const imageDataUrl = reader.result
          if (typeof imageDataUrl === "string") {
            setImageSource(imageDataUrl)
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
    const getArticle = async () => {
      try {
        const response = await axios.get<IArticleDetail>(
          `${API.server}${API.endpoints.ARTICLES}/${articleId}`,
          {
            headers: getHeaders,
          }
        )
        getPicture(response.data.imageId)
        // setArticleDetail(response.data)
        // setting individual inputs
        setTitle(response.data.title)
        setPerex(response.data.perex)
        setContent(response.data.content)
        setOriginalImageId(response.data.imageId)
      } catch (err) {
        console.log(err)
      }
    }
    getArticle()
  }, [articleId, getHeaders])

  const handleDeleteImage = async () => {
    try {
      const response = await axios.delete(
        `${API.server}${API.endpoints.IMAGES}/${originalImageId}`,
        {
          headers: getHeaders,
        }
      )
      if (response.status === 204) setImageSource("")
    } catch (err) {
      console.log("error while deleting image: ", err)
    }
  }

  if (!authContext.token) return <Navigate to="/" />

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
          <ScreenHeading title="Edit article" />
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
        {imageSource && <img className={classes.displayImage} src={imageSource} alt="Upload" />}
        <div className={classes.imageContainer}>
          <Button
            style={{ width: "147px" }}
            color="secondary"
            title="Upload new"
            onClick={() => inputImageRef.current?.click()}
          />
          <Button
            style={{ marginLeft: "17px" }}
            color="primary"
            onClick={() => handleDeleteImage()}
            title="Delete"
          />
        </div>
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
