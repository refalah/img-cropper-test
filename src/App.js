import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  const canvasRef = useRef(null)


  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const theImage = new Image()

    theImage.src = 'image.png'
    theImage.onload = () => {
      context.drawImage(theImage, 0, 0, theImage.naturalWidth, theImage.naturalHeight)
      context.globalCompositeOperation = "copy"
      const scannedImage = context.getImageData(0, 0, theImage.naturalWidth, theImage.naturalHeight)

      const imgHeight = scannedImage.height
      const imgWidth = scannedImage.width
      console.log(scannedImage, imgHeight, 'SCANNED')
      const scannedData = scannedImage.data
      let acceptedArr = []
      let coordinates = []
      for (let i = 0; i < scannedData.length; i += 4) {
        // console.log(i, scannedData[i])

        const sum = scannedData[i] + scannedData[i + 1] + scannedData[i + 2] + scannedData[i + 3];
        if (sum === 255) {
          // console.log(i, scannedData[i], 'i')
          let tempArr = []

          for (let j = 0; j <= 40; j += 4) {
            const next = i + j
            const newSum = scannedData[next] + scannedData[next + 1] + scannedData[next + 2] + scannedData[next + 3];
            // console.log(scannedData[next], next, newSum, 'j')
            tempArr.push(newSum)
          }

          const findIt = tempArr.findIndex((arr) => arr !== 255)
          const linearPosition = (i) / 4
          let y = parseInt((linearPosition) / theImage.naturalWidth);
          // let y = Math.floor((linearPosition) / theImage.naturalWidth);
          const x = linearPosition - y * theImage.naturalWidth;

          if (findIt === -1) {
            if (acceptedArr.length === 0 && coordinates.length === 0) {
              acceptedArr.push(linearPosition)
              coordinates.push({ x, y })
            }
          } else if (findIt === tempArr.length - 1) {
            acceptedArr.push(linearPosition)
            coordinates.push({ x, y })
          }

        }
      }

      const cropX = coordinates[0].x;
      const cropY = coordinates[0].y;
      const cropWidth = coordinates[coordinates.length - 1].x;
      const cropHeight = coordinates[coordinates.length - 1].y - cropY;

      context.canvas.width = cropWidth
      context.canvas.height = coordinates[coordinates.length - 1].y

      console.log(cropX, cropY, cropWidth, cropHeight, 'check')

      context.drawImage(theImage, cropX, cropY, cropWidth, cropHeight, 0, 0, context.canvas.width, context.canvas.height);
      // context.drawImage(theImage, cropX, cropY, cropWidth, cropHeight, 0, 0, theImage.naturalWidth, theImage.naturalHeight);
      // context.drawImage(theImage, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      console.log(coordinates, 'COORDINATES')
    }

  }, [])

  const saveImage = (event) => {
    let link = event.currentTarget;
    link.setAttribute('download', 'output.png')
    let image = canvasRef.current.toDataURL("image/png");
    link.setAttribute('href', image)
  }
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <canvas className='canvasPrime' ref={canvasRef} width={400} height={500} />

        <a
          id='download_btn'
          className="App-link"
          href="download_img"
          rel="noopener noreferrer"
          onClick={saveImage}
        >
          Download Image
        </a>
      </header>
    </div>
  );
}

export default App;
