# three-viewer

## viewer

![image]()

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
      './model/model.obj',
      './model/model.mtl'
  ]);
```
