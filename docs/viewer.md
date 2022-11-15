---
nav:
  title: Viewer
  path: /viewer
---

### Start

Demo:

```tsx
import React, {useState, useEffect} from 'react';
import * as THV from '@wayyolo/three-viewer';

const areaList = [
  {
    id: '9999999',
    areaNo: 0,
    name: '全工区'
  },
  {
    id: '805',
    areaNo: 1,
    name: '一工区'
  },
  {
    id: '808',
    areaNo: 2,
    name: '二工区'
  },
  {
    id: '2132',
    areaNo: 3,
    name: '三工区'
  },
  {
    id: '806',
    areaNo: 4,
    name: '四工区'
  },
  {
    id: '807',
    areaNo: 5,
    name: '五工区'
  }
]
let embeddedViewer = null
const BIM = () => {
  const [currAreaNo, setCurrAreaNo] = useState(0)
  useEffect(() => {
    // OV.SetExternalLibLocation ('libs');
    // get the parent element of the viewer
    let parentDiv = document.getElementById ('bim');

    // initialize the viewer with the parent element and some parameters
    embeddedViewer = new THV.EmbeddedViewer (parentDiv, {
        backgroundColor : new THV.RGBAColor (255, 255, 255, 0),
        onModelLoaded : () => {
            let model = embeddedViewer.GetModel ();
            console.log(model)
            // do something with the model
            highlightArea(0)
            // embeddedViewer.viewer.SetEdgeSettings (true, new THV.RGBColor (0, 0, 0), 1);
        }
    });
    // load a model providing model urls
    embeddedViewer.LoadModelFromUrlList ([
        'https://raw.githubusercontent.com/WayYOLO/three-viewer/main/assets/model/good.obj',
        'https://raw.githubusercontent.com/WayYOLO/three-viewer/main/assets/model/good.mtl'
    ]);
    console.log(embeddedViewer)
  }, [])

  const highlightArea = (areaNo) => {
    const id = areaList.find(item => item.areaNo === areaNo).id
    embeddedViewer.viewer.SetMeshesVisibility ((meshUserData) => {
        if (areaList.find(item => +item.id === meshUserData.originalMeshId.meshIndex) &&  meshUserData.originalMeshId.meshIndex !== +id) {
            return false;
        }
        return true;
    });
  }

  const handleAreaChange = (event) => {
    const areaNo =  +event.target.value
    setCurrAreaNo(areaNo)
    if(areaNo === 0) {
      fitModelToWindow()
    } else {
      fitMeshToWindow(areaNo)
    }
    highlightArea(areaNo)
  }

  const fitModelToWindow = () => {
    let boundingSphere = embeddedViewer.viewer.GetBoundingSphere ((meshUserData) => {
      return meshUserData;
    });
    embeddedViewer.viewer.FitSphereToWindow (boundingSphere, true);
  }

  const fitMeshToWindow = (areaNo) => {
    const id = areaList.find(item => item.areaNo === areaNo).id
    let boundingSphere = embeddedViewer.viewer.GetBoundingSphere ((meshUserData) => {
      return meshUserData.originalMeshId.meshIndex ===  +id;
    });
    embeddedViewer.viewer.FitSphereToWindow (boundingSphere, true);
  }

  return (
    <div className="bim-container">
      <div className="tree">
        <select value={currAreaNo} onChange={handleAreaChange}>
          {areaList.map(item => <option key={item.areaNo} value={item.areaNo}>{item.name}</option>)}
        </select>
      </div>
      <div id="bim" />
    </div>
  )
}

export default BIM
```

<!-- More skills for writing demo: https://d.umijs.org/guide/basic#write-component-demo -->
