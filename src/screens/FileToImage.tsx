import React from 'react';

import axios from 'axios';

const style: React.CSSProperties = {
  display: "flex",
  // height: "100vh",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}

const api = "https://fullstack.exercise.applifting.cz/"
const IMAGES = "images"
const imageId = "236ad379-dd1b-43e0-ab98-fc1ad1c5b372"

type TProps = NoChildren

export const FileToImage: React.FC<TProps> = () => {
  const [baseImage, setBaseImage] = React.useState("")
  const [baseImage2, setBaseImage2] = React.useState("")
  // const [raw, setRaw] = React.useState("")

  React.useEffect(() => {
    axios
      .get(api + IMAGES + "/" + imageId, {
        headers: {
          "X-API-KEY": "ba113e43-e68f-4afb-bad5-e73551f3f06f",
          Authorization: "14ca9347-62d7-41b9-a087-10b916cf6bbe",
        },
        responseType: "arraybuffer",
      })
      .then((response) => Buffer.from(response.data, "binary").toString("base64"))
      .then((file) => setBaseImage("data:image/jpeg;base64," + file))
  }, [])

  React.useEffect(() => {
    axios
      .get(api + IMAGES + "/" + imageId, {
        headers: {
          "X-API-KEY": "ba113e43-e68f-4afb-bad5-e73551f3f06f",
          Authorization: "14ca9347-62d7-41b9-a087-10b916cf6bbe",
        },
        responseType: "blob",
      })
      .then((res) => {
        const reader = new FileReader()
        reader.readAsDataURL(res.data)
        reader.onload = () => {
          const imageDataUrl = reader.result
          if (typeof imageDataUrl === "string") {
            setBaseImage2(imageDataUrl)
          }
        }
      })
  }, [])

  return (
    <div style={style}>
      {baseImage.length > 0 ? (
        <img src={baseImage2} height="200px" alt="cat" />
      ) : (
        <p>loading image...</p>
      )}
      {/* <p>{baseImage}</p>
      <p>{baseImage2}</p> */}
      {/* <p>{baseImage === baseImage2 ? "True" : "False"}</p>
      <p>{baseImage.slice(0, 50)}</p> */}
    </div>
  )
}
