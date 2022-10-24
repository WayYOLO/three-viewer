# three-viewer

## viewer

![image](https://github.com/WayYOLO/three-viewer/raw/main/assets/img/Jietu20221024-092728-HD.gif)

## Getting Started

Install dependencies,

```bash
$ npm i @wayyolo/three-viewer
```

Start the dev server,

```javascript
  // get the parent element of the viewer
  let parentDiv = document.getElementById ('bim');

  // initialize the viewer with the parent element and some parameters
  embeddedViewer = new OV.EmbeddedViewer (parentDiv, {
      backgroundColor : new OV.RGBAColor (255, 255, 255, 0),
      onModelLoaded : () => {
          let model = embeddedViewer.GetModel ();
          console.log(model)
          // do something with the model
          // embeddedViewer.viewer.SetEdgeSettings (true, new OV.RGBColor (0, 0, 0), 1);
      }
  });
  // load a model providing model urls
  embeddedViewer.LoadModelFromUrlList ([
      'https://github.com/WayYOLO/three-viewer/raw/main/assets/model/model.obj',
      'https://github.com/WayYOLO/three-viewer/raw/main/assets/model/model.mtl'
  ]);
```
